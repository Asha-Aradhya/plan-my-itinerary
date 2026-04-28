import Link from 'next/link';
import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />

      <div className={styles.content}>
        <p className={styles.eyebrow}>Your personal travel concierge</p>
        <h1 className={styles.heading}>
          Every Journey Begins
          <br />
          <span className={styles.accent}>With a Dream</span>
        </h1>
        <p className={styles.subheading}>
          Tell us where you want to go, and we'll craft a bespoke day-by-day
          itinerary tailored to your style, pace, and passions.
        </p>

        <div className={styles.actions}>
          <Link href="/plan/new" className={styles.primaryCta}>
            Start Planning
            <span className={styles.arrow}>→</span>
          </Link>
          <a href="#how-it-works" className={styles.secondaryCta}>
            See how it works
          </a>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>🌍</span>
            <span className={styles.statLabel}>Worldwide</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>AI</span>
            <span className={styles.statLabel}>Powered</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>100%</span>
            <span className={styles.statLabel}>Personalised</span>
          </div>
        </div>
      </div>
    </section>
  );
}
