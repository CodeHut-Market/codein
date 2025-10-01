"use client";

import React from 'react';
import { Wifi, WifiOff, RotateCcw, AlertCircle } from 'lucide-react';
import { useRealTime } from '../../contexts/RealTimeContext';
import { Button } from './button';

export const ConnectionStatusIndicator: React.FC<{ 
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ 
  className = '', 
  showLabel = false,
  size = 'sm'
}) => {
  const { connectionState, refreshMetrics } = useRealTime();
  
  const getStatusColor = () => {
    switch (connectionState.status) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
        return 'text-yellow-500';
      case 'disconnected':
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  const getStatusIcon = () => {
    const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
    
    switch (connectionState.status) {
      case 'connected':
        return <Wifi size={iconSize} className={getStatusColor()} />;
      case 'connecting':
        return <RotateCcw size={iconSize} className={`${getStatusColor()} animate-spin`} />;
      case 'disconnected':
      case 'error':
        return <WifiOff size={iconSize} className={getStatusColor()} />;
      default:
        return <AlertCircle size={iconSize} className={getStatusColor()} />;
    }
  };
  
  const getStatusText = () => {
    switch (connectionState.status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return connectionState.reconnectAttempts > 0 
          ? `Reconnecting... (${connectionState.reconnectAttempts})`
          : 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };
  
  const getTooltipMessage = () => {
    const baseMessage = getStatusText();
    if (connectionState.lastConnected) {
      const lastConnected = connectionState.lastConnected.toLocaleTimeString();
      return `${baseMessage}\nLast connected: ${lastConnected}`;
    }
    if (connectionState.errorMessage) {
      return `${baseMessage}\n${connectionState.errorMessage}`;
    }
    return baseMessage;
  };
  
  if (!showLabel && connectionState.status === 'connected') {
    return null; // Hide when connected and no label needed
  }
  
  return (
    <div 
      className={`flex items-center gap-2 ${className}`}
      title={getTooltipMessage()}
    >
      {getStatusIcon()}
      
      {showLabel && (
        <span className={`text-${size} font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      )}
      
      {(connectionState.status === 'error' || connectionState.status === 'disconnected') && (
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshMetrics}
          className="h-auto p-1"
          title="Retry connection"
        >
          <RotateCcw size={14} />
        </Button>
      )}
    </div>
  );
};

// Toast notification for connection status changes
export const ConnectionStatusToast: React.FC = () => {
  const { connectionState } = useRealTime();
  const [lastStatus, setLastStatus] = React.useState(connectionState.status);
  
  React.useEffect(() => {
    if (connectionState.status !== lastStatus) {
      // Don't show toast on initial connection
      if (lastStatus !== 'connecting') {
        const message = (() => {
          switch (connectionState.status) {
            case 'connected':
              return 'Real-time updates connected';
            case 'disconnected':
              return 'Real-time updates disconnected';
            case 'error':
              return connectionState.errorMessage || 'Real-time connection error';
            default:
              return null;
          }
        })();
        
        if (message) {
          // You can integrate with your toast system here
          console.log(`Connection status: ${message}`);
        }
      }
      
      setLastStatus(connectionState.status);
    }
  }, [connectionState.status, connectionState.errorMessage, lastStatus]);
  
  return null;
};