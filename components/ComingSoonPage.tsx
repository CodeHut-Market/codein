import { ArrowLeft, Construction } from 'lucide-react';
import Link from 'next/link';

interface ComingSoonPageProps {
  title: string;
  description: string;
  expectedDate?: string;
}

export default function ComingSoonPage({ 
  title, 
  description, 
  expectedDate = "Coming Soon" 
}: ComingSoonPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <Construction className="h-16 w-16 text-primary" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-6">
          {title}
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          {description}
        </p>
        
        <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8">
          {expectedDate}
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </button>
            </Link>
            <Link href="/explore">
              <button className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                Explore Code
              </button>
            </Link>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Want to be notified when it's ready?</h3>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}