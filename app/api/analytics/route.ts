import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 3600; // Her saat başı yenile

export async function GET() {
  try {
    // Örnek analitik verileri
    const mockAnalytics = {
      visitors: {
        daily: 1500,
        weekly: 10500,
        monthly: 45000
      },
      pageViews: {
        total: 75000,
        unique: 50000
      },
      topPages: [
        { path: '/', views: 25000 },
        { path: '/analysis', views: 15000 },
        { path: '/contact', views: 5000 }
      ],
      userMetrics: {
        averageSessionDuration: '5:30',
        bounceRate: '35%',
        returnVisitors: '45%'
      }
    };

    return NextResponse.json({
      success: true,
      data: mockAnalytics
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Analytics data fetch failed' },
      { status: 500 }
    );
  }
} 