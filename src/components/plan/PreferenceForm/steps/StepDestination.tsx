import type { TravelPreferences } from '@/types/preferences';
import styles from '../PreferenceForm.module.scss';

interface Props {
  data: Partial<TravelPreferences>;
  onChange: (updates: Partial<TravelPreferences>) => void;
}

function toDateString(date: Date) {
  return date.toISOString().split('T')[0];
}

export default function StepDestination({ data, onChange }: Props) {
  const today = toDateString(new Date());

  // Return date minimum is the day after departure, or tomorrow if no departure set
  const minReturn = data.startDate
    ? toDateString(new Date(new Date(data.startDate).getTime() + 86400000))
    : toDateString(new Date(Date.now() + 86400000));

  const handleDepartureChange = (value: string) => {
    const updates: Partial<TravelPreferences> = { startDate: value };
    // Clear return date if it's now before the new departure date
    if (data.endDate && data.endDate <= value) {
      updates.endDate = '';
    }
    onChange(updates);
  };

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
              min={today}
              value={data.startDate ?? ''}
              onChange={e => handleDepartureChange(e.target.value)}
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
              min={minReturn}
              value={data.endDate ?? ''}
              disabled={!data.startDate}
              onChange={e => onChange({ endDate: e.target.value })}
            />
            {!data.startDate && (
              <span className={styles.fieldHint}>Select a departure date first</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
