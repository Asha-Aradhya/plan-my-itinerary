import Link from 'next/link';
import NavbarAuth from './NavbarAuth';
import styles from './Navbar.module.scss';

export default function Navbar() {
  return (
    <nav aria-label="Main navigation" className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          PlanMyTravel
        </Link>

        <div className={styles.actions}>
          <Link href="/plan/new" className={styles.ctaButton}>
            Plan a Trip
          </Link>
          <NavbarAuth />
        </div>
      </div>
    </nav>
  );
}
