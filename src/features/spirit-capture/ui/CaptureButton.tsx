'use client';

import { Button } from '@/shared/ui/button';
import styles from './CaptureButton.module.scss';

interface CaptureButtonProps {
  spiritId: string;
  isCapturing?: boolean;
  onCapture: (spiritId: string) => void;
}

export function CaptureButton({
  spiritId,
  isCapturing = false,
  onCapture,
}: CaptureButtonProps) {
  const handleClick = () => {
    if (!isCapturing) {
      onCapture(spiritId);
    }
  };

  return (
    <Button
      variant="primary"
      size="medium"
      fullWidth
      onClick={handleClick}
      loading={isCapturing}
      className={styles.button}
    >
      Capture
    </Button>
  );
}
