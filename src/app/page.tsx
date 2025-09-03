// src/app/page.tsx - THIS IS THE CORRECT HOMEPAGE CODE

import HeroSection from '../components/HeroSection';
import BestSellers from "../components/BestSellers";
import PromoSection from '../components/PromoSection';
import CategoryGrid from "../components/CategoryGrid";
import ShopByCollection from '../components/ShopByCollection';

export default function HomePage() {
  const localHeroVideoUrl = "/herosection.mp4";

  return (
    <main>
      <HeroSection
        videoUrl={localHeroVideoUrl}
        subtitle="Ново - Exclusive"
        title={<>Представяме ви<br />нашият нов онлайн магазин</>}
        description="Естествен блясък, който говори вместо теб.."
        buttonText="Разгледай сега"
        buttonHref="/shop"
      />
      <BestSellers />
      <PromoSection />
      <ShopByCollection />
      <CategoryGrid />
    </main>
  );
}
