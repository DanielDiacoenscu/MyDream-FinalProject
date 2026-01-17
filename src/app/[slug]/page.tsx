// src/app/[slug]/page.tsx - FINAL CORRECTED VERSION

import { getPageBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import styles from '@/styles/StaticPage.module.css';
import ComponentRenderer from '@/components/page-builder/ComponentRenderer';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic'; // Prevents build-time 404s

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

  // FIX: Destructure title and content directly from the page object.
  const { title, content } = page;

  return (
    <div className={styles.pageContainer} data-slug={slug}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <ComponentRenderer components={content} />
      </div>
    </div>
  );
}

