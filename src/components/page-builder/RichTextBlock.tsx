import styles from '@/styles/page-builder/RichTextBlock.module.css';

interface RichTextBlockProps {
  data: {
    content?: string | null;
    body?: string | null;
  };
}

const RichTextBlock = ({ data }: RichTextBlockProps) => {
  const htmlContent = data.content || data.body;

  if (!htmlContent || htmlContent.trim().length === 0) {
    return null;
  }

  return (
    <div 
      className={styles.richTextContent}
      dangerouslySetInnerHTML={{ __html: htmlContent }} 
    />
  );
};

export default RichTextBlock;
