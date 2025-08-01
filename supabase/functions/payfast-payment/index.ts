import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

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

async function generatePayFastSignature(data: Record<string, any>, passphrase: string): Promise<string> {
  // Sort the data by key and create query string
  const sortedData = Object.keys(data)
    .sort()
    .map(key => `${key}=${encodeURIComponent(data[key])}`)
    .join('&');

  // Add passphrase
  const stringToHash = `${sortedData}&passphrase=${encodeURIComponent(passphrase)}`;
  
  // Generate proper MD5 hash
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(stringToHash);
  const hashBuffer = await crypto.subtle.digest('MD5', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}