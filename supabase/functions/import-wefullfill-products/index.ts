import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeFulFillProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price?: number;
  category: string;
  subcategory?: string;
  sku: string;
  quantity: number;
  images?: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const wefullfilToken = Deno.env.get('WEFULLFIL_API_TOKEN');
    if (!wefullfilToken) {
      throw new Error('WeFulFill API token not configured');
    }

    console.log('Fetching products from WeFulFill API...');

    // Try fetching products from WeFulFill API with X-API-Token header
    const response = await fetch('https://wefullfill.com/api/products', {
      method: 'GET',
      headers: {
        'X-API-Token': wefullfilToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('WeFulFill API error response:', errorBody);
      throw new Error(`WeFulFill API error: ${response.status} ${response.statusText}. Response: ${errorBody}`);
    }

    const wefullfilProducts: WeFulFillProduct[] = await response.json();
    console.log(`Fetched ${wefullfilProducts.length} products from WeFulFill`);

    // Get or create a default store for WeFulFill products
    let { data: store, error: storeError } = await supabaseClient
      .from('stores')
      .select('id')
      .eq('slug', 'wefullfill-store')
      .single();

    if (storeError || !store) {
      // Create a default WeFulFill vendor and store
      const { data: vendor, error: vendorError } = await supabaseClient
        .from('vendors')
        .insert({
          business_name: 'WeFulFill',
          status: 'approved',
          user_id: (await supabaseClient.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (vendorError) throw vendorError;

      const { data: newStore, error: newStoreError } = await supabaseClient
        .from('stores')
        .insert({
          vendor_id: vendor.id,
          name: 'WeFulFill Store',
          slug: 'wefullfill-store',
          description: 'Official WeFulFill product catalog',
        })
        .select()
        .single();

      if (newStoreError) throw newStoreError;
      store = newStore;
    }

    let successCount = 0;
    let failedCount = 0;

    // Import products
    for (const wfProduct of wefullfilProducts) {
      try {
        const slug = wfProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Check if product already exists
        const { data: existing } = await supabaseClient
          .from('products')
          .select('id')
          .eq('external_source', 'wefullfill')
          .eq('external_id', wfProduct.id)
          .single();

        if (existing) {
          // Update existing product
          const { error: updateError } = await supabaseClient
            .from('products')
            .update({
              name: wfProduct.name,
              description: wfProduct.description,
              price: wfProduct.price,
              compare_at_price: wfProduct.compare_at_price,
              quantity: wfProduct.quantity,
              category: wfProduct.category,
              subcategory: wfProduct.subcategory,
              sku: wfProduct.sku,
              status: 'approved',
            })
            .eq('id', existing.id);

          if (updateError) throw updateError;
        } else {
          // Insert new product
          const { data: newProduct, error: insertError } = await supabaseClient
            .from('products')
            .insert({
              store_id: store.id,
              name: wfProduct.name,
              slug: slug,
              description: wfProduct.description,
              price: wfProduct.price,
              compare_at_price: wfProduct.compare_at_price,
              quantity: wfProduct.quantity,
              category: wfProduct.category,
              subcategory: wfProduct.subcategory,
              sku: wfProduct.sku,
              status: 'approved',
              external_source: 'wefullfill',
              external_id: wfProduct.id,
            })
            .select()
            .single();

          if (insertError) throw insertError;

          // Insert product images if available
          if (wfProduct.images && wfProduct.images.length > 0 && newProduct) {
            const imageInserts = wfProduct.images.map((url, index) => ({
              product_id: newProduct.id,
              image_url: url,
              position: index,
            }));

            await supabaseClient
              .from('product_images')
              .insert(imageInserts);
          }
        }

        successCount++;
      } catch (error) {
        console.error(`Failed to import product ${wfProduct.id}:`, error);
        failedCount++;
      }
    }

    console.log(`Import complete: ${successCount} success, ${failedCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        total: wefullfilProducts.length,
        success: successCount,
        failed: failedCount,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error importing products:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
