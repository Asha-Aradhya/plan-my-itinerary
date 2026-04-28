'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import Spinner from '@/components/Spinner/Spinner';
import styles from './Navbar.module.scss';

function PersonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export default function NavbarAuth() {
  const { data: session, status } = useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (!isSigningIn) return;
    const reset = () => { if (document.visibilityState === 'visible') setIsSigningIn(false); };
    document.addEventListener('visibilitychange', reset);
    return () => document.removeEventListener('visibilitychange', reset);
  }, [isSigningIn]);

  if (status === 'loading') return <div className={styles.authSkeleton} aria-hidden="true" />;

  if (session?.user) {
    return (
      <Link
        href="/profile"
        className={styles.profileIconLink}
        aria-label={`View profile for ${session.user.name ?? 'user'}`}
      >
        <PersonIcon />
      </Link>
    );
  }

  return (
    <button
      className={styles.signInBtn}
      disabled={isSigningIn}
      onClick={() => { setIsSigningIn(true); signIn('google'); }}
    >
      {isSigningIn ? <><Spinner label="Signing in" /> Signing in…</> : 'Sign In'}
    </button>
  );
}
