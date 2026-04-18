import type { TravelPreferences } from '@/types/preferences';
import styles from '../PreferenceForm.module.scss';

interface Props {
  data: Partial<TravelPreferences>;
  onChange: (updates: Partial<TravelPreferences>) => void;
}

export default function StepDestination({ data, onChange }: Props) {
  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>Where are you headed?</h2>
      <p className={styles.stepSubtitle}>Tell us your destination and when you plan to travel.</p>

      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="destination">
            Destination
          </label>
          <input
            id="destination"
            type="text"
            className={styles.input}
            placeholder="e.g. Tokyo, Japan"
            value={data.destination ?? ''}
            onChange={e => onChange({ destination: e.target.value })}
          />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="startDate">
              Departure Date
            </label>
            <input
              id="startDate"
              type="date"
              className={styles.input}
              value={data.startDate ?? ''}
              onChange={e => onChange({ startDate: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="endDate">
              Return Date
            </label>
            <input
              id="endDate"
              type="date"
              className={styles.input}
              value={data.endDate ?? ''}
              onChange={e => onChange({ endDate: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
