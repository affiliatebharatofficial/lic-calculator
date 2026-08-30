/**
 * Schema.org JSON-LD Structured Data Generators
 */

import type { BreadcrumbItem } from '@/types/seo';
import type { AuthorProfile } from '@/lib/editorial';

const SITE_URL = 'https://lic-calculators.com';

export class StructuredDataGenerator {
  /**
   * Generates WebApplication schema for calculators.
   */
  public static generateWebApplication(params: {
    name: string;
    description: string;
    url: string;
    operatingSystem?: string;
  }): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: params.name,
      description: params.description,
      url: params.url,
      applicationCategory: 'FinanceApplication',
      operatingSystem: params.operatingSystem || 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR'
      },
      provider: {
        '@type': 'Organization',
        name: 'LIC Calculator Platform',
        url: SITE_URL
      }
    };
  }

  /**
   * Generates Article schema for educational guides and analysis articles.
   */
  public static generateArticle(params: {
    headline: string;
    description: string;
    url: string;
    publishedDate: string;
    modifiedDate: string;
    author: AuthorProfile;
    reviewer?: AuthorProfile;
    imageUrl?: string;
  }): Record<string, unknown> {
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: params.headline,
      description: params.description,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': params.url
      },
      datePublished: params.publishedDate,
      dateModified: params.modifiedDate,
      image: params.imageUrl ? (params.imageUrl.startsWith('http') ? params.imageUrl : `${SITE_URL}${params.imageUrl}`) : `${SITE_URL}/images/og-default.png`,
      author: {
        '@type': 'Person',
        name: params.author.name,
        jobTitle: params.author.title,
        url: `${SITE_URL}/author/${params.author.slug}`
      },
      publisher: {
        '@type': 'Organization',
        name: 'LIC Calculator',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/favicon.svg`
        }
      }
    };

    if (params.reviewer) {
      schema.reviewedBy = {
        '@type': 'Person',
        name: params.reviewer.name,
        jobTitle: params.reviewer.title,
        url: `${SITE_URL}/author/${params.reviewer.slug}`
      };
    }

    return schema;
  }

  /**
   * Generates Person schema for author and reviewer profile pages.
   */
  public static generatePerson(author: AuthorProfile): Record<string, unknown> {
    const sameAs: string[] = [];
    if (author.socialLinks.linkedin) sameAs.push(author.socialLinks.linkedin);
    if (author.socialLinks.x) sameAs.push(author.socialLinks.x);
    if (author.socialLinks.website) sameAs.push(author.socialLinks.website);

    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: author.name,
      jobTitle: author.title,
      description: author.biography,
      url: `${SITE_URL}/author/${author.slug}`,
      image: `${SITE_URL}${author.photoUrl}`,
      knowsAbout: author.expertiseAreas,
      sameAs: sameAs.length > 0 ? sameAs : undefined
    };
  }

  /**
   * Generates BreadcrumbList schema matching visible navigation path.
   */
  public static generateBreadcrumbList(breadcrumbs: BreadcrumbItem[]): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}`
      }))
    };
  }

  /**
   * Generates FAQPage schema for verified FAQs.
   */
  public static generateFAQPage(faqs: { question: string; answer: string }[]): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }
}
