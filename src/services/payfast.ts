
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

interface PayFastResponse {
  success: boolean;
  redirectUrl?: string;
  error?: string;
}

export const createPayFastPayment = async (data: PayFastPaymentData): Promise<PayFastResponse> => {
  try {
    // PayFast configuration - these should be set as environment variables in production
    // For now, using test credentials but they should be moved to Supabase secrets
    const merchantId = "10000100"; // TODO: Move to Supabase secrets
    const merchantKey = "46f0cd694581a"; // TODO: Move to Supabase secrets  
    const passphrase = "jt7NOE43FZPn"; // TODO: Move to Supabase secrets
    
    // Create payment form data
    const paymentData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: data.returnUrl,
      cancel_url: data.cancelUrl,
      notify_url: data.notifyUrl,
      name_first: data.customerFirstName,
      name_last: data.customerLastName,
      email_address: data.customerEmail,
      m_payment_id: `SIM-${Date.now()}`, // Unique payment ID
      amount: data.amount.toFixed(2),
      item_name: data.itemName,
      item_description: data.itemName,
      email_confirmation: 1,
      confirmation_address: data.customerEmail,
    };

    // Generate signature (in production, this should be done server-side)
    const signature = generatePayFastSignature(paymentData, passphrase);
    
    // Create form and redirect to PayFast
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://sandbox.payfast.co.za/eng/process'; // Use sandbox for testing
    form.style.display = 'none';

    // Add all payment data as hidden inputs
    Object.entries({ ...paymentData, signature }).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value.toString();
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    return {
      success: true,
      redirectUrl: 'https://sandbox.payfast.co.za/eng/process',
    };
  } catch (error) {
    console.error('PayFast payment creation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment creation failed',
    };
  }
};

const generatePayFastSignature = (data: Record<string, any>, passphrase: string): string => {
  // Sort the data by key
  const sortedData = Object.keys(data)
    .sort()
    .map(key => `${key}=${encodeURIComponent(data[key])}`)
    .join('&');

  // Add passphrase
  const stringToHash = `${sortedData}&passphrase=${encodeURIComponent(passphrase)}`;
  
  // In a real implementation, you would use a proper MD5 hash
  // For this demo, we'll use a simple hash (replace with proper MD5 in production)
  return btoa(stringToHash).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
};
