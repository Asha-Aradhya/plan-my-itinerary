"use client";

import styles from "./page.module.scss";

export default function OfflinePage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>You&apos;re offline</h1>
      <p className={styles.message}>
        It looks like you&apos;ve lost your connection. Pages you&apos;ve
        already visited are still available — try opening your itinerary from
        the home screen.
      </p>
      <p className={styles.hint}>
        Reconnect to the internet to plan a new trip or fetch updates.
      </p>
      <button
        type="button"
        className={styles.retry}
        onClick={() => window.location.reload()}
      >
        Try again
      </button>
    </main>
  );
}
