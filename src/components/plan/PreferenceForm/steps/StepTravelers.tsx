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
  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>Who's travelling?</h2>
      <p className={styles.stepSubtitle}>Help us tailor the plan to your group.</p>

      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <label className={styles.label}>Number of Travellers</label>
          <div className={styles.counter}>
            <button
              type="button"
              className={styles.counterBtn}
              onClick={() => onChange({ travelers: Math.max(1, (data.travelers ?? 1) - 1) })}
            >
              −
            </button>
            <span className={styles.counterValue}>{data.travelers ?? 1}</span>
            <button
              type="button"
              className={styles.counterBtn}
              onClick={() => onChange({ travelers: Math.min(20, (data.travelers ?? 1) + 1) })}
            >
              +
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Trip Type</label>
          <div className={styles.chipGrid}>
            {tripTypes.map(type => (
              <button
                key={type.value}
                type="button"
                className={`${styles.chip} ${data.tripType === type.value ? styles.chipSelected : ''}`}
                onClick={() => onChange({ tripType: type.value })}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
