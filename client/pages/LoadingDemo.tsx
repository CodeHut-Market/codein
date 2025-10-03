import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BarLoader,
    CardSkeleton,
    DotsLoader,
    DualRingLoader,
    GradientSpinner,
    GridLoader,
    LoadingOverlay,
    LoadingText,
    PulseLoader,
    RingLoader,
    Spinner,
    WaveLoader,
} from '@/components/ui/loading';
import { useState } from 'react';

/**
 * Demo page showcasing all custom loading animations
 * Access at: /loading-demo
 */
export default function LoadingDemo() {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-emerald-50 to-amber-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            🎨 Custom Loading Components Library
          </h1>
          <p className="text-xl text-gray-600">
            Beautiful loading animations for CodeHut
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Spinner */}
          <Card>
            <CardHeader>
              <CardTitle>Spinner</CardTitle>
              <CardDescription>Simple rotating spinner</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center gap-4 min-h-32">
              <Spinner size="sm" className="text-blue-600" />
              <Spinner size="md" className="text-purple-600" />
              <Spinner size="lg" className="text-green-600" />
              <Spinner size="xl" className="text-red-600" />
            </CardContent>
          </Card>

          {/* Dots Loader */}
          <Card>
            <CardHeader>
              <CardTitle>Dots Loader</CardTitle>
              <CardDescription>Three bouncing dots</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center gap-4 min-h-32">
              <DotsLoader size="sm" className="text-blue-600" />
              <DotsLoader size="md" className="text-purple-600" />
              <DotsLoader size="lg" className="text-green-600" />
            </CardContent>
          </Card>

          {/* Pulse Loader */}
          <Card>
            <CardHeader>
              <CardTitle>Pulse Loader</CardTitle>
              <CardDescription>Expanding circle pulse</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center gap-4 min-h-32">
              <PulseLoader size="sm" className="text-blue-600" />
              <PulseLoader size="md" className="text-purple-600" />
              <PulseLoader size="lg" className="text-green-600" />
            </CardContent>
          </Card>

          {/* Bar Loader */}
          <Card>
            <CardHeader>
              <CardTitle>Bar Loader</CardTitle>
              <CardDescription>Sliding progress bar</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-32">
              <div className="w-full max-w-xs">
                <BarLoader />
              </div>
            </CardContent>
          </Card>

          {/* Ring Loader */}
          <Card>
            <CardHeader>
              <CardTitle>Ring Loader</CardTitle>
              <CardDescription>Rotating circle ring</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center gap-4 min-h-32">
              <RingLoader size="sm" />
              <RingLoader size="md" />
              <RingLoader size="lg" />
            </CardContent>
          </Card>

          {/* Dual Ring Loader */}
          <Card>
            <CardHeader>
              <CardTitle>Dual Ring Loader</CardTitle>
              <CardDescription>Two counter-rotating rings</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center gap-4 min-h-32">
              <DualRingLoader size="sm" />
              <DualRingLoader size="md" />
              <DualRingLoader size="lg" />
            </CardContent>
          </Card>

          {/* Grid Loader */}
          <Card>
            <CardHeader>
              <CardTitle>Grid Loader</CardTitle>
              <CardDescription>Pulsing grid squares</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center gap-4 min-h-32">
              <GridLoader size="sm" className="text-blue-600" />
              <GridLoader size="md" className="text-purple-600" />
              <GridLoader size="lg" className="text-green-600" />
            </CardContent>
          </Card>

          {/* Gradient Spinner */}
          <Card>
            <CardHeader>
              <CardTitle>Gradient Spinner</CardTitle>
              <CardDescription>Colorful rotating circle</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center gap-4 min-h-32">
              <GradientSpinner size="sm" />
              <GradientSpinner size="md" />
              <GradientSpinner size="lg" />
            </CardContent>
          </Card>

          {/* Wave Loader */}
          <Card>
            <CardHeader>
              <CardTitle>Wave Loader</CardTitle>
              <CardDescription>Animated wave bars</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center gap-4 min-h-32">
              <WaveLoader size="sm" className="text-blue-600" />
              <WaveLoader size="md" className="text-purple-600" />
              <WaveLoader size="lg" className="text-green-600" />
            </CardContent>
          </Card>

          {/* Loading Text */}
          <Card>
            <CardHeader>
              <CardTitle>Loading Text</CardTitle>
              <CardDescription>Inline loading with message</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 min-h-32">
              <LoadingText text="Loading..." />
              <LoadingText text="Processing your request..." />
            </CardContent>
          </Card>

          {/* Card Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>Card Skeleton</CardTitle>
              <CardDescription>Placeholder for loading cards</CardDescription>
            </CardHeader>
            <CardContent className="min-h-32">
              <CardSkeleton className="h-full" />
            </CardContent>
          </Card>

          {/* Loading Overlay Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Loading Overlay</CardTitle>
              <CardDescription>Full-screen loading modal</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-32">
              <Button onClick={() => setShowOverlay(true)}>
                Show Overlay
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Usage Examples */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>How to use these loading components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Import</h3>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">
{`import {
  Spinner,
  DotsLoader,
  LoadingOverlay,
  LoadingText,
} from '@/components/ui/loading';`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Basic Usage</h3>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">
{`// Simple spinner
<Spinner size="md" className="text-blue-600" />

// Loading text
<LoadingText text="Processing..." />

// Full-screen overlay
{isLoading && <LoadingOverlay message="Uploading..." />}`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Button with Loading State</h3>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">
{`<Button disabled={loading}>
  {loading ? (
    <>
      <Spinner size="sm" className="mr-2" />
      Uploading...
    </>
  ) : (
    'Upload'
  )}
</Button>`}
                  </code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading Overlay */}
      {showOverlay && (
        <LoadingOverlay
          message="This is a full-screen loading overlay!"
          className="cursor-pointer"
          onClick={() => setShowOverlay(false)}
        />
      )}
    </div>
  );
}
