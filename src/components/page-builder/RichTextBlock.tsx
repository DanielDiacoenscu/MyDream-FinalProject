import styles from '@/styles/page-builder/RichTextBlock.module.css';

interface RichTextBlockProps {
  data: {
    content?: string | any;
    body?: string | any;
  };
}

const RichTextBlock = ({ data }: RichTextBlockProps) => {
  // 1. Safety Check: Ensure data exists
  if (!data) return null;

  // 2. Get content from either field
  const rawContent = data.content || data.body;

  // 3. If empty, return nothing
  if (!rawContent) return null;

  // 4. HANDLE STRAPI V5 BLOCKS (JSON Array)
  // If it's an array, we can't render it with dangerouslySetInnerHTML.
  // We prevent the crash by returning null (or a placeholder).
  if (Array.isArray(rawContent) || typeof rawContent === 'object') {
    console.warn('RichTextBlock received Blocks JSON. You need @strapi/blocks-react-renderer to render this.');
    return null; 
  }

  // 5. HANDLE STANDARD HTML STRING
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
