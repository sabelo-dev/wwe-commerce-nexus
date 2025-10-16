import { Product } from '@/types';

export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Synerge Square',
  url: typeof window !== 'undefined' ? window.location.origin : '',
  logo: typeof window !== 'undefined' ? `${window.location.origin}/uploads/logo.png` : '',
  description: 'Your Premier Online Marketplace for quality products from trusted vendors',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    availableLanguage: 'English',
  },
});

export const getWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Synerge Square',
  url: typeof window !== 'undefined' ? window.location.origin : '',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${typeof window !== 'undefined' ? window.location.origin : ''}/shop?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export const getProductSchema = (product: Product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description || '',
  image: product.images?.[0] || '',
  brand: {
    '@type': 'Brand',
    name: product.vendorName || 'Synerge Square',
  },
  offers: {
    '@type': 'Offer',
    url: typeof window !== 'undefined' ? window.location.href : '',
    priceCurrency: 'ZAR',
    price: product.price,
    availability: product.inStock 
      ? 'https://schema.org/InStock' 
      : 'https://schema.org/OutOfStock',
    seller: {
      '@type': 'Organization',
      name: product.vendorName || 'Synerge Square',
    },
  },
  aggregateRating: product.rating && product.reviewCount ? {
    '@type': 'AggregateRating',
    ratingValue: product.rating,
    reviewCount: product.reviewCount,
  } : undefined,
});

export const getBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
