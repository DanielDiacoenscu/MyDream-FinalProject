// src/app/[slug]/page.tsx - DIAGNOSTIC TEST

// This is the simplest possible page component.
// It has no dependencies and no complex types.
export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1>This is a test page.</h1>
      <p>If you can see this, the build has finally succeeded.</p>
      <p>The slug for this page is: {params.slug}</p>
    </div>
  );
}
