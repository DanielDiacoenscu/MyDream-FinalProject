// src/app/our-story/page.tsx - SYNTAX CORRECTED

import Image from 'next/image';
// This path is now correct because it is relative to this new file's location.
import styles from '../../styles/OurStory.module.css';

const imageOneUrl = '/manicure1.jpg';
const imageTwoUrl = '/manicure2.jpg';

export default function OurStoryPage() {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>

        <section className={styles.storySection}>
          <div className={styles.textBlock}>
            <h2 className={styles.title}>За Татяна Гюмишева</h2>
            {/* --- FIX #1: The text is now correctly placed inside the <p> tag --- */}
            <p className={styles.paragraph}>
              Творческата и обучителна дейност на Татяна Гюмишева е над 20 години в нашия град. В годините на изграждане на своята кариера тя участва в десетки международни състезания. През 2015г. печели първо място-"Златните ръце на света" в Италия сред 14 държави участници. Има над 2500 ученици в България и чужбина, преминали базови и надграждащи обучения. През 2016 кани международни преподаватели към нейната школа за да повишат нивото на знания и умения в сферата на терапевтичния педикюр.
            </p>
          </div>
          <div className={styles.imageBlock}>
            <Image src={imageOneUrl} alt="The Victoria Standard" width={600} height={800} className={styles.storyImage} />
          </div>
        </section>

        <section className={`${styles.storySection} ${styles.reversed}`}>
          <div className={styles.imageBlock}>
            <Image src={imageTwoUrl} alt="За нашите последователи и нашия бранд" width={800} height={600} className={styles.storyImage} />
          </div>
          <div className={styles.textBlock}>
            <h2 className={styles.title}>За нашите последователи и нашият бранд</h2>
            {/* --- FIX #2: The text is now correctly placed inside the <p> tag --- */}
            <p className={styles.paragraph}>
              В момента нейните ученици са едни от най-добрите преподаватели в България. Тя е автор на на техника за работа"Двойна четка". Създател е на марката "My Dream"-продукти за професионална употреба без аналог, които печелят приз за най-добър продукт на изложението за красота Varna Beauty Space през 2018г. Съдия е на годишни награди Beauty and Hair Awards. Името Татяна Гюмишева се свързва с професионализъм и отдаденост-по това може да разберете кои са нейните ученици.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
