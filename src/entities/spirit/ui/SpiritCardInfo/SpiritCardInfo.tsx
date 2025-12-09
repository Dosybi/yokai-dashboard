import { ReactNode } from 'react';
import styles from './SpiritCardInfo.module.scss';

interface InfoItemProps {
  label: string;
  value: ReactNode;
  highlight?: boolean;
}

interface SpiritCardInfoProps {
  children: ReactNode;
}

export function InfoItem({ label, value, highlight = false }: InfoItemProps) {
  return (
    <div className={styles.item}>
      <span className={styles.label}>{label}:</span>
      <span className={`${styles.value} ${highlight ? styles.highlight : ''}`}>
        {value}
      </span>
    </div>
  );
}

export function SpiritCardInfo({ children }: SpiritCardInfoProps) {
  return <div className={styles.info}>{children}</div>;
}
