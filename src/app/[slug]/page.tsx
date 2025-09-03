// src/app/[slug]/page.tsx - CORRECTED FOR STRAPI DATA STRUCTURE
import { getPageBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import styles from '@/styles/StaticPage.module.css';
import ComponentRenderer from '@/components/page-builder/ComponentRenderer';

// Your interface is correct and remains unchanged.
interface PageProps {
  params: {
    slug: string;
  };
}

const DynamicPage = async ({ params }: PageProps) => {
  const { slug } = params;
  const page = await getPageBySlug(slug);

  // This check is made safer by also checking for the 'attributes' object.
  if (!page || !page.attributes) {
    notFound();
  }

  // --- THIS IS THE CORRECTION ---
  // We are now correctly looking inside `page.attributes` to find your data.
  const { title, page_components } = page.attributes;

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

// This function is also corrected to find the slug inside `page.attributes`.
export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/pages`);
    const pages = await response.json();
    
    if (!pages || !pages.data || pages.data.length === 0) return [];

    // --- THIS IS THE CORRECTION ---
    // The slug is correctly accessed from `page.attributes.slug`.
    return pages.data
      .filter((page: any) => page && page.attributes && page.attributes.slug)
      .map((page: any) => ({ slug: page.attributes.slug }));
  } catch (error) {
    console.error("Could not generate static params for pages:", error);
    return [];
  }
}
