import { Spirit } from '@/entities/spirit';
import styles from './SpiritStats.module.scss';

interface SpiritStatsProps {
  spirits: Spirit[];
}

export function SpiritStats({ spirits }: SpiritStatsProps) {
  const total = spirits.length;
  const active = spirits.filter(s => s.status === 'Active').length;
  const captured = spirits.filter(s => s.status === 'Captured').length;

  return (
    <div className={styles.stats}>
      <span className={styles.stat}>
        Total: <strong>{total}</strong>
      </span>
      <span className={styles.stat}>
        Active: <strong>{active}</strong>
      </span>
      <span className={styles.stat}>
        Captured: <strong>{captured}</strong>
      </span>
    </div>
  );
}
