import React from 'react';
import { Helmet } from 'react-helmet-async';


interface SeoProps {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  keywords?: string;
  locale?: string;
  siteName?: string;
}


const DOMAIN = 'https://www.fakirafab.com';

const Seo: React.FC<SeoProps> = ({
  title,
  description,
  image,
  imageAlt,
  url,
  type = 'website',
  keywords,
  locale = 'en_IN',
  siteName = 'Fakira FAB'
}) => {
  // Ensure canonical and OG URLs are absolute
  let finalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  if (finalUrl && !finalUrl.startsWith('http')) {
    finalUrl = DOMAIN + (finalUrl.startsWith('/') ? finalUrl : '/' + finalUrl);
  }
  // Default OG image
  const ogImage = image || DOMAIN + '/default-og-image.jpg';
  const ogImageAlt = imageAlt || title;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={finalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      {ogImage && <meta property="og:image" content={ogImage} />} 
      {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}

      {/* Twitter */}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {ogImageAlt && <meta name="twitter:image:alt" content={ogImageAlt} />}
    </Helmet>
  );
};

export default Seo;
