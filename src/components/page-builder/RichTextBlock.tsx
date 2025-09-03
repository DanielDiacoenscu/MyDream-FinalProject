// src/components/page-builder/RichTextBlock.tsx
import styles from '@/styles/page-builder/RichTextBlock.module.css';

interface RichTextBlockProps {
  data: {
    body: string;
  };
}

const RichTextBlock = ({ data }: RichTextBlockProps) => {
  return (
    <div 
      className={styles.richTextContent}
      dangerouslySetInnerHTML={{ __html: data.body }} 
    />
  );
};

export default RichTextBlock;
