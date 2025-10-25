import React from "react";
import Hero from "@/components/home/Hero";
import SEO from "@/components/SEO";
import { getOrganizationSchema, getWebsiteSchema } from "@/utils/structuredData";

const LandingPage: React.FC = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [getOrganizationSchema(), getWebsiteSchema()],
  };

  return (
    <div>
      <SEO
        title="1145 Lifestyle - Coming Soon"
        description="The future of shopping, reimagined. Discover a world where fashion, beauty, gadgets, and home essentials meet effortless style — all in one place."
        keywords="1145 lifestyle, online shopping, fashion, beauty, gadgets, home essentials, pre-launch"
        structuredData={structuredData}
      />
      <Hero />
    </div>
  );
};

export default LandingPage;
