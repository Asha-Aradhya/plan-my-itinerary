'use client';

import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import styles from './AIMasterSection.module.scss';

const sampleMessages = [
  { role: 'ai', text: "Hi! I'm your AI Master. Where are you dreaming of going?" },
  { role: 'user', text: 'Not sure — somewhere warm with good food.' },
  { role: 'ai', text: 'How about southern Italy in May? I can build you a full day-by-day plan.' },
];

export default function AIMasterSection() {
  const { data: session, status } = useSession();

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>New — AI Master</p>
          <h2 className={styles.heading}>
            Not sure where to go?
            <br />
            <span className={styles.accent}>Ask our AI Master.</span>
          </h2>
          <p className={styles.description}>
            Have a conversation with our AI travel expert. Ask about the best time to visit,
            what to pack, crowd levels, hidden gems — then let it build your full itinerary.
          </p>

          <ul className={styles.features}>
            <li>Real-time conversation, no forms required</li>
            <li>Answers follow-up questions about destinations</li>
            <li>Transitions directly to your personalised itinerary</li>
          </ul>

          {status === 'loading' ? null : session ? (
            <Link href="/plan/chat" className={styles.ctaButton}>
              Chat with our AI Master
              <span className={styles.arrow}>→</span>
            </Link>
          ) : (
            <button
              className={styles.ctaButton}
              onClick={() => signIn('google', { callbackUrl: '/plan/chat' })}
            >
              Sign in to chat with our AI Master
              <span className={styles.arrow}>→</span>
            </button>
          )}
        </div>

        <div className={styles.preview} aria-hidden="true">
          <div className={styles.chatWindow}>
            <div className={styles.chatHeader}>
              <span className={styles.chatDot} />
              <span className={styles.chatTitle}>AI Master</span>
            </div>
            <div className={styles.chatBody}>
              {sampleMessages.map((message, index) => (
                <div
                  key={index}
                  className={message.role === 'ai' ? styles.messageAI : styles.messageUser}
                >
                  {message.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
