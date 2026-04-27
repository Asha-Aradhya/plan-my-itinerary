import Navbar from '@/components/layout/Navbar/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import Hero from '@/components/landing/Hero/Hero';
import FeatureGrid from '@/components/landing/FeatureGrid/FeatureGrid';
import Link from 'next/link';
import styles from './page.module.scss';

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <FeatureGrid />

        {/* CTA band */}
        <section className={styles.ctaBand}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaHeading}>
              Ready to Plan Your Next Adventure?
            </h2>
            <p className={styles.ctaText}>
              It takes less than two minutes to get a full personalised itinerary.
            </p>
            <Link href="/plan/new" className={styles.ctaButton}>
              Start for Free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
