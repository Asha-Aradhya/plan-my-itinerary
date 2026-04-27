'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Navbar.module.scss';

export default function NavbarAuth() {
  const { data: session, status } = useSession();
  const [imageError, setImageError] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (status === 'loading') return <div className={styles.authSkeleton} aria-hidden="true" />;

  if (session?.user) {
    const showImage = session.user.image && !imageError;
    const initial = (session.user.name ?? session.user.email ?? 'U')[0].toUpperCase();

    return (
      <div className={styles.userMenu}>
        <Link
          href="/profile"
          className={styles.avatarLink}
          aria-label={`View profile for ${session.user.name ?? 'user'}`}
        >
          {showImage ? (
            <Image
              src={session.user.image!}
              alt={session.user.name ?? 'User avatar'}
              width={32}
              height={32}
              className={styles.avatar}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={styles.avatarFallback} aria-hidden="true">{initial}</div>
          )}
        </Link>
        <button
          className={styles.signOutBtn}
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      className={styles.signInBtn}
      disabled={isSigningIn}
      onClick={() => { setIsSigningIn(true); signIn('google'); }}
    >
      {isSigningIn ? 'Signing in…' : 'Sign In'}
    </button>
  );
}
