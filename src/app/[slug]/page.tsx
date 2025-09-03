// src/app/[slug]/page.tsx - FINAL, CLEAN VERSION

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
  if (!page || !page.attributes) {
    return { title: 'Page Not Found' };
  }
  return { title: `${page.attributes.title} | MyDreamBeauty` };
}

export default async function Page({ params }: Props) {
  const { slug } = params;
  const page = await getPageBySlug(slug);

  if (!page || !page.attributes) {
    notFound();
  }

  const { title, page_components } = page.attributes;

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
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/pages`);
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
