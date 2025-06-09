import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

export const SEO = ({
  title = "Mushees Ann Arbor - Premium Sacred Mushrooms & Consciousness Exploration",
  description = "Discover premium quality sacred mushrooms in Ann Arbor, MI. Explore consciousness expansion, spiritual journeys, and therapeutic experiences with our curated selection of psilocybin products.",
  keywords = "mushrooms Ann Arbor, psilocybin Michigan, sacred mushrooms, consciousness expansion, spiritual journey, therapeutic mushrooms, psychedelic therapy, Ann Arbor dispensary",
  image = "https://mushees.com/IMG_3809.JPG",
  url = "https://mushees.com/",
  type = "website",
  structuredData
}: SEOProps) => {
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };
    
    // Update basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    
    // Update Twitter tags
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);
    updateMetaTag('twitter:url', url, true);
    
    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
    
    // Add structured data if provided
    if (structuredData) {
      const existingScript = document.querySelector('script[data-seo="dynamic"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-seo', 'dynamic');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
    
  }, [title, description, keywords, image, url, type, structuredData]);
  
  return null;
};

// Predefined SEO configurations for different pages/sections
export const seoConfigs = {
  homepage: {
    title: "Mushees Ann Arbor - Premium Sacred Mushrooms & Consciousness Exploration",
    description: "Discover premium quality sacred mushrooms in Ann Arbor, MI. Explore consciousness expansion, spiritual journeys, and therapeutic experiences with our curated selection of psilocybin products.",
    keywords: "mushrooms Ann Arbor, psilocybin Michigan, sacred mushrooms, consciousness expansion, spiritual journey, therapeutic mushrooms, psychedelic therapy, Ann Arbor dispensary",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Mushees Ann Arbor - Premium Sacred Mushrooms",
      "description": "Premium quality sacred mushrooms for consciousness exploration in Ann Arbor, Michigan",
      "url": "https://mushees.com/",
      "mainEntity": {
        "@type": "Store",
        "name": "Mushees",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "416 W Huron St, Suite 21",
          "addressLocality": "Ann Arbor",
          "addressRegion": "MI",
          "postalCode": "48103",
          "addressCountry": "US"
        }
      }
    }
  },
  
  menu: {
    title: "Sacred Mushroom Menu - Premium Psilocybin Products | Mushees Ann Arbor",
    description: "Browse our curated selection of premium psilocybin mushrooms including Penis Envy, Albino Roller Coaster, and more. Quality consciousness expansion products in Ann Arbor, MI.",
    keywords: "psilocybin menu, mushroom strains, Penis Envy, Albino Roller Coaster, Thrasher Penis Envy, Hillbilly Pumpkins, psychedelic products Ann Arbor",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Sacred Mushroom Menu",
      "description": "Premium psilocybin mushroom products available at Mushees",
      "numberOfItems": 6,
      "itemListElement": [
        {
          "@type": "Product",
          "position": 1,
          "name": "Penis Envy Mushrooms",
          "description": "Premium Penis Envy psilocybin mushrooms"
        },
        {
          "@type": "Product", 
          "position": 2,
          "name": "Albino Roller Coaster",
          "description": "Albino Roller Coaster psilocybin mushrooms"
        }
      ]
    }
  },
  
  location: {
    title: "Visit Mushees in Ann Arbor - Location & Hours | Sacred Mushroom Store",
    description: "Visit Mushees at 416 W Huron St, Suite 21, Ann Arbor, MI 48103. Your premier destination for sacred mushrooms and consciousness exploration products.",
    keywords: "Mushees location, Ann Arbor mushroom store, 416 W Huron St, sacred mushroom dispensary Michigan",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Mushees",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "416 W Huron St, Suite 21",
        "addressLocality": "Ann Arbor",
        "addressRegion": "MI",
        "postalCode": "48103",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "42.2808",
        "longitude": "-83.7430"
      },
      "openingHours": "Mo-Su 10:00-20:00"
    }
  }
}; 