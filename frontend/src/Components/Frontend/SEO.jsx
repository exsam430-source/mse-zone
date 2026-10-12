import React from 'react';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  ogTitle, 
  ogDescription, 
  ogImage, 
  ogType = "website", 
  canonical, 
  schema 
}) => {
  const siteName = "MSE Zone";
  const defaultTitle = `${siteName} | Ultimate Online Shopping & Clothes E-commerce`;
  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
  
  const defaultDesc = "Discover MSE Zone, your ultimate e-commerce destination for online shopping. Shop the latest collections of high-quality clothes, fashion wear, cosmetics, kitchenware, toys, and lifestyle accessories in the UAE. Enjoy secure checkout, quick shipping, and easy returns.";
  const fullDesc = description || defaultDesc;
  
  const defaultKeywords = "MSE Zone, online shopping, clothes, clothing brand, fashion UAE, buy clothes online, cosmetics, kitchenware, toys, lifestyle accessories, e-commerce store";
  const fullKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  return (
    <>
      {/* Primary Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDesc} />
      <meta name="keywords" content={fullKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || fullDesc} />
      <meta property="og:site_name" content={siteName} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || fullDesc} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Canonical Link */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Structured Data (Schema JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </>
  );
};

export default SEO;
