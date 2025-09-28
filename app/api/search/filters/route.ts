import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return demo filter data
    // In a real app, you'd query your database to get available filters
    const filters = {
      success: true,
      filters: {
        languages: [
          "JavaScript",
          "TypeScript", 
          "Python",
          "Java",
          "C++",
          "C#",
          "PHP",
          "Ruby",
          "Go",
          "Rust"
        ],
        frameworks: [
          "React",
          "Vue",
          "Angular",
          "Node.js",
          "Express",
          "Django",
          "Flask",
          "Spring Boot",
          "Laravel",
          "Ruby on Rails"
        ],
        tags: [
          "frontend",
          "backend",
          "database",
          "api",
          "hooks",
          "components",
          "utility",
          "helper",
          "authentication",
          "validation",
          "forms",
          "charts",
          "ui",
          "ux",
          "responsive",
          "mobile"
        ],
        priceRanges: [
          { label: "Free", min: 0, max: 0 },
          { label: "Under $5", min: 0.01, max: 5 },
          { label: "$5 - $15", min: 5, max: 15 },
          { label: "$15 - $50", min: 15, max: 50 },
          { label: "Over $50", min: 50, max: null }
        ],
        sortOptions: [
          { value: "newest", label: "Newest First" },
          { value: "oldest", label: "Oldest First" },
          { value: "popular", label: "Most Popular" },
          { value: "rating", label: "Highest Rated" },
          { value: "price-low", label: "Price: Low to High" },
          { value: "price-high", label: "Price: High to Low" }
        ]
      }
    };

    return NextResponse.json(filters);

  } catch (error) {
    console.error('Error fetching search filters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search filters' },
      { status: 500 }
    );
  }
}