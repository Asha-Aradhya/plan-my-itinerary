'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import type { TravelPreferences } from '@/types/preferences';
import Spinner from '@/components/Spinner/Spinner';
import styles from './ProfileView.module.scss';

interface SavedItinerary {
  id: string;
  destination: string;
  preferences: TravelPreferences;
  createdAt: string;
}

interface ProfileUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Props {
  user: ProfileUser;
  itineraries: SavedItinerary[];
}

function formatDateRange(startDate: string, endDate: string) {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  const start = new Date(startDate).toLocaleDateString('en-GB', options);
  const end = new Date(endDate).toLocaleDateString('en-GB', options);
  return `${start} → ${end}`;
}

function timeAgo(isoString: string) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}

export default function ProfileView({ user, itineraries: initialItineraries }: Props) {
  const [itineraries, setItineraries] = useState(initialItineraries);
  const [imageError, setImageError] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const initial = (user.name ?? user.email ?? 'U')[0].toUpperCase();
  const showImage = user.image && !imageError;

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/itineraries/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      setItineraries(previous => previous.filter(item => item.id !== id));
    } catch {
      // silently restore — deletion failed
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.profileHeader}>
        {showImage ? (
          <Image
            src={user.image!}
            alt={user.name ?? 'Profile picture'}
            width={80}
            height={80}
            className={styles.avatar}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.avatarFallback} aria-hidden="true">{initial}</div>
        )}
        <div className={styles.userInfo}>
          {user.name && <h1 className={styles.userName}>{user.name}</h1>}
          {user.email && <p className={styles.userEmail}>{user.email}</p>}
        </div>
      </div>

      <section aria-labelledby="itineraries-heading" className={styles.section}>
        <h2 id="itineraries-heading" className={styles.sectionHeading}>
          Saved Itineraries
          <span className={styles.count}>{itineraries.length}</span>
        </h2>

        {itineraries.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No saved itineraries yet.</p>
            <Link href="/plan/new" className={styles.emptyCtaBtn}>Plan Your First Trip</Link>
          </div>
        ) : (
          <ul className={styles.grid} role="list">
            {itineraries.map(item => (
              <li key={item.id} className={styles.card}>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardDestination}>{item.destination}</h3>
                  <p className={styles.cardDates}>
                    {formatDateRange(item.preferences.startDate, item.preferences.endDate)}
                  </p>
                  <p className={styles.cardMeta}>
                    {item.preferences.travelers} {item.preferences.travelers === 1 ? 'traveller' : 'travellers'}
                    <span className={styles.dot}>·</span>
                    {timeAgo(item.createdAt)}
                  </p>
                </div>
                <div className={styles.cardActions}>
                  <Link
                    href={`/itinerary/${item.id}`}
                    className={styles.viewBtn}
                  >
                    View
                  </Link>
                  <button
                    className={styles.deleteBtn}
                    aria-label={`Delete ${item.destination} itinerary`}
                    disabled={deletingId === item.id}
                    onClick={() => handleDelete(item.id)}
                  >
                    {deletingId === item.id ? <Spinner label="Deleting itinerary" /> : '✕'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className={styles.footer}>
        <button
          className={styles.signOutBtn}
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
