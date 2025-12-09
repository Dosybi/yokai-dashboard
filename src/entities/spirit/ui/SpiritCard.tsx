'use client';

import { ReactNode } from 'react';
import { Spirit } from '../model';
import { ThreatBadge } from './ThreatBadge';
import { StatusBadge } from './StatusBadge';
import { SpiritCardInfo, InfoItem } from './SpiritCardInfo';
import styles from './SpiritCard.module.scss';

interface SpiritCardProps {
  spirit: Spirit;
  actionSlot?: ReactNode;
}

export function SpiritCard({ spirit, actionSlot }: SpiritCardProps) {
  const isCaptured = spirit.status === 'Captured';

  const getThreatClass = () => {
    if (isCaptured) return '';

    const levelMap = {
      Low: styles.threatLow,
      Medium: styles.threatMedium,
      High: styles.threatHigh,
      Critical: styles.threatCritical,
    };
    return levelMap[spirit.threatLevel] ?? '';
  };

  return (
    <div
      className={`${styles.card} ${getThreatClass()} ${isCaptured ? styles.captured : ''}`}
    >
      <div className={styles.header}>
        <h3 className={styles.name}>{spirit.name}</h3>
        {!isCaptured && <ThreatBadge level={spirit.threatLevel} />}
      </div>

      <SpiritCardInfo>
        <InfoItem label="Location" value={spirit.location} />
        <InfoItem
          label="Status"
          value={<StatusBadge status={spirit.status} />}
          highlight
        />
      </SpiritCardInfo>

      {!isCaptured && actionSlot}
    </div>
  );
}
