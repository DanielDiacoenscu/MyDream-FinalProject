// src/components/page-builder/ComponentRenderer.tsx
import RichTextBlock from './RichTextBlock';
import ContactForm from './ContactForm';

// Map Strapi dynamic zone component keys to React components
const componentMap: Record<string, React.ElementType> = {
  // Strapi v5 keys (from your debug output)
  'sections.rich-text': RichTextBlock,
  'sections.hero': RichTextBlock, // TEMP: placeholder until you add a real Hero component

  // Older keys (keep for backward compatibility if any records still use them)
  'sections.rich-text-block': RichTextBlock,
  'sections.contact-form-block': ContactForm,
};

const ComponentRenderer = ({ components }: { components: any[] }) => {
  if (!components || !Array.isArray(components)) return null;

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
