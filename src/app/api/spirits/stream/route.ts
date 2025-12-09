import { NextRequest } from 'next/server';
import { spirits } from '../data';

const threatLevels: Array<'Low' | 'Medium' | 'High' | 'Critical'> = [
  'Low',
  'Medium',
  'High',
  'Critical',
];

function getRandomThreatLevel(): 'Low' | 'Medium' | 'High' | 'Critical' {
  return threatLevels[Math.floor(Math.random() * threatLevels.length)];
}

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const initialData = `data: ${JSON.stringify({ type: 'connected' })}\n\n`;
      controller.enqueue(encoder.encode(initialData));

      const interval = setInterval(() => {
        try {
          const activeSpirits = spirits.filter(s => s.status === 'Active');

          if (activeSpirits.length === 0) {
            return;
          }

          const randomSpirit =
            activeSpirits[Math.floor(Math.random() * activeSpirits.length)];
          const newThreatLevel = getRandomThreatLevel();

          const spiritIndex = spirits.findIndex(s => s.id === randomSpirit.id);
          if (spiritIndex !== -1) {
            spirits[spiritIndex] = {
              ...spirits[spiritIndex],
              threatLevel: newThreatLevel,
            };
          }

          const updateEvent = {
            id: randomSpirit.id,
            threatLevel: newThreatLevel,
          };

          const data = `data: ${JSON.stringify(updateEvent)}\n\n`;
          controller.enqueue(encoder.encode(data));
        } catch (error) {
          console.error('Error updating spirit in SSE stream');
        }
      }, 5000);

      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
