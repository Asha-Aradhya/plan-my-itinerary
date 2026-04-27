import Navbar from '@/components/layout/Navbar/Navbar';
import PreferenceForm from '@/components/plan/PreferenceForm/PreferenceForm';
import styles from './page.module.scss';

export const metadata = {
  title: 'Plan Your Trip — PlanMyTravel',
};

export default function PlanNewPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className={styles.page}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Let's get started</p>
          <h1 className={styles.heading}>Plan Your Perfect Trip</h1>
          <p className={styles.subheading}>
            Answer a few questions and we'll generate a bespoke itinerary just for you.
          </p>
        </div>

        <PreferenceForm />
      </main>
    </>
  );
}
