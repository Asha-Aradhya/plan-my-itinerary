'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { TravelPreferences } from '@/types/preferences';
import ItineraryLoading from '@/components/itinerary/ItineraryLoading/ItineraryLoading';
import ItineraryContent from '@/components/itinerary/ItineraryContent/ItineraryContent';
import SignInModal from '@/components/auth/SignInModal/SignInModal';
import Spinner from '@/components/Spinner/Spinner';
import styles from './ItineraryDisplay.module.scss';

export default function ItineraryDisplay() {
  const router = useRouter();
  const { data: session } = useSession();
  const [preferences, setPreferences] = useState<TravelPreferences | null>(null);
  const [itinerary, setItinerary] = useState('');
  const [status, setStatus] = useState<'loading' | 'streaming' | 'done' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const saveToDatabase = useCallback(async (prefs: TravelPreferences, content: string) => {
    setSaveStatus('saving');
    try {
      const response = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: prefs.destination,
          content,
          preferences: prefs,
        }),
      });
      if (!response.ok) throw new Error();
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  }, []);

  const handleSave = async () => {
    if (!session) {
      if (preferences && itinerary) {
        sessionStorage.setItem(
          'pendingItinerarySave',
          JSON.stringify({ preferences, itinerary })
        );
      }
      setShowSignInModal(true);
      return;
    }
    if (!preferences || !itinerary) return;
    await saveToDatabase(preferences, itinerary);
  };

  // Auto-save when session becomes available after OAuth redirect
  useEffect(() => {
    if (!autoSave || !session?.user || saveStatus !== 'idle' || !preferences || !itinerary) return;
    setAutoSave(false);
    saveToDatabase(preferences, itinerary);
  }, [session, autoSave, saveStatus, preferences, itinerary, saveToDatabase]);

  useEffect(() => {
    // Returning from OAuth with a pending save
    const pendingRaw = sessionStorage.getItem('pendingItinerarySave');
    if (pendingRaw) {
      try {
        const { preferences: savedPrefs, itinerary: savedItinerary } = JSON.parse(pendingRaw);
        sessionStorage.removeItem('pendingItinerarySave');
        setPreferences(savedPrefs);
        setItinerary(savedItinerary);
        setStatus('done');
        setAutoSave(true);
        return;
      } catch {
        sessionStorage.removeItem('pendingItinerarySave');
      }
    }

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

      <ItineraryContent text={itinerary} isStreaming={status === 'streaming'} />

      {status === 'done' && (
        <div className={styles.actions}>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saveStatus === 'saving' || saveStatus === 'saved'}
          >
            {saveStatus === 'saving' && <><Spinner label="Saving itinerary" /> Saving…</>}
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
