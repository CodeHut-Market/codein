import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route since it uses request.url
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tags = searchParams.get('tags')?.split(',') || [];
    const language = searchParams.get('language');
    const exclude = searchParams.get('exclude');
    const limit = parseInt(searchParams.get('limit') || '5');

    // For now, return demo data since we don't have a full database setup
    // In a real app, you'd query your database for related snippets
    const demoRelatedSnippets = [
      {
        id: "related-1",
        title: "React useSessionStorage Hook",
        description: "Similar to useLocalStorage but for sessionStorage",
        code: "// Session storage hook...",
        price: 0,
        rating: 4.6,
        language: "TypeScript",
        framework: "React",
        tags: ["react", "hooks", "sessionstorage"],
        author: "ReactExpert",
        authorId: "react-expert-123",
        downloads: 943,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "related-2",
        title: "React useFetch Hook",
        description: "Custom hook for making HTTP requests",
        code: "// Fetch hook...",
        price: 5,
        rating: 4.9,
        language: "TypeScript",
        framework: "React",
        tags: ["react", "hooks", "api", "fetch"],
        author: "ApiMaster",
        authorId: "api-master-456",
        downloads: 2156,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "related-3",
        title: "Vue Composition API Helper",
        description: "Utility functions for Vue 3",
        code: "// Vue helper...",
        price: 3,
        rating: 4.4,
        language: "TypeScript",
        framework: "Vue",
        tags: ["vue", "composition", "helper"],
        author: "VueGuru",
        authorId: "vue-guru-789",
        downloads: 734,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    // Filter out the excluded snippet if specified
    const filteredSnippets = exclude 
      ? demoRelatedSnippets.filter(snippet => snippet.id !== exclude)
      : demoRelatedSnippets;

    // Simple matching logic - in a real app you'd use a proper search
    let matchedSnippets = filteredSnippets;
    
    if (language) {
      matchedSnippets = matchedSnippets.filter(snippet => 
        snippet.language.toLowerCase() === language.toLowerCase() ||
        snippet.framework?.toLowerCase() === language.toLowerCase()
      );
    }

    if (tags.length > 0) {
      matchedSnippets = matchedSnippets.filter(snippet =>
        tags.some(tag => snippet.tags.includes(tag.toLowerCase()))
      );
    }

    // Limit results
    const limitedSnippets = matchedSnippets.slice(0, limit);

    return NextResponse.json({
      success: true,
      snippets: limitedSnippets,
      total: limitedSnippets.length
    });

  } catch (error) {
    console.error('Error fetching related snippets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related snippets' },
      { status: 500 }
    );
  }
}