/**
 * SEO & Meta types
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SeoMetaProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'calculator';
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  breadcrumbs?: BreadcrumbItem[];
  locale?: string;
}
