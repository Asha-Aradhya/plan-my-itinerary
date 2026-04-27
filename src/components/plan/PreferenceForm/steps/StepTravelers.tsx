import type { TravelPreferences } from '@/types/preferences';
import styles from '../PreferenceForm.module.scss';

interface Props {
  data: Partial<TravelPreferences>;
  onChange: (updates: Partial<TravelPreferences>) => void;
}

const tripTypes: { value: TravelPreferences['tripType']; label: string; icon: string }[] = [
  { value: 'adventure',   label: 'Adventure',  icon: '🏔️' },
  { value: 'relaxation',  label: 'Relaxation', icon: '🏖️' },
  { value: 'cultural',    label: 'Cultural',   icon: '🏛️' },
  { value: 'family',      label: 'Family',     icon: '👨‍👩‍👧' },
  { value: 'romantic',    label: 'Romantic',   icon: '💑' },
];

export default function StepTravelers({ data, onChange }: Props) {
  const travelerCount = data.travelers ?? 1;

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>Who's travelling?</h2>
      <p className={styles.stepSubtitle}>Help us tailor the plan to your group.</p>

      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <label id="travellers-label" className={styles.label}>Number of Travellers</label>
          <div className={styles.counter} role="group" aria-labelledby="travellers-label">
            <button
              type="button"
              className={styles.counterBtn}
              aria-label="Decrease number of travellers"
              onClick={() => onChange({ travelers: Math.max(1, travelerCount - 1) })}
            >
              −
            </button>
            <output aria-live="polite" className={styles.counterValue}>
              {travelerCount}
            </output>
            <button
              type="button"
              className={styles.counterBtn}
              aria-label="Increase number of travellers"
              onClick={() => onChange({ travelers: Math.min(20, travelerCount + 1) })}
            >
              +
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label id="trip-type-label" className={styles.label}>Trip Type</label>
          <div className={styles.chipGrid} role="group" aria-labelledby="trip-type-label">
            {tripTypes.map(type => (
              <button
                key={type.value}
                type="button"
                aria-pressed={data.tripType === type.value}
                className={`${styles.chip} ${data.tripType === type.value ? styles.chipSelected : ''}`}
                onClick={() => onChange({ tripType: type.value })}
              >
                <span aria-hidden="true">{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
