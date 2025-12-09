import { Spirit } from '../../model';
import styles from './ThreatBadge.module.scss';

interface ThreatBadgeProps {
  level: Spirit['threatLevel'];
}

export function ThreatBadge({ level }: ThreatBadgeProps) {
  const levelClass = styles[`level-${level.toLowerCase()}`];

  return <span className={`${styles.badge} ${levelClass}`}>{level}</span>;
}
