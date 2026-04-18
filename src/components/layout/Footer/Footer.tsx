import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.brand}>
          <span className={styles.icon}>✦</span> PlanMyTravel
        </p>
        <p className={styles.copy}>
          © {new Date().getFullYear()} PlanMyTravel. Crafted with care.
        </p>
      </div>
    </footer>
  );
}
