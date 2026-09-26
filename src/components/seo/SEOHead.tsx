import React, { useEffect } from 'react';
import { analytics } from '../../utils/analytics';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FAQItem[];
  schemaType?: 'WebApplication' | 'Article' | 'FAQPage' | 'WebSite';
  articleData?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
  };
  howToSteps?: Array<{
    name: string;
    text: string;
  }>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = '/og-image.png',
  noindex = false,
  breadcrumbs,
  faqs,
  schemaType = 'WebApplication',
  articleData,
  howToSteps,
}) => {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title.includes('Image Optimizer')
      ? title
      : `${title} | Image Optimizer`;
    document.title = formattedTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let meta = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attributeName, attributeValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag(
      'name',
      'robots',
      noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    // 3. Canonical URL
    const resolvedCanonical =
      canonicalUrl ||
      (typeof window !== 'undefined'
        ? window.location.origin + window.location.pathname
        : '');

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', resolvedCanonical);

    // 4. OpenGraph Tags
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', resolvedCanonical);
    setMetaTag('property', 'og:site_name', 'Image Optimizer');
    setMetaTag('property', 'og:locale', 'en_US');
    if (ogImage) {
      const fullImage = ogImage.startsWith('http')
        ? ogImage
        : (typeof window !== 'undefined' ? window.location.origin + ogImage : ogImage);
      setMetaTag('property', 'og:image', fullImage);
    }

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    if (ogImage) {
      const fullImage = ogImage.startsWith('http')
        ? ogImage
        : (typeof window !== 'undefined' ? window.location.origin + ogImage : ogImage);
      setMetaTag('name', 'twitter:image', fullImage);
    }

    // 6. Article Specific Meta
    if (ogType === 'article' && articleData) {
      if (articleData.publishedTime) {
        setMetaTag('property', 'article:published_time', articleData.publishedTime);
      }
      if (articleData.modifiedTime) {
        setMetaTag('property', 'article:modified_time', articleData.modifiedTime);
      }
      if (articleData.author) {
        setMetaTag('property', 'article:author', articleData.author);
      }
      if (articleData.section) {
        setMetaTag('property', 'article:section', articleData.section);
      }
    }

    // 7. Inject or Update JSON-LD Structured Data
    const scriptId = 'seo-structured-data';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemas: object[] = [];

    // WebApplication schema
    if (schemaType === 'WebApplication') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: formattedTitle,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All (Chrome, Safari, Firefox, Edge, Android, iOS)',
        description,
        url: resolvedCanonical,
        browserRequirements: 'Requires JavaScript and HTML5 Canvas API support.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'Lossless and Lossy Image Compression',
          'Exact Target File Size Constraint (e.g. 50KB, 100KB, 200KB)',
          'Client-Side WebP, PNG, JPEG, AVIF Conversion',
          'Biometric Passport & Visa Photo Creator with Face Guides',
          'Side-by-side Visual Quality Comparison Slider',
          '100% In-Browser Local Processing with Zero Server Uploads',
        ],
      });
    }

    // Article schema for guides
    if (schemaType === 'Article' || ogType === 'article') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        url: resolvedCanonical,
        datePublished: articleData?.publishedTime || '2026-01-15T00:00:00Z',
        dateModified: articleData?.modifiedTime || '2026-09-25T00:00:00Z',
        author: {
          '@type': 'Organization',
          name: 'Image Optimizer Engineering Team',
          url: typeof window !== 'undefined' ? window.location.origin : '',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Image Optimizer',
          logo: {
            '@type': 'ImageObject',
            url: typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': resolvedCanonical,
        },
      });
    }

    // BreadcrumbList schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url.startsWith('http')
            ? crumb.url
            : (typeof window !== 'undefined' ? `${window.location.origin}${crumb.url}` : crumb.url),
        })),
      });
    }

    // FAQPage schema
    if (faqs && faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      });
    }

    // HowTo schema
    if (howToSteps && howToSteps.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `How to Use ${title}`,
        description,
        step: howToSteps.map((s, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: s.name,
          text: s.text,
        })),
      });
    }

    // Populate the structured data script
    scriptTag.text = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);

    // Track analytics page view
    analytics.trackPageView(window.location.pathname, formattedTitle);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [
    title,
    description,
    canonicalUrl,
    ogType,
    ogImage,
    noindex,
    breadcrumbs,
    faqs,
    schemaType,
    articleData,
    howToSteps,
  ]);

  return null;
};
