"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const seedData = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Create a few test snippets
      const testSnippets = [
        {
          title: "React Hook for API Calls",
          code: `import { useState, useEffect } from 'react';

export function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}`,
          description: "A simple React hook for making API calls with loading and error states",
          language: "JavaScript",
          framework: "React",
          price: 0,
          tags: ["react", "hooks", "api", "javascript"]
        },
        {
          title: "Python Data Validation",
          code: `def validate_email(email):
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    import re
    pattern = r'^\\+?1?\\d{9,15}$'
    return re.match(pattern, phone) is not None

# Example usage
print(validate_email("test@example.com"))  # True
print(validate_phone("+1234567890"))      # True`,
          description: "Utility functions for validating email addresses and phone numbers in Python",
          language: "Python",
          price: 5,
          tags: ["python", "validation", "regex", "utility"]
        },
        {
          title: "CSS Flexbox Center Layout",
          code: `.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

@media (max-width: 640px) {
  .card {
    margin: 1rem;
    padding: 1.5rem;
  }
}`,
          description: "Perfect center layout using CSS Flexbox with responsive design",
          language: "CSS",
          price: 0,
          tags: ["css", "flexbox", "layout", "responsive"]
        }
      ];

      const promises = testSnippets.map(snippet =>
        fetch('/api/snippets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(snippet)
        })
      );

      await Promise.all(promises);
      setMessage('✅ Successfully seeded test data!');
    } catch (error) {
      console.error('Seeding error:', error);
      setMessage('❌ Failed to seed data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const clearData = async () => {
    setLoading(true);
    setMessage('⚠️ Clear data functionality not implemented yet.');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>🌱 Database Seeder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Use this page to seed your database with test data for development.
          </p>
          
          {message && (
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm">{message}</p>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={seedData}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Seeding...' : '🌱 Seed Test Data'}
            </Button>
            <Button 
              variant="outline"
              onClick={clearData}
              disabled={loading}
            >
              🗑️ Clear Data
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>This will create:</p>
            <ul className="list-disc list-inside mt-2">
              <li>3 test code snippets</li>
              <li>Different languages (JavaScript, Python, CSS)</li>
              <li>Mix of free and paid snippets</li>
              <li>Various tags and frameworks</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}