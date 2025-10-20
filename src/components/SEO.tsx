import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "product" | "article";
  structuredData?: object;
  noindex?: boolean;
}

const SEO = ({
  title = "LSI Mall - Your Premier Online Marketplace",
  description = "Discover quality products from trusted vendors at The Hermetist. Shop electronics, fashion, home goods, and more with fast shipping and secure checkout.",
  keywords = "online marketplace, ecommerce, shopping, vendors, products, electronics, fashion, home goods",
  image = "https://lovable.dev/opengraph-image-p98pqg.png",
  url,
  type = "website",
  structuredData,
  noindex = false,
}: SEOProps) => {
  const fullTitle = title.includes("LSI Mall") ? title : `${title} | The Hermetist`;
  const canonicalUrl = url || typeof window !== "undefined" ? window.location.href : "";

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="The Hermetist" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData && <script type="application/ld+json">{JSON.stringify(structuredData)}</script>}
    </Helmet>
  );
};

export default SEO;
