import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return demo stats data
    // In a real app, you'd query your database to get actual statistics
    const stats = {
      success: true,
      data: {
        totalSnippets: 15742,
        totalUsers: 8234,
        totalDownloads: 147823,
        totalRevenue: 98456.78,
        averageRating: 4.6,
        popularLanguages: [
          { name: "JavaScript", count: 4523, percentage: 28.7 },
          { name: "Python", count: 3214, percentage: 20.4 },
          { name: "TypeScript", count: 2834, percentage: 18.0 },
          { name: "React", count: 2187, percentage: 13.9 },
          { name: "Node.js", count: 1654, percentage: 10.5 },
          { name: "Other", count: 1330, percentage: 8.5 }
        ],
        recentActivity: {
          dailyUploads: 23,
          dailyDownloads: 456,
          dailyRevenue: 234.56,
          newUsers: 12
        },
        monthlyTrends: [
          { month: "Jan", uploads: 342, downloads: 5432, revenue: 2345.67 },
          { month: "Feb", uploads: 389, downloads: 6123, revenue: 2987.43 },
          { month: "Mar", uploads: 456, downloads: 7234, revenue: 3456.78 },
          { month: "Apr", uploads: 523, downloads: 8345, revenue: 4123.45 },
          { month: "May", uploads: 634, downloads: 9456, revenue: 4987.32 },
          { month: "Jun", uploads: 789, downloads: 10567, revenue: 5678.90 }
        ]
      }
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}