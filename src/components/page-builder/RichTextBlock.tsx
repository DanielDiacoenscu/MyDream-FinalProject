'use client';
import { useState } from 'react';
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import styles from '@/styles/page-builder/RichTextBlock.module.css';

interface RichTextBlockProps {
  data: {
    content?: BlocksContent | string | null;
    body?: BlocksContent | string | null;
  };
}

// The Dropdown Component
const FAQItem = ({ question, answer }: { question: any, answer: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Extract text from the H3 block safely
  const questionText = question.children?.[0]?.text || 'Question';

  return (
    <div className={styles.faqItem} style={{ marginBottom: '10px', border: '1px solid #eee', borderRadius: '8px' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '100%', 
          textAlign: 'left', 
          padding: '15px', 
          background: '#f9f9f9', 
          border: 'none',
          fontWeight: 'bold',
          fontSize: '1.1em', // Slightly larger for H3
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>{questionText}</span>
        <span style={{ fontSize: '1.5em', lineHeight: '0.5' }}>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div style={{ padding: '15px', background: '#fff', borderTop: '1px solid #eee' }}>
          {/* Render the answer block(s) using the default renderer */}
          <BlocksRenderer content={[answer]} />
        </div>
      )}
    </div>
  );
};

const RichTextBlock = ({ data }: RichTextBlockProps) => {
  if (!data) return null;
  const rawContent = data.content || data.body;
  if (!rawContent) return null;

  // 1. Handle Strapi v5 Blocks (JSON Array)
  if (Array.isArray(rawContent)) {
    const processedContent = [];
    let i = 0;
    
    while (i < rawContent.length) {
      const block = rawContent[i];
      
      // IF we find an H3, we assume it's a Question
      if (block.type === 'heading' && block.level === 3) {
        const questionBlock = block;
        // The next block is the Answer (if it exists)
        const answerBlock = rawContent[i + 1];
        
        if (answerBlock) {
          processedContent.push(
            <FAQItem key={i} question={questionBlock} answer={answerBlock} />
          );
          i += 2; // Skip both blocks (Question + Answer)
        } else {
          // Orphan question (no answer), just render it as a normal H3
          processedContent.push(<h3 key={i}>{block.children[0]?.text}</h3>);
          i++;
        }
      } else {
        // Normal block, render as is
        processedContent.push(
          <div key={i}>
            <BlocksRenderer content={[block]} />
          </div>
        );
        i++;
      }
    }

    return <div className={styles.richTextContent}>{processedContent}</div>;
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
