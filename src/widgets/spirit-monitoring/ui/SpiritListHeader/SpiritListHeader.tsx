import { ReactNode } from 'react';
import styles from './SpiritListHeader.module.scss';

interface SpiritListHeaderProps {
  title: string;
  children?: ReactNode;
}

export function SpiritListHeader({ title, children }: SpiritListHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </div>
  );
}
