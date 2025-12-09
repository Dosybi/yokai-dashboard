'use client';

import { useSpiritsSSE } from '@/entities/spirit';
import { SpiritList } from '@/widgets/spirit-monitoring';
import styles from './page.module.scss';

export default function MonitoringPage() {
  useSpiritsSSE();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tokyo Spirit Monitoring</h1>
        <p className={styles.subtitle}>Real-time yokai activity tracking</p>
      </header>
      <main className={styles.main}>
        <SpiritList />
      </main>
    </div>
  );
}
