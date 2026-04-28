import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Navbar from '@/components/layout/Navbar/Navbar';
import ChatInterface from '@/components/chat/ChatInterface/ChatInterface';
import styles from './page.module.scss';

export const metadata = {
  title: 'AI Master — PlanMyTravel',
};

export default async function PlanChatPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/plan/new');

  return (
    <>
      <Navbar />
      <main className={styles.page} id="main-content">
        <div className={styles.header}>
          <span className={styles.badge}>AI Master</span>
          <h1 className={styles.heading}>Your personal travel expert</h1>
          <p className={styles.sub}>Ask anything — destinations, best seasons, what to pack — or let me plan your full itinerary.</p>
        </div>
        <div className={styles.chatWrapper}>
          <ChatInterface />
        </div>
      </main>
    </>
  );
}
