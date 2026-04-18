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
      ? interests.filter(i => i !== interest)
      : [...interests, interest];
    onChange({ interests: updated });
  };

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>Your travel style</h2>
      <p className={styles.stepSubtitle}>We'll use this to craft the perfect itinerary.</p>

      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <label className={styles.label}>Budget</label>
          <div className={styles.cardGrid}>
            {budgets.map(b => (
              <button
                key={b.value}
                type="button"
                className={`${styles.selectCard} ${data.budget === b.value ? styles.selectCardActive : ''}`}
                onClick={() => onChange({ budget: b.value })}
              >
                <span className={styles.selectCardTitle}>{b.label}</span>
                <span className={styles.selectCardDesc}>{b.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Travel Pace</label>
          <div className={styles.cardGrid}>
            {paces.map(p => (
              <button
                key={p.value}
                type="button"
                className={`${styles.selectCard} ${data.pace === p.value ? styles.selectCardActive : ''}`}
                onClick={() => onChange({ pace: p.value })}
              >
                <span className={styles.selectCardTitle}>{p.label}</span>
                <span className={styles.selectCardDesc}>{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Interests <span className={styles.hint}>(pick all that apply)</span></label>
          <div className={styles.interestGrid}>
            {interestOptions.map(interest => (
              <button
                key={interest}
                type="button"
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
