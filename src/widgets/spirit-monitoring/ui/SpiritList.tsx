'use client';

import { useSpiritsQuery } from '@/entities/spirit/api/queries';
import { useCaptureSpirit } from '@/features/spirit-capture';
import { NotificationContainer } from '@/shared/ui/notification';
import { SpiritListHeader } from './SpiritListHeader';
import { SpiritStats } from './SpiritStats';
import { SpiritGrid } from './SpiritGrid';
import styles from './SpiritList.module.scss';

export function SpiritList() {
  const { data: spirits, isLoading, error } = useSpiritsQuery();
  const { capturingId, notifications, handleCapture, removeNotification } =
    useCaptureSpirit();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading spirits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Loading error: {error.message}</div>
      </div>
    );
  }

  if (!spirits || spirits.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No spirits found</div>
      </div>
    );
  }

  return (
    <>
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />

      <div className={styles.container}>
        <SpiritListHeader title="Spirits">
          <SpiritStats spirits={spirits} />
        </SpiritListHeader>

        <SpiritGrid
          spirits={spirits}
          capturingId={capturingId}
          onCapture={spiritId => handleCapture(spiritId, spirits)}
        />
      </div>
    </>
  );
}
