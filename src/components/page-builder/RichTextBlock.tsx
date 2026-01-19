'use client';
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import styles from '@/styles/page-builder/RichTextBlock.module.css';

interface RichTextBlockProps {
  data: {
    content?: BlocksContent | string | null;
    body?: BlocksContent | string | null;
  };
}

const RichTextBlock = ({ data }: RichTextBlockProps) => {
  if (!data) return null;

  const rawContent = data.content || data.body;

  if (!rawContent) return null;

  // 1. Handle Strapi v5 Blocks (JSON Array)
  if (Array.isArray(rawContent)) {
    return (
      <div className={styles.richTextContent}>
        <BlocksRenderer content={rawContent} />
      </div>
    );
  }

  // 2. Handle Legacy HTML String
  if (typeof rawContent === 'string') {
    if (rawContent.trim().length === 0) return null;
    return (
      <div 
        className={styles.richTextContent}
        dangerouslySetInnerHTML={{ __html: rawContent }} 
      />
    );
  }

  return null;
};

export default RichTextBlock;
