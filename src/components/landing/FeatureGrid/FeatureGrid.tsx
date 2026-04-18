import styles from './FeatureGrid.module.scss';

const features = [
  {
    icon: '🗺️',
    title: 'Tell Us Your Dream',
    description:
      'Share your destination, dates, interests and travel style through our intuitive preference form.',
  },
  {
    icon: '✨',
    title: 'AI Crafts Your Plan',
    description:
      'Our AI analyses thousands of travel possibilities to build a personalised day-by-day itinerary just for you.',
  },
  {
    icon: '📖',
    title: 'Travel with Confidence',
    description:
      'Receive a detailed, curated plan with morning, afternoon and evening suggestions — ready to follow.',
  },
];

export default function FeatureGrid() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>How it works</p>
          <h2 className={styles.heading}>
            A Smarter Way to Travel
          </h2>
          <p className={styles.subheading}>
            From dream to departure in three simple steps.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={feature.title} className={styles.card}>
              <div className={styles.stepNumber}>0{index + 1}</div>
              <div className={styles.icon}>{feature.icon}</div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
