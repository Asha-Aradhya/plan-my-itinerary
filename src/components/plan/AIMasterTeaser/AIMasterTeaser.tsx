'use client';

import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import styles from './AIMasterTeaser.module.scss';

export default function AIMasterTeaser() {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.divider}>
        <span className={styles.dividerText}>or</span>
      </div>

      <div className={styles.card}>
        <div className={styles.iconRow}>
          <span className={styles.icon}>✦</span>
          <span className={styles.label}>AI Master</span>
        </div>

        <h2 className={styles.heading}>Still deciding?</h2>
        <p className={styles.description}>
          Chat with our AI Master — ask about destinations, compare places, get advice on the best time to visit,
          and plan your full itinerary through natural conversation.
        </p>

        {session ? (
          <Link href="/plan/chat" className={styles.ctaBtn}>
            Chat with our AI Master →
          </Link>
        ) : (
          <button
            className={styles.ctaBtn}
            onClick={() => signIn('google', { callbackUrl: '/plan/chat' })}
          >
            Sign in to plan with our AI Master
          </button>
        )}
      </div>
    </div>
  );
}
