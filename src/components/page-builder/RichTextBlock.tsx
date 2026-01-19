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

// The Dropdown Component - SERIF FONT EDITION
const FAQItem = ({ question, answer }: { question: any, answer: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const firstChild = question.children?.[0] as any;
  const questionText = firstChild?.text || 'Question';

  // Your requested font stack
  const serifFont = 'JHATimesNow, TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif';

  return (
    <div 
      className={styles.faqItem} 
      style={{ 
        marginBottom: '12px', 
        borderBottom: '1px solid #e5e7eb', 
        borderRadius: '0', 
        overflow: 'hidden',
        transition: 'all 0.2s ease'
      }}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '100%', 
          textAlign: 'left', 
          padding: '16px 0', 
          background: 'transparent', 
          border: 'none',
          fontWeight: '600', 
          fontSize: '1.25rem', // Slightly smaller than H3 version
          fontFamily: serifFont, 
          color: '#111827', 
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          outline: 'none'
        }}
        onMouseOver={(e) => e.currentTarget.style.color = '#4f46e5'} 
        onMouseOut={(e) => e.currentTarget.style.color = '#111827'}
      >
        <span>{questionText}</span>
        <span style={{ 
          fontSize: '1.25rem', 
          color: isOpen ? '#4f46e5' : '#9ca3af',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }}>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      
      <div style={{ 
        maxHeight: isOpen ? '1000px' : '0',
        opacity: isOpen ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        paddingBottom: isOpen ? '16px' : '0'
      }}>
        <div style={{ 
            color: '#4b5563', 
            lineHeight: '1.6',
            fontFamily: serifFont, 
            fontSize: '1.1rem' 
        }}>
          <BlocksRenderer content={[answer]} />
        </div>
      </div>
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
      
      // IF we find an H4, we assume it's a Question
      if (block.type === 'heading' && block.level === 4) {
        const questionBlock = block;
        const answerBlock = rawContent[i + 1];
        
        if (answerBlock) {
          processedContent.push(
            <FAQItem key={i} question={questionBlock} answer={answerBlock} />
          );
          i += 2; 
        } else {
          const firstChild = block.children[0] as any;
          processedContent.push(<h4 key={i}>{firstChild?.text}</h4>);
          i++;
        }
      } else {
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
