import styles from './ItineraryLoading.module.scss';

export default function ItineraryLoading() {
  return (
    <div role="status" aria-live="polite" aria-label="Generating your itinerary" className={styles.wrapper}>
      <div className={styles.icon} aria-hidden="true">✦</div>
      <h2 className={styles.title}>Crafting Your Journey</h2>
      <p className={styles.subtitle}>
        Our AI is designing a bespoke itinerary tailored to your preferences…
      </p>
      <div className={styles.bars} aria-hidden="true">
        <div className={styles.bar} />
        <div className={styles.bar} />
        <div className={styles.bar} />
        <div className={styles.bar} style={{ width: '60%' }} />
      </div>
    </div>
  );
}
