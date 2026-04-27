import Navbar from '@/components/layout/Navbar/Navbar';
import ItineraryDisplay from '@/components/itinerary/ItineraryDisplay/ItineraryDisplay';
import styles from './page.module.scss';

export const metadata = {
  title: 'Your Itinerary — PlanMyTravel',
};

export default function ItineraryPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className={styles.page}>
        <ItineraryDisplay />
      </main>
    </>
  );
}
