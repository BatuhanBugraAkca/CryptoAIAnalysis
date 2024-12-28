import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 3600; // Her saat başı yenile

export async function POST() {
  try {
    // Statik contact form yanıtı
    return NextResponse.json({
      success: true,
      message: 'Contact form submission would be processed in production'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
} 