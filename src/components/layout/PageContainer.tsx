import React from 'react';
import { SEOHead, type BreadcrumbItem, type FAQItem } from '../seo/SEOHead';
import { Breadcrumbs } from '../common/Breadcrumbs';

export interface PageContainerProps {
  title?: string;
  description?: string;
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
  showBreadcrumbs?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage,
  noindex = false,
  breadcrumbs,
  faqs,
  schemaType,
  articleData,
  howToSteps,
  showBreadcrumbs = true,
  children,
  className = '',
}) => {
  return (
    <>
      {title && description && (
        <SEOHead
          title={title}
          description={description}
          canonicalUrl={canonicalUrl}
          ogType={ogType}
          ogImage={ogImage}
          noindex={noindex}
          breadcrumbs={breadcrumbs}
          faqs={faqs}
          schemaType={schemaType}
          articleData={articleData}
          howToSteps={howToSteps}
        />
      )}

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
        {showBreadcrumbs && breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} />
        )}
        {children}
      </main>
    </>
  );
};
