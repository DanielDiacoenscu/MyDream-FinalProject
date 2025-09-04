// src/app/[slug]/page.tsx - FINAL CORRECTED VERSION

import { getPageBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import styles from '@/styles/StaticPage.module.css';
import ComponentRenderer from '@/components/page-builder/ComponentRenderer';
import { Metadata } from 'next';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);
  // FIX: Check for page directly, not page.attributes
  if (!page) {
    return { title: 'Page Not Found' };
  }
  // FIX: Access title directly from page
  return { title: `${page.title} | MyDreamBeauty` };
}

export default async function Page({ params }: Props) {
  const { slug } = params;
  const page = await getPageBySlug(slug);


  // FIX: Check for page directly. The attributes property does not exist.
  if (!page) {
    notFound();
  }

  // FIX: Destructure title and page_components directly from the page object.
  const { title, page_components } = page;

  return (
    <div className={styles.pageContainer} data-slug={slug}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <ComponentRenderer components={page_components} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  try {
    // This part is more robust now
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/pages`);
    if (!response.ok) throw new Error('Failed to fetch pages for static params');
    
    const pages = await response.json();
    if (!pages || !pages.data || pages.data.length === 0) return [];

    return pages.data
      .filter((page: any) => page && page.attributes && page.attributes.slug)
      .map((page: any) => ({ slug: page.attributes.slug }));
  } catch (error) {
    console.error("Could not generate static params for pages:", error);
    return [];
  }
}
