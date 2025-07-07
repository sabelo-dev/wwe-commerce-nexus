import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeFulFilRequestBody {
  endpoint: string;
  method?: string;
  filters?: Record<string, any>;
  productId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user is authenticated and has proper role
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

    // Check if user is admin or vendor
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'vendor'].includes(profile.role)) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { endpoint, method = 'GET', filters, productId }: WeFulFilRequestBody = await req.json();
    
    // Get WeFulFil API token from secrets
    const API_TOKEN = Deno.env.get('WEFULLFIL_API_TOKEN');
    if (!API_TOKEN) {
      return new Response(JSON.stringify({ error: 'WeFulFil API token not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const API_BASE_URL = "https://app.wefullfill.com";
    
    // Build URL based on endpoint
    let url = `${API_BASE_URL}${endpoint}`;
    
    if (endpoint === '/api/products' && filters) {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
      searchParams.append('api_token', API_TOKEN);
      url += `?${searchParams.toString()}`;
    } else if (productId) {
      url = `${API_BASE_URL}/api/products/${productId}?api_token=${API_TOKEN}`;
    } else {
      url += `?api_token=${API_TOKEN}`;
    }

    // Make request to WeFulFil API
    const response = await fetch(url, {
      method,
      headers: {
        "Authorization": `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WeFulFil API Error:', response.status, errorText);
      return new Response(JSON.stringify({ 
        error: `WeFulFil API Error: ${response.status} - ${response.statusText}`,
        details: errorText
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in wefullfil-proxy function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});