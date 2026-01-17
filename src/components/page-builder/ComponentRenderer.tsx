import RichTextBlock from './RichTextBlock';
import ContactForm from './ContactForm';

// Updated to match your Strapi 5 component names
const componentMap: { [key: string]: React.ElementType } = {
  'sections.rich-text': RichTextBlock,
  'sections.hero': RichTextBlock, // Using RichTextBlock as a placeholder for now
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
cat > src/components/page-builder/ComponentRenderer.tsx <<'EOF'
import RichTextBlock from './RichTextBlock';
import ContactForm from './ContactForm';

// Updated to match your Strapi 5 component names
const componentMap: { [key: string]: React.ElementType } = {
  'sections.rich-text': RichTextBlock,
  'sections.hero': RichTextBlock, // Using RichTextBlock as a placeholder for now
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
