'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import styles from './Navbar.module.scss';

export default function NavbarAuth() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div className={styles.authSkeleton} aria-hidden="true" />;

  if (session?.user) {
    return (
      <div className={styles.userMenu}>
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? 'User avatar'}
            width={32}
            height={32}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarFallback}>
            {(session.user.name ?? session.user.email ?? 'U')[0].toUpperCase()}
          </div>
        )}
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
    <button className={styles.signInBtn} onClick={() => signIn('google')}>
      Sign In
    </button>
  );
}
