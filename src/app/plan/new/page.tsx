import Navbar from '@/components/layout/Navbar/Navbar';
import PreferenceForm from '@/components/plan/PreferenceForm/PreferenceForm';
import AIMasterTeaser from '@/components/plan/AIMasterTeaser/AIMasterTeaser';
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
          <p className={styles.eyebrow}>Know where you're going?</p>
          <h1 className={styles.heading}>Plan Your Perfect Trip</h1>
          <p className={styles.subheading}>
            Fill in the form to generate a bespoke itinerary in seconds.
          </p>
        </div>

        <PreferenceForm />
        <AIMasterTeaser />
      </main>
    </>
  );
}
