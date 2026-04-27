import type { TravelPreferences } from '@/types/preferences';
import styles from '../PreferenceForm.module.scss';

interface Props {
  data: Partial<TravelPreferences>;
  onChange: (updates: Partial<TravelPreferences>) => void;
}

const budgets: { value: TravelPreferences['budget']; label: string; desc: string }[] = [
  { value: 'budget',    label: 'Budget',    desc: 'Hostels, street food, local transport' },
  { value: 'mid-range', label: 'Mid-Range', desc: 'Comfortable hotels, nice restaurants' },
  { value: 'luxury',    label: 'Luxury',    desc: 'Five-star stays, fine dining, private tours' },
];

const paces: { value: TravelPreferences['pace']; label: string; desc: string }[] = [
  { value: 'slow',     label: 'Leisurely', desc: '2–3 things a day, plenty of downtime' },
  { value: 'moderate', label: 'Moderate',  desc: 'A good mix of sights and relaxation' },
  { value: 'packed',   label: 'Packed',    desc: 'Maximise every moment, see it all' },
];

const interestOptions = [
  '🍜 Food & Cuisine',
  '🏛️ History & Culture',
  '🌿 Nature & Outdoors',
  '🛍️ Shopping',
  '🎭 Arts & Museums',
  '🌃 Nightlife',
  '🧘 Wellness & Spa',
  '📸 Photography',
  '🎵 Music & Events',
  '⛪ Architecture',
];

export default function StepPreferences({ data, onChange }: Props) {
  const interests = data.interests ?? [];

  const toggleInterest = (interest: string) => {
    const updated = interests.includes(interest)
      ? interests.filter(existingInterest => existingInterest !== interest)
      : [...interests, interest];
    onChange({ interests: updated });
  };

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>Your travel style</h2>
      <p className={styles.stepSubtitle}>We'll use this to craft the perfect itinerary.</p>

      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <label id="budget-label" className={styles.label}>Budget</label>
          <div className={styles.cardGrid} role="group" aria-labelledby="budget-label">
            {budgets.map(budgetOption => (
              <button
                key={budgetOption.value}
                type="button"
                aria-pressed={data.budget === budgetOption.value}
                className={`${styles.selectCard} ${data.budget === budgetOption.value ? styles.selectCardActive : ''}`}
                onClick={() => onChange({ budget: budgetOption.value })}
              >
                <span className={styles.selectCardTitle}>{budgetOption.label}</span>
                <span className={styles.selectCardDesc}>{budgetOption.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label id="pace-label" className={styles.label}>Travel Pace</label>
          <div className={styles.cardGrid} role="group" aria-labelledby="pace-label">
            {paces.map(paceOption => (
              <button
                key={paceOption.value}
                type="button"
                aria-pressed={data.pace === paceOption.value}
                className={`${styles.selectCard} ${data.pace === paceOption.value ? styles.selectCardActive : ''}`}
                onClick={() => onChange({ pace: paceOption.value })}
              >
                <span className={styles.selectCardTitle}>{paceOption.label}</span>
                <span className={styles.selectCardDesc}>{paceOption.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label id="interests-label" className={styles.label}>
            Interests <span className={styles.hint}>(pick all that apply)</span>
          </label>
          <div className={styles.interestGrid} role="group" aria-labelledby="interests-label">
            {interestOptions.map(interest => (
              <button
                key={interest}
                type="button"
                aria-pressed={interests.includes(interest)}
                className={`${styles.interestChip} ${interests.includes(interest) ? styles.interestSelected : ''}`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="notes">
            Anything else? <span className={styles.hint}>(optional)</span>
          </label>
          <textarea
            id="notes"
            className={styles.textarea}
            rows={3}
            placeholder="e.g. We have a toddler, need wheelchair access, love hidden gems..."
            value={data.notes ?? ''}
            onChange={e => onChange({ notes: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
