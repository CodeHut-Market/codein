import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'UI Library | CodeHut',
  description: 'Professional React components and templates for developers. Save development time with our premium UI library.',
};

export default function UILibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to CodeHut
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-6">
                <Link 
                  href="/ui-library" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Overview
                </Link>
                <Link 
                  href="/ui-library/components" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Components
                </Link>
                <Link 
                  href="/ui-library/docs" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
              </nav>
              
              <Button size="sm" asChild>
                <Link href="/ui-library/subscribe?plan=pro">
                  Subscribe
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Crown className="w-6 h-6 mr-2 text-primary" />
              <span className="text-xl font-bold">CodeHut UI Library</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Professional React components and templates for modern applications. 
              Built with TypeScript, Tailwind CSS, and best practices.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/support" className="text-muted-foreground hover:text-foreground">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}