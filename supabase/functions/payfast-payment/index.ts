import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PayFastPaymentData {
  amount: number;
  itemName: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
}

// MD5 hash implementation using Deno's built-in crypto
async function md5Hash(input: string): Promise<string> {
  // Use Deno's native crypto module which is always available
  const crypto = await import('node:crypto');
  return crypto.createHash('md5').update(input).digest('hex');
}

// PHP urlencode equivalent for JavaScript
function phpUrlencode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/~/g, '%7E')
    .replace(/%20/g, '+'); // PHP urlencode uses + for spaces
}

async function generatePayFastSignature(data: Record<string, any>, passphrase: string): Promise<string> {
  // Filter out empty values and signature field - PayFast requirement
  const filteredData: Record<string, any> = {};
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    // Only include non-empty values
    if (key !== 'signature' && value !== '' && value !== null && value !== undefined) {
      filteredData[key] = value;
    }
  });

  // Sort by key and create parameter string with PHP urlencode
  // PayFast uses PHP's urlencode() function for signature generation
  const sortedKeys = Object.keys(filteredData).sort();
  const paramString = sortedKeys
    .map(key => {
      const value = filteredData[key].toString().trim();
      // Use PHP-compatible URL encoding
      return `${key}=${phpUrlencode(value)}`;
    })
    .join('&');

  // Add passphrase with URL encoding
  const stringToHash = `${paramString}&passphrase=${phpUrlencode(passphrase)}`;
  
  console.log('PayFast parameter string:', paramString);
  console.log('Full string to hash:', stringToHash);
  
  // Generate MD5 hash
  const signature = await md5Hash(stringToHash);
  
  console.log('Generated signature:', signature);
  
  return signature;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user is authenticated
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const paymentData: PayFastPaymentData = await req.json();
    
    // Get PayFast credentials from secrets (fallback to test credentials)
    const merchantId = Deno.env.get('PAYFAST_MERCHANT_ID') || "10000100";
    const merchantKey = Deno.env.get('PAYFAST_MERCHANT_KEY') || "46f0cd694581a";
    const passphrase = Deno.env.get('PAYFAST_PASSPHRASE') || "jt7NOE43FZPn";
    
    // Create payment form data
    const formData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: paymentData.returnUrl,
      cancel_url: paymentData.cancelUrl,
      notify_url: paymentData.notifyUrl,
      name_first: paymentData.customerFirstName,
      name_last: paymentData.customerLastName,
      email_address: paymentData.customerEmail,
      m_payment_id: `WWE-${Date.now()}-${user.id}`, // Unique payment ID with user
      amount: paymentData.amount.toFixed(2),
      item_name: paymentData.itemName,
      item_description: paymentData.itemName,
      email_confirmation: 1,
      confirmation_address: paymentData.customerEmail,
    };

    // Generate proper MD5 signature
    const signature = await generatePayFastSignature(formData, passphrase);
    
    // Log payment attempt for audit
    console.log(`Payment initiated by user ${user.id} for amount ${paymentData.amount}`);
    
    // Store payment record in database
    await supabaseClient.from('orders').insert({
      user_id: user.id,
      total: paymentData.amount,
      status: 'pending',
      payment_method: 'payfast',
      payment_status: 'pending',
      shipping_address: {}, // This should be provided by the client
    });

    return new Response(JSON.stringify({
      success: true,
      formData: { ...formData, signature },
      action: 'https://sandbox.payfast.co.za/eng/process', // Use production URL in production
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('PayFast payment creation failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Payment creation failed',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});