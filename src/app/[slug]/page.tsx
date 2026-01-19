// src/app/[slug]/page.tsx - BULLETPROOF VERSION

import { getPageBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import styles from '@/styles/StaticPage.module.css';
import ComponentRenderer from '@/components/page-builder/ComponentRenderer';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic'; 

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);
  if (!page) {
    return { title: 'Page Not Found' };
  }
  return { title: `${page.title || 'Page'} | MyDreamBeauty` };
}

export default async function Page({ params }: Props) {
  const { slug } = params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  // SAFETY CHECK: Ensure content exists, default to empty array
  const title = page.title || 'Untitled Page';
  const content = page.content || []; 

  return (
    <div className={styles.pageContainer} data-slug={slug}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.pageTitle}>{title}</h1>
        {/* Only render if we have components */}
        {content.length > 0 ? (
          <ComponentRenderer components={content} />
        ) : (
          <p>This page is currently empty.</p>
        )}
      </div>
    </div>
  );
}
