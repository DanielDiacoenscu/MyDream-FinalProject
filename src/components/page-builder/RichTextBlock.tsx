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

  // The Serif Font Stack
  const serifFont = 'JHATimesNow, TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif';

  // 1. Handle Strapi v5 Blocks (JSON Array)
  if (Array.isArray(rawContent)) {
    return (
      <div className={styles.richTextContent}>
        <BlocksRenderer 
          content={rawContent} 
          blocks={{
            // Custom renderer for H3 to apply Serif font but NO Dropdown
            heading: ({ children, level }) => {
              if (level === 3) {
                return (
                  <h3 style={{ 
                    fontFamily: serifFont, 
                    fontWeight: 'normal', 
                    fontSize: '1.5rem',
                    marginTop: '1.5em',
                    marginBottom: '0.5em',
                    color: '#111827'
                  }}>
                    {children}
                  </h3>
                );
              }
              // Default rendering for other levels
              switch (level) {
                case 1: return <h1>{children}</h1>;
                case 2: return <h2>{children}</h2>;
                case 4: return h4({ children }); // Helper if needed, or just standard JSX
                case 5: return <h5>{children}</h5>;
                case 6: return <h6>{children}</h6>;
                default: return <h1>{children}</h1>;
              }
            },
            // Apply Serif font to paragraphs as well if desired, or keep default
            paragraph: ({ children }) => (
              <p style={{ fontFamily: serifFont, fontSize: '1.1rem', lineHeight: '1.6', color: '#4b5563' }}>
                {children}
              </p>
            )
          }}
        />
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

// Helper for H4 to keep TS happy if needed, though standard switch above is fine.
const h4 = ({ children }: { children: React.ReactNode }) => <h4>{children}</h4>;

export default RichTextBlock;
