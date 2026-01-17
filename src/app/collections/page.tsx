// src/app/collections/page.tsx
import { fetchAllCollections } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
  const collections = await fetchAllCollections();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections
          .filter((collection: any) => {
            const data = collection.attributes || collection;
            return data.slug && data.name;
          })
          .map((collection: any) => {
            // Strapi 5 compatibility fix
            const data = collection.attributes || collection;
            const slug = data.slug;
            const name = data.name;
            const imageUrl = data.image?.data?.attributes?.url || data.image?.url;

            return (
              <Link href={`/collections/${slug}`} key={collection.id} className="group block">
                <div className="overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={name}
                      width={400}
                      height={500}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-center">{name}</h2>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
