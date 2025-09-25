"use client"

import { useState } from 'react';
import LoadingSpinner, { LoadingOverlay } from '../../../components/LoadingSpinner';
import { useAsyncOperation, useLoading } from '../../../hooks/useLoading';

export default function LoadingDemo() {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { isLoading: asyncLoading, execute } = useAsyncOperation();
  const [currentVariant, setCurrentVariant] = useState<'default' | 'code-matrix' | 'terminal' | 'circuit' | 'git-flow' | 'neural'>('default');

  const variants = [
    { key: 'default', name: 'Default Tech', description: 'Classic spinning loader with code icon' },
    { key: 'code-matrix', name: 'Code Matrix', description: 'Matrix-style falling code characters' },
    { key: 'terminal', name: 'Terminal', description: 'Terminal-style loading with green text' },
    { key: 'circuit', name: 'Circuit Board', description: 'CPU with orbiting electron particles' },
    { key: 'git-flow', name: 'Git Flow', description: 'Git branching with flowing commits' },
    { key: 'neural', name: 'Neural Network', description: 'Neural network with connecting nodes' },
  ] as const;

  const handleAsyncDemo = async () => {
    await execute(async () => {
      // Simulate an async operation
      await new Promise(resolve => setTimeout(resolve, 3000));
      alert('Async operation completed!');
    });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Tech Loading Components Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of super cool tech-themed loading animations designed for CodeHut.
          </p>
        </div>

        {/* Variant Selector */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
            Choose a Loading Variant
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {variants.map(({ key, name, description }) => (
              <button
                key={key}
                onClick={() => setCurrentVariant(key)}
                className={`p-4 rounded-lg border transition-all ${
                  currentVariant === key
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <h3 className="font-semibold text-foreground mb-2">{name}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Loading Demo Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
            Current Variant: {variants.find(v => v.key === currentVariant)?.name}
          </h2>
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <LoadingSpinner
              variant={currentVariant}
              size="xl"
              message="Loading amazing content"
            />
          </div>
        </div>

        {/* Size Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
            Different Sizes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
              <div key={size} className="bg-card border border-border rounded-lg p-6 text-center">
                <h3 className="font-semibold text-foreground mb-4 capitalize">{size} Size</h3>
                <LoadingSpinner
                  variant={currentVariant}
                  size={size}
                  message={`${size.toUpperCase()} loading`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
            Interactive Demos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <h3 className="font-semibold text-foreground mb-4">Loading Overlay</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Shows a fullscreen loading overlay
              </p>
              <button
                onClick={() => {
                  startLoading();
                  setTimeout(stopLoading, 3000);
                }}
                className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors"
              >
                Show Overlay (3s)
              </button>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <h3 className="font-semibold text-foreground mb-4">Async Operation</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Simulates an async operation with loading
              </p>
              <button
                onClick={handleAsyncDemo}
                disabled={asyncLoading}
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90 transition-colors disabled:opacity-50"
              >
                {asyncLoading ? 'Processing...' : 'Start Async Task'}
              </button>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
            Usage Examples
          </h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <pre className="text-sm text-muted-foreground overflow-x-auto">
{`// Basic usage
<LoadingSpinner variant="code-matrix" size="lg" message="Compiling..." />

// With overlay
<LoadingOverlay isLoading={isLoading} variant="neural" message="Processing..." />

// Using hooks
const { isLoading, startLoading, stopLoading } = useLoading();
const { isLoading: asyncLoading, execute } = useAsyncOperation();

// In page component
export default function Page() {
  return <PageLoading variant="terminal" />;
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay 
        isLoading={isLoading} 
        variant={currentVariant}
        message="Loading overlay demo..." 
      />
    </div>
  );
}