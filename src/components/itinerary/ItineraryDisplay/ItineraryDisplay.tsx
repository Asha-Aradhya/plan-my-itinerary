'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { TravelPreferences } from '@/types/preferences';
import ItineraryLoading from '@/components/itinerary/ItineraryLoading/ItineraryLoading';
import SignInModal from '@/components/auth/SignInModal/SignInModal';
import styles from './ItineraryDisplay.module.scss';

function formatItinerary(text: string) {
  const lines = text.split('\n');

  return lines.map((line, lineIndex) => {
    // Day headings: "Day 1 — ..."  or "**Day 1...**"
    if (/^\*?\*?(Day \d+)/i.test(line)) {
      const clean = line.replace(/\*\*/g, '').trim();
      return <h2 key={lineIndex} className={styles.dayHeading}>{clean}</h2>;
    }
    // Section headings: Morning / Afternoon / Evening / Travel Essentials
    if (/^(Morning|Afternoon|Evening|Travel Essentials|###)/i.test(line.replace(/\*\*/g, ''))) {
      const clean = line.replace(/\*\*/g, '').replace(/^###\s*/, '').trim();
      return <h3 key={lineIndex} className={styles.sectionHeading}>{clean}</h3>;
    }
    // Bold labels like "**Tip:**"
    if (line.includes('**')) {
      const parts = line.split(/\*\*(.+?)\*\*/g);
      return (
        <p key={lineIndex} className={styles.paragraph}>
          {parts.map((part, partIndex) =>
            partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
          )}
        </p>
      );
    }
    // Bullet points
    if (/^[-•]\s/.test(line)) {
      return <li key={lineIndex} className={styles.listItem}>{line.replace(/^[-•]\s/, '')}</li>;
    }
    // Empty line
    if (!line.trim()) return <br key={lineIndex} />;
    // Default paragraph
    return <p key={lineIndex} className={styles.paragraph}>{line}</p>;
  });
}

export default function ItineraryDisplay() {
  const router = useRouter();
  const { data: session } = useSession();
  const [preferences, setPreferences] = useState<TravelPreferences | null>(null);
  const [itinerary, setItinerary] = useState('');
  const [status, setStatus] = useState<'loading' | 'streaming' | 'done' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showSignInModal, setShowSignInModal] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleSave = async () => {
    if (!session) {
      setShowSignInModal(true);
      return;
    }
    if (!preferences || !itinerary) return;
    setSaveStatus('saving');
    try {
      const response = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: preferences.destination,
          content: itinerary,
          preferences,
        }),
      });
      if (!response.ok) throw new Error();
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  };

  useEffect(() => {
    const raw = sessionStorage.getItem('travelPreferences');
    if (!raw) {
      router.replace('/plan/new');
      return;
    }

    let prefs: TravelPreferences;
    try {
      prefs = JSON.parse(raw);
    } catch {
      router.replace('/plan/new');
      return;
    }

    setPreferences(prefs);

    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        const response = await fetch('/api/itinerary/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prefs),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error ?? 'Failed to generate itinerary.');
        }

        setStatus('streaming');

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          setItinerary(previousItinerary => previousItinerary + decoder.decode(value, { stream: true }));
        }

        setStatus('done');
        sessionStorage.removeItem('travelPreferences');
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        setErrorMsg((error as Error).message);
        setStatus('error');
      }
    })();

    return () => controller.abort();
  }, [router]);

  if (status === 'loading') return <ItineraryLoading />;

  if (status === 'error') {
    return (
      <div className={styles.errorState}>
        <p className={styles.errorText}>{errorMsg}</p>
        <button className={styles.retryBtn} onClick={() => router.push('/plan/new')}>
          ← Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {preferences && (
        <div className={styles.tripHeader}>
          <p className={styles.eyebrow}>Your personalised itinerary</p>
          <h1 className={styles.tripTitle}>{preferences.destination}</h1>
          <div className={styles.tripMeta}>
            <span>{new Date(preferences.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span className={styles.metaDivider}>→</span>
            <span>{new Date(preferences.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span className={styles.metaDivider}>·</span>
            <span>{preferences.travelers} {preferences.travelers === 1 ? 'traveller' : 'travellers'}</span>
          </div>
        </div>
      )}

      <div aria-live="polite" aria-label="Your itinerary" className={styles.content}>
        {formatItinerary(itinerary)}
        {status === 'streaming' && <span className={styles.cursor} aria-hidden="true" />}
      </div>

      {status === 'done' && (
        <div className={styles.actions}>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saveStatus === 'saving' || saveStatus === 'saved'}
          >
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && '✓ Saved'}
            {saveStatus === 'error' && 'Save failed — try again'}
            {saveStatus === 'idle' && '✦ Save Itinerary'}
          </button>
          <button className={styles.newPlanBtn} onClick={() => router.push('/plan/new')}>
            Plan Another Trip
          </button>
        </div>
      )}

      {showSignInModal && <SignInModal onClose={() => setShowSignInModal(false)} />}
    </div>
  );
}
