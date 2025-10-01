import { Activity, Wifi, WifiOff, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  latency: number;
  lastUpdate: Date;
  updatesPerMinute: number;
  connectionStatus: 'excellent' | 'good' | 'poor' | 'offline';
  subscriptions: number;
}

export const RealTimePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    latency: 0,
    lastUpdate: new Date(),
    updatesPerMinute: 0,
    connectionStatus: 'good',
    subscriptions: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);

  // Measure actual API latency
  useEffect(() => {
    const measureLatency = async () => {
      const start = performance.now();
      try {
        await fetch('/api/ping'); // You'll need to create this endpoint
        const end = performance.now();
        const latency = Math.round(end - start);
        
        setMetrics(prev => ({
          ...prev,
          latency,
          lastUpdate: new Date(),
          connectionStatus: 
            latency < 100 ? 'excellent' :
            latency < 300 ? 'good' :
            latency < 1000 ? 'poor' : 'offline'
        }));
      } catch (error) {
        setMetrics(prev => ({
          ...prev,
          connectionStatus: 'offline'
        }));
      }
    };

    // Measure latency every 5 seconds
    const latencyInterval = setInterval(measureLatency, 5000);
    measureLatency(); // Initial measurement

    return () => clearInterval(latencyInterval);
  }, []);

  // Track updates per minute
  useEffect(() => {
    setUpdateCount(prev => prev + 1);
    
    const resetInterval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        updatesPerMinute: updateCount
      }));
      setUpdateCount(0);
    }, 60000); // Reset every minute

    return () => clearInterval(resetInterval);
  }, [updateCount]);

  const getConnectionColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'poor': return 'text-yellow-600';
      case 'offline': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getConnectionBadgeColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'poor': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'offline': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-full shadow-lg z-50 transition-all"
        title="Show performance monitor"
        aria-label="Show performance monitor"
      >
        <Activity className="h-5 w-5 text-primary" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-card border border-border rounded-lg shadow-2xl z-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Real-Time Performance</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground hover:text-foreground text-lg leading-none"
          aria-label="Close performance monitor"
        >
          ×
        </button>
      </div>

      {/* Metrics */}
      <div className="space-y-3">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {metrics.connectionStatus === 'offline' ? (
              <WifiOff className="h-4 w-4 text-red-600" />
            ) : (
              <Wifi className="h-4 w-4 text-green-600" />
            )}
            <span className="text-sm text-muted-foreground">Connection</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${getConnectionBadgeColor(metrics.connectionStatus)}`}>
            {metrics.connectionStatus}
          </span>
        </div>

        {/* Latency */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
            </div>
            <span className="text-sm text-muted-foreground">Latency</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-mono ${metrics.latency > 500 ? 'text-red-600' : 'text-foreground'}`}>
              {metrics.latency}ms
            </span>
            {metrics.latency > 0 && (
              <div 
                className="h-2 w-16 bg-muted rounded-full overflow-hidden"
                title={`${Math.min((metrics.latency / 1000) * 100, 100).toFixed(0)}%`}
              >
                <div 
                  className={`h-full transition-all ${
                    metrics.latency < 100 ? 'bg-green-500' :
                    metrics.latency < 300 ? 'bg-blue-500' :
                    metrics.latency < 1000 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((metrics.latency / 1000) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Subscriptions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <div className="h-1 w-1 rounded-full bg-primary" />
                <div className="h-1 w-1 rounded-full bg-primary" />
                <div className="h-1 w-1 rounded-full bg-primary" />
              </div>
            </div>
            <span className="text-sm text-muted-foreground">Subscriptions</span>
          </div>
          <span className="text-sm font-mono">{metrics.subscriptions}</span>
        </div>

        {/* Updates per Minute */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Updates/sec</span>
          </div>
          <span className="text-sm font-mono">
            {(metrics.updatesPerMinute / 60).toFixed(1)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="pt-2 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Performance</span>
            <span>
              {metrics.connectionStatus === 'excellent' ? '95%' :
               metrics.connectionStatus === 'good' ? '75%' :
               metrics.connectionStatus === 'poor' ? '45%' : '0%'}
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${
                metrics.connectionStatus === 'excellent' ? 'bg-green-500' :
                metrics.connectionStatus === 'good' ? 'bg-blue-500' :
                metrics.connectionStatus === 'poor' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ 
                width: metrics.connectionStatus === 'excellent' ? '95%' :
                       metrics.connectionStatus === 'good' ? '75%' :
                       metrics.connectionStatus === 'poor' ? '45%' : '0%'
              }}
            />
          </div>
        </div>

        {/* Last Update */}
        <div className="text-xs text-center text-muted-foreground pt-2 border-t border-border">
          Last update: {metrics.lastUpdate.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
