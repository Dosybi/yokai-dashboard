import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { spiritSchema } from '@/entities/spirit';
import { spirits } from '../data';

const CHANCE_OF_FAILURE = 30;

const captureRequestSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = captureRequestSchema.parse(body);

    const spiritIndex = spirits.findIndex(s => s.id === id);

    if (spiritIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Spirit not found',
        },
        { status: 404 }
      );
    }

    const spirit = spirits[spiritIndex];

    if (spirit.status === 'Captured') {
      return NextResponse.json(
        {
          success: false,
          error: 'Spirit already captured',
        },
        { status: 400 }
      );
    }

    const shouldFail = Math.random() < CHANCE_OF_FAILURE / 100;

    if (shouldFail) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to capture spirit. Try again.',
        },
        { status: 500 }
      );
    }

    spirits[spiritIndex] = {
      ...spirit,
      status: 'Captured',
    };

    const updatedSpirit = spiritSchema.parse(spirits[spiritIndex]);

    return NextResponse.json({
      success: true,
      message: 'Spirit successfully captured',
      data: updatedSpirit,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
