import Link from 'next/link';
import styles from './Navbar.module.scss';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          PlanMyTravel
        </Link>

        <div className={styles.actions}>
          <Link href="/plan/new" className={styles.ctaButton}>
            Plan a Trip
          </Link>
        </div>
      </div>
    </nav>
  );
}
