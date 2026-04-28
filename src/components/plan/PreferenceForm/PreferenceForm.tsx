'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '@/components/plan/StepIndicator/StepIndicator';
import StepDestination from './steps/StepDestination';
import StepTravelers from './steps/StepTravelers';
import StepPreferences from './steps/StepPreferences';
import Spinner from '@/components/Spinner/Spinner';
import type { TravelPreferences } from '@/types/preferences';
import { travelPreferencesSchema } from '@/types/preferences';
import styles from './PreferenceForm.module.scss';

const STEPS = ['Destination', 'Travellers', 'Preferences'];

const defaultData: Partial<TravelPreferences> = {
  travelers: 1,
  interests: [],
};

export default function PreferenceForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<TravelPreferences>>(defaultData);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const update = (updates: Partial<TravelPreferences>) => {
    setData(previousData => ({ ...previousData, ...updates }));
    setError(null);
  };

  const validateStep = (): boolean => {
    if (step === 0) {
      if (!data.destination?.trim()) { setError('Please enter a destination.'); return false; }
      if (!data.startDate) { setError('Please select a departure date.'); return false; }
      if (!data.endDate)   { setError('Please select a return date.'); return false; }
      if (data.startDate >= data.endDate) { setError('Return date must be after departure date.'); return false; }
    }
    if (step === 1) {
      if (!data.tripType) { setError('Please select a trip type.'); return false; }
    }
    if (step === 2) {
      if (!data.budget) { setError('Please select a budget.'); return false; }
      if (!data.pace)   { setError('Please select a travel pace.'); return false; }
      if (!data.interests?.length) { setError('Please select at least one interest.'); return false; }
    }
    return true;
  };

  const next = async () => {
    if (!validateStep()) return;

    if (step === 0) {
      setIsValidating(true);
      try {
        const response = await fetch('/api/validate-destination', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destination: data.destination }),
        });
        const { valid } = await response.json();
        if (!valid) {
          setError("We couldn't find this destination. Please check the spelling and try again.");
          return;
        }
      } finally {
        setIsValidating(false);
      }
    }

    setStep(currentStep => currentStep + 1);
  };

  const back = () => {
    setError(null);
    setStep(currentStep => currentStep - 1);
  };

  const submit = () => {
    if (!validateStep()) return;

    const result = travelPreferencesSchema.safeParse(data);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Please fill in all fields.');
      return;
    }

    sessionStorage.setItem('travelPreferences', JSON.stringify(result.data));
    router.push('/itinerary');
  };

  return (
    <div className={styles.formWrapper}>
      <StepIndicator steps={STEPS} currentStep={step} />

      <div className={styles.card}>
        {step === 0 && <StepDestination data={data} onChange={update} />}
        {step === 1 && <StepTravelers   data={data} onChange={update} />}
        {step === 2 && <StepPreferences data={data} onChange={update} />}

        {error && <p role="alert" className={styles.error}>{error}</p>}

        <div className={styles.nav}>
          {step > 0 && (
            <button type="button" className={styles.backBtn} onClick={back}>
              ← Back
            </button>
          )}
          <div className={styles.navSpacer} />
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              className={styles.nextBtn}
              onClick={next}
              disabled={isValidating}
            >
              {isValidating ? <><Spinner label="Checking destination" /> Checking…</> : 'Continue →'}
            </button>
          ) : (
            <button type="button" className={styles.submitBtn} onClick={submit}>
              Generate My Itinerary ✦
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
