import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 3600; // Her saat başı yenile

export async function GET() {
  try {
    // Statik test email yanıtı
    return NextResponse.json({
      success: true,
      message: 'Email test endpoint is configured correctly'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Email test failed' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Statik test email yanıtı
    return NextResponse.json({
      success: true,
      message: 'Test email would be sent in production'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to send test email' },
      { status: 500 }
    );
  }
} 