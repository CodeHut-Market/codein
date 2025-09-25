import { useState, useEffect, useRef } from "react";
import {
  Bell,
  X,
  Check,
  Info,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Notification } from "@shared/api";

interface NotificationCenterProps {
  userId?: string;
  className?: string;
}

export default function NotificationCenter({
  userId,
  className,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Demo notifications for showcase
  const demoNotifications: Notification[] = [
    {
      id: "1",
      userId: userId || "demo",
      title: "New Purchase",
      message: "Someone purchased your React Login Form snippet!",
      type: "success",
      read: false,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      actionUrl: "/dashboard",
    },
    {
      id: "2",
      userId: userId || "demo",
      title: "Price Update",
      message:
        'You successfully updated the price for "Vue Dashboard Component"',
      type: "info",
      read: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      userId: userId || "demo",
      title: "Low Quality Warning",
      message:
        'Your snippet "API Middleware" received quality feedback. Consider updating.',
      type: "warning",
      read: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      actionUrl: "/snippet/snippet-3",
    },
    {
      id: "4",
      userId: userId || "demo",
      title: "Welcome to CodeHut!",
      message: "Complete your profile to start selling code snippets.",
      type: "info",
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      actionUrl: "/profile/edit",
    },
  ];

  useEffect(() => {
    // In a real app, fetch notifications from API
    setNotifications(demoNotifications);
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );

    // In a real app, call API to mark as read
    // await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' });
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    // In a real app, call API to mark all as read
    // await fetch('/api/notifications/mark-all-read', { method: 'POST' });
  };

  const deleteNotification = async (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

    // In a real app, call API to delete notification
    // await fetch(`/api/notifications/${notificationId}`, { method: 'DELETE' });
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Check className="w-4 h-4 text-green-600" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-l-green-500";
      case "info":
        return "border-l-blue-500";
      case "warning":
        return "border-l-yellow-500";
      case "error":
        return "border-l-red-500";
      default:
        return "border-l-gray-500";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 text-xs"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 z-50"
          >
            <Card className="border shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs text-green-600 hover:text-green-700"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
                {unreadCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {unreadCount} unread notification
                    {unreadCount > 1 ? "s" : ""}
                  </p>
                )}
              </CardHeader>

              <CardContent className="p-0">
                <ScrollArea className="h-80">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-0">
                      {notifications.map((notification, index) => (
                        <div key={notification.id}>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                              "p-4 border-l-4 hover:bg-muted/50 transition-colors cursor-pointer group",
                              getTypeColor(notification.type),
                              !notification.read && "bg-muted/30",
                            )}
                            onClick={() => {
                              if (!notification.read)
                                markAsRead(notification.id);
                              if (notification.actionUrl) {
                                window.location.href = notification.actionUrl;
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                {getIcon(notification.type)}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <h4
                                      className={cn(
                                        "text-sm font-medium",
                                        !notification.read && "font-semibold",
                                      )}
                                    >
                                      {notification.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {notification.message}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-xs text-muted-foreground">
                                        {formatTime(notification.createdAt)}
                                      </span>
                                      {notification.actionUrl && (
                                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification.id);
                                      }}
                                      className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                          {index < notifications.length - 1 && <Separator />}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {notifications.length > 0 && (
                  <>
                    <Separator />
                    <div className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-center text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setIsOpen(false);
                          window.location.href = "/notifications";
                        }}
                      >
                        View all notifications
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
