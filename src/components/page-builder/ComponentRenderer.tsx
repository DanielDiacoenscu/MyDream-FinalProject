// src/components/page-builder/ComponentRenderer.tsx
import RichTextBlock from './RichTextBlock';
import ContactForm from './ContactForm';

// This is a simple mapping object
const componentMap: { [key: string]: React.ElementType } = {
  'sections.rich-text-block': RichTextBlock,
  'sections.contact-form-block': ContactForm,
};

const ComponentRenderer = ({ components }: { components: any[] }) => {
  if (!components) return null;

  return (
    <>
      {components.map((component, index) => {
        const Component = componentMap[component.__component];
        
        if (!Component) {
          console.warn(`Component "${component.__component}" not found in map.`);
          return null;
        }
        
        return <Component key={index} data={component} />;
      })}
    </>
  );
};

export default ComponentRenderer;
