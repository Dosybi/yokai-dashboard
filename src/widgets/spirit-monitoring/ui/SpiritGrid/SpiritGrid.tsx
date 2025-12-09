import { Spirit, SpiritCard } from '@/entities/spirit';
import { CaptureButton } from '@/features/spirit-capture';
import styles from './SpiritGrid.module.scss';

interface SpiritGridProps {
  spirits: Spirit[];
  capturingId: string | null;
  onCapture: (id: string) => void;
}

export function SpiritGrid({
  spirits,
  capturingId,
  onCapture,
}: SpiritGridProps) {
  const sortedSpirits = [...spirits].sort((a, b) => {
    if (a.status === 'Active' && b.status === 'Captured') return -1;
    if (a.status === 'Captured' && b.status === 'Active') return 1;
    return 0;
  });

  return (
    <div className={styles.grid}>
      {sortedSpirits.map(spirit => (
        <SpiritCard
          key={spirit.id}
          spirit={spirit}
          actionSlot={
            <CaptureButton
              spiritId={spirit.id}
              isCapturing={capturingId === spirit.id}
              onCapture={onCapture}
            />
          }
        />
      ))}
    </div>
  );
}
