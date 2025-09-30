import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route since it uses request.url
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    
    // Generate demo trending data based on the requested timeframe
    const generateTrendingData = (timeframe: number) => {
      const baseData = [
        {
          id: "trending-1",
          title: "React Custom Hook for API Calls",
          description: "Powerful hook for handling API requests with caching",
          language: "TypeScript",
          framework: "React",
          author: "HookMaster",
          downloads: Math.floor(Math.random() * 1000) + 500,
          rating: 4.8,
          trend: "+234%",
          category: "hooks"
        },
        {
          id: "trending-2", 
          title: "Vue 3 State Management Utility",
          description: "Lightweight state management for Vue applications",
          language: "JavaScript",
          framework: "Vue",
          author: "VueExpert",
          downloads: Math.floor(Math.random() * 800) + 400,
          rating: 4.7,
          trend: "+189%",
          category: "utilities"
        },
        {
          id: "trending-3",
          title: "Python Data Validator",
          description: "Comprehensive data validation for Python apps",
          language: "Python",
          framework: "Django",
          author: "PythonGuru",
          downloads: Math.floor(Math.random() * 600) + 300,
          rating: 4.9,
          trend: "+156%",
          category: "validation"
        },
        {
          id: "trending-4",
          title: "CSS Animation Library",
          description: "Beautiful CSS animations ready to use",
          language: "CSS",
          framework: "None",
          author: "AnimationPro",
          downloads: Math.floor(Math.random() * 900) + 600,
          rating: 4.6,
          trend: "+143%",
          category: "styling"
        },
        {
          id: "trending-5",
          title: "Node.js Authentication Middleware",
          description: "Secure JWT authentication for Express apps",
          language: "JavaScript",
          framework: "Express",
          author: "SecurityDev",
          downloads: Math.floor(Math.random() * 700) + 350,
          rating: 4.8,
          trend: "+127%",
          category: "authentication"
        }
      ];

      // Adjust data based on timeframe
      return baseData.map(item => ({
        ...item,
        downloads: Math.floor(item.downloads * (timeframe / 7)), // Scale based on timeframe
        period: `${timeframe} days`
      }));
    };

    const trendingData = {
      success: true,
      data: {
        period: `${days} days`,
        trending: generateTrendingData(days),
        categories: [
          { name: "hooks", count: 45, trend: "+23%" },
          { name: "utilities", count: 38, trend: "+19%" },
          { name: "validation", count: 29, trend: "+15%" },
          { name: "styling", count: 34, trend: "+12%" },
          { name: "authentication", count: 22, trend: "+8%" }
        ],
        topAuthors: [
          { name: "HookMaster", snippets: 12, downloads: 4567, trend: "+34%" },
          { name: "VueExpert", snippets: 8, downloads: 3234, trend: "+28%" },
          { name: "PythonGuru", snippets: 15, downloads: 5432, trend: "+25%" },
          { name: "AnimationPro", snippets: 6, downloads: 2890, trend: "+22%" },
          { name: "SecurityDev", snippets: 9, downloads: 3876, trend: "+18%" }
        ]
      }
    };

    return NextResponse.json(trendingData);

  } catch (error) {
    console.error('Error fetching trending stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending statistics' },
      { status: 500 }
    );
  }
}