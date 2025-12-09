'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Spirit, spiritKeys } from '@/entities/spirit';

interface SpiritUpdateEvent {
  id: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export function useSpiritsSSE() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource('/api/spirits/stream');

    eventSource.onopen = () => {
      console.log('SSE connection opened');
    };

    eventSource.onmessage = event => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'connected') {
          console.log('SSE connected');
          return;
        }

        const update: SpiritUpdateEvent = data;

        queryClient.setQueryData<Spirit[]>(spiritKeys.list(), oldSpirits => {
          if (!oldSpirits) return oldSpirits;

          return oldSpirits.map(spirit =>
            spirit.id === update.id
              ? { ...spirit, threatLevel: update.threatLevel }
              : spirit
          );
        });

        console.log(
          `Spirit ${update.id} threat level updated to ${update.threatLevel}`
        );
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = error => {
      console.error('SSE error:', error);
      eventSource.close();
    };

    return () => {
      console.log('Closing SSE connection');
      eventSource.close();
    };
  }, [queryClient]);
}
