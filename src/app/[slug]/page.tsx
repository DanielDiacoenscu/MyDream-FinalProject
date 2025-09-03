// src/app/[slug]/page.tsx - UPGRADED FOR PAGE BUILDER
import { getPageBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import styles from '@/styles/StaticPage.module.css';
import ComponentRenderer from '@/components/page-builder/ComponentRenderer';

interface PageProps {
  params: {
    slug: string;
  };
}

const DynamicPage = async ({ params }: PageProps) => {
  const { slug } = params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const { title, page_components } = page;

  return (
    <div className={styles.pageContainer} data-slug={slug}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <ComponentRenderer components={page_components} />
      </div>
    </div>
  );
};

export default DynamicPage;

// The generateStaticParams function does not need to change.
export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/pages`);
    const pages = await response.json();
    
    if (!pages || !pages.data || pages.data.length === 0) return [];

    return pages.data
      .filter((page: any) => page && page.slug)
      .map((page: { slug: string }) => ({ slug: page.slug }));
  } catch (error) {
    console.error("Could not generate static params for pages:", error);
    return [];
  }
}
