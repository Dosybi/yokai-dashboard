import { NextResponse } from 'next/server';
import { spiritSchema } from '@/entities/spirit';
import { spirits } from './data';

export async function GET() {
  try {
    const validatedSpirits = spirits.map(spirit => spiritSchema.parse(spirit));

    return NextResponse.json({
      success: true,
      data: validatedSpirits,
      total: validatedSpirits.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Data validation error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
