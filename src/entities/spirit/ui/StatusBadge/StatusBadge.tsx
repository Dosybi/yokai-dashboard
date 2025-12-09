import { Spirit } from '../../model';
import styles from './StatusBadge.module.scss';

interface StatusBadgeProps {
  status: Spirit['status'];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusClass = styles[`status-${status.toLowerCase()}`];

  return <span className={`${styles.badge} ${statusClass}`}>{status}</span>;
}
