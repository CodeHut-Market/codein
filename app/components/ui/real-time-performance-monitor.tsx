"use client";

import React, { useEffect, useState } from 'react';
import { Activity, Zap, Timer, Database, Wifi } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Progress } from './progress';
import { Badge } from './badge';
import { useRealTime } from '../../contexts/RealTimeContext';

interface PerformanceMetrics {
  connectionLatency: number;
  subscriptionCount: number;
  updateFrequency: number;
  memoryUsage: number;
  dataTransferred: number;
  lastUpdateTime: Date;
}

interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

export const RealTimePerformanceMonitor: React.FC = () => {
  const { connectionState } = useRealTime();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    connectionLatency: 0,
    subscriptionCount: 0,
    updateFrequency: 0,
    memoryUsage: 0,
    dataTransferred: 0,
    lastUpdateTime: new Date()
  });
  
  const [isVisible, setIsVisible] = useState(false);
  
  // Monitor performance metrics
  useEffect(() => {
    const startTime = performance.now();
    let updateCount = 0;
    const startMemory = (performance as PerformanceWithMemory).memory?.usedJSHeapSize || 0;
    
    const interval = setInterval(() => {
      const currentTime = performance.now();
      const currentMemory = (performance as PerformanceWithMemory).memory?.usedJSHeapSize || 0;
      
      setMetrics(prev => ({
        ...prev,
        connectionLatency: Math.round(currentTime - startTime),
        updateFrequency: updateCount,
        memoryUsage: Math.round((currentMemory - startMemory) / 1024 / 1024), // MB
        lastUpdateTime: new Date()
      }));
      
      updateCount++;
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Track subscription count (this would need to be exposed from RealTimeContext)
  useEffect(() => {
    // Placeholder - in real implementation, this would come from the context
    setMetrics(prev => ({
      ...prev,
      subscriptionCount: Math.floor(Math.random() * 10) + 1
    }));
  }, [connectionState]);
  
  const getConnectionQuality = () => {
    if (connectionState.status !== 'connected') return 'poor';
    if (metrics.connectionLatency < 100) return 'excellent';
    if (metrics.connectionLatency < 300) return 'good';
    if (metrics.connectionLatency < 500) return 'fair';
    return 'poor';
  };
  
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  const quality = getConnectionQuality();
  
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-2 bg-gradient-to-br from-purple-500 via-blue-400 to-green-400 opacity-90 hover:opacity-100 border-0 rounded-full shadow-2xl z-50 transition-all duration-300 scale-100 hover:scale-105"
        title="Show performance monitor"
        style={{ boxShadow: '0 4px 24px 0 rgba(80,120,255,0.25)' }}
      >
        <Activity size={18} className="text-white drop-shadow" />
      </button>
    );
  }
  
  return (
  <Card className="fixed bottom-4 right-4 w-80 shadow-2xl z-50 border-0 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-400 to-green-400 opacity-95 text-white backdrop-blur-xl transition-all duration-500">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-white drop-shadow" />
            <CardTitle className="text-base font-bold tracking-wide bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent">Real-Time Performance</CardTitle>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/70 hover:text-white text-lg font-bold px-2 py-1 rounded-full transition-colors"
            style={{ background: 'rgba(0,0,0,0.08)' }}
          >
            ✕
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi size={16} className="text-white" />
            <span className="text-sm font-semibold">Connection</span>
          </div>
          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getQualityColor(quality)} bg-white/20 shadow`}>{connectionState.status === 'connected' ? quality : connectionState.status}</span>
        </div>
        
        {/* Start Time */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Timer size={16} className="text-white" />
              <span className="font-semibold">Start Time</span>
            </div>
            <span className="font-mono">{(metrics.connectionLatency / 1000).toFixed(1)}s</span>
          </div>
          <Progress 
            value={Math.min((metrics.connectionLatency / 1000) * 100, 100)} 
            className="h-1 bg-white/30" />
        </div>
        
        {/* Active Subscriptions */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-white" />
            <span className="font-semibold">Subscriptions</span>
          </div>
          <span>{metrics.subscriptionCount}</span>
        </div>
        
        {/* Update Frequency */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-white" />
            <span className="font-semibold">Updates/sec</span>
          </div>
          <span>{(metrics.updateFrequency / 60).toFixed(1)}</span>
        </div>
        
        {/* Memory Usage */}
        {metrics.memoryUsage > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Memory</span>
              <span className="font-mono">{metrics.memoryUsage}MB</span>
            </div>
            <Progress 
              value={Math.min((metrics.memoryUsage / 100) * 100, 100)} 
              className="h-1 bg-white/30" />
          </div>
        )}
        
        {/* Last Update */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          <span className="text-white/80">Last update: {metrics.lastUpdateTime.toLocaleTimeString()}</span>
        </div>
        
        {/* Reconnection Info */}
        {connectionState.reconnectAttempts > 0 && (
          <div className="text-xs text-yellow-200 text-center font-semibold">
            Reconnection attempts: {connectionState.reconnectAttempts}
          </div>
        )}
      </CardContent>
    </Card>
  );
};