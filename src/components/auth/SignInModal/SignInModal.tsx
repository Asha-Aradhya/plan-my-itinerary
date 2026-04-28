'use client';

import { useEffect, useRef, useState } from 'react';
import { signIn } from 'next-auth/react';
import Spinner from '@/components/Spinner/Spinner';
import styles from './SignInModal.module.scss';

interface Props {
  onClose: () => void;
}

const FOCUSABLE_SELECTORS =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function SignInModal({ onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (!isSigningIn) return;
    const reset = () => { if (document.visibilityState === 'visible') setIsSigningIn(false); };
    document.addEventListener('visibilitychange', reset);
    return () => document.removeEventListener('visibilitychange', reset);
  }, [isSigningIn]);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = Array.from(
      modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-modal-title"
        className={styles.modal}
        onClick={event => event.stopPropagation()}
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close sign-in dialog"
        >
          ✕
        </button>

        <div className={styles.icon} aria-hidden="true">✦</div>
        <h2 id="signin-modal-title" className={styles.title}>Save your itinerary</h2>
        <p className={styles.description}>
          Sign in with Google to save this itinerary and access it anytime.
        </p>

        <button
          className={styles.googleButton}
          disabled={isSigningIn}
          onClick={() => { setIsSigningIn(true); signIn('google'); }}
        >
          {!isSigningIn && (
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
          )}
          {isSigningIn ? <><Spinner label="Redirecting to Google" /> Redirecting to Google…</> : 'Continue with Google'}
        </button>
      </div>
    </div>
  );
}
