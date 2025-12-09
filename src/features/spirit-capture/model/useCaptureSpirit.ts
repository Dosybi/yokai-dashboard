import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Spirit, spiritSchema } from '@/entities/spirit/model';

interface CaptureResponse {
  success: boolean;
  message?: string;
  data?: Spirit;
  error?: string;
}

async function captureSpirit(id: string): Promise<Spirit> {
  const response = await fetch('/api/spirits/capture', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  const json: CaptureResponse = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.error || 'Failed to capture spirit');
  }

  if (!json.data) {
    throw new Error('No data received for captured spirit');
  }

  return spiritSchema.parse(json.data);
}

const spiritKeys = {
  all: ['spirits'] as const,
  lists: () => [...spiritKeys.all, 'list'] as const,
  list: () => [...spiritKeys.lists()] as const,
};

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function useCaptureSpirit() {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [capturingId, setCapturingId] = useState<string | null>(null);

  const { mutate: captureMutation } = useMutation({
    mutationFn: captureSpirit,
    onMutate: async (spiritId: string) => {
      await queryClient.cancelQueries({ queryKey: spiritKeys.list() });

      const previousSpirits = queryClient.getQueryData<Spirit[]>(
        spiritKeys.list()
      );

      if (previousSpirits) {
        queryClient.setQueryData<Spirit[]>(spiritKeys.list(), old =>
          old
            ? old.map(spirit =>
                spirit.id === spiritId
                  ? { ...spirit, status: 'Captured' as const }
                  : spirit
              )
            : old
        );
      }

      return { previousSpirits };
    },
    onSuccess: capturedSpirit => {
      queryClient.setQueryData<Spirit[]>(spiritKeys.list(), old =>
        old
          ? old.map(spirit =>
              spirit.id === capturedSpirit.id ? capturedSpirit : spirit
            )
          : old
      );
      setCapturingId(null);
    },
    onError: (error, _spiritId, context) => {
      if (context?.previousSpirits) {
        queryClient.setQueryData<Spirit[]>(
          spiritKeys.list(),
          context.previousSpirits
        );
      }

      const notification: Notification = {
        id: Date.now().toString(),
        message: (error as Error).message,
        type: 'error',
      };
      setNotifications(prev => [...prev, notification]);
      setCapturingId(null);
    },
  });

  const handleCapture = useCallback(
    (spiritId: string, spirits?: Spirit[]) => {
      if (capturingId) return;

      const spirit = spirits?.find(s => s.id === spiritId);
      if (!spirit || spirit.status === 'Captured') return;

      setCapturingId(spiritId);
      captureMutation(spiritId);
    },
    [captureMutation, capturingId]
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    capturingId,
    notifications,
    handleCapture,
    removeNotification,
  };
}
