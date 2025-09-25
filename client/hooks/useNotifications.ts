import { AlertCircle, AlertTriangle, Check, Info } from "lucide-react";
import { createElement, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export interface ToastNotification {
  id: string;
  title: string;
  description?: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

export interface NotificationOptions {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const showNotification = useCallback(
    (type: ToastNotification["type"], options: NotificationOptions) => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const notification: ToastNotification = {
        id,
        type,
        duration: options.duration ?? (type === "error" ? 8000 : 5000),
        ...options,
      };

      setNotifications((prev) => [...prev, notification]);

      // Produce a ReactNode icon (avoid JSX since this file is .ts not .tsx)
      const getIcon = (): React.ReactNode => {
        const baseClass = "w-5 h-5";
        let IconComp;
        switch (type) {
          case "success":
            IconComp = Check; break;
          case "error":
            IconComp = AlertCircle; break;
          case "warning":
            IconComp = AlertTriangle; break;
          case "info":
          default:
            IconComp = Info; break;
        }
        const colorClass =
          type === "success" ? " text-green-600" :
          type === "error" ? " text-red-600" :
          type === "warning" ? " text-amber-500" :
          " text-blue-600";
        return createElement(IconComp, { className: baseClass + colorClass });
      };

      const getToastType = () => {
        switch (type) {
          case "success":
            return "success";
          case "error":
            return "error";
          case "warning":
            return "warning";
          case "info":
          default:
            return "info";
        }
      };

      // Use sonner for the actual toast display
      toast[getToastType()](options.title, {
        description: options.description,
        duration: notification.duration,
  icon: getIcon(),
        action: options.action
          ? {
              label: options.action.label,
              onClick: options.action.onClick,
            }
          : undefined,
        onDismiss: () => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        },
        onAutoClose: () => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        },
      });

      return id;
    },
    [],
  );

  const showSuccess = useCallback(
    (options: NotificationOptions) => {
      return showNotification("success", options);
    },
    [showNotification],
  );

  const showError = useCallback(
    (options: NotificationOptions) => {
      return showNotification("error", options);
    },
    [showNotification],
  );

  const showWarning = useCallback(
    (options: NotificationOptions) => {
      return showNotification("warning", options);
    },
    [showNotification],
  );

  const showInfo = useCallback(
    (options: NotificationOptions) => {
      return showNotification("info", options);
    },
    [showNotification],
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.dismiss(id);
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications([]);
    toast.dismiss();
  }, []);

  // Convenience methods for common notifications
  const showPurchaseSuccess = useCallback(
    (snippetTitle: string) => {
      return showSuccess({
        title: "Purchase Successful!",
        description: `You've successfully purchased "${snippetTitle}". Check your downloads.`,
        action: {
          label: "View Downloads",
          onClick: () => (window.location.href = "/dashboard"),
        },
      });
    },
    [showSuccess],
  );

  const showUploadSuccess = useCallback(
    (snippetTitle: string) => {
      return showSuccess({
        title: "Snippet Uploaded!",
        description: `"${snippetTitle}" has been uploaded successfully and is now available in the marketplace.`,
        action: {
          label: "View Snippet",
          onClick: () => (window.location.href = "/dashboard"),
        },
      });
    },
    [showSuccess],
  );

  const showLoginSuccess = useCallback(
    (username: string) => {
      return showSuccess({
        title: "Welcome back!",
        description: `Successfully logged in as ${username}.`,
        duration: 3000,
      });
    },
    [showSuccess],
  );

  const showSignupSuccess = useCallback(
    (username: string) => {
      return showSuccess({
        title: "Account Created!",
        description: `Welcome to CodeHut, ${username}! Start by uploading your first snippet.`,
        action: {
          label: "Upload Snippet",
          onClick: () => (window.location.href = "/upload"),
        },
      });
    },
    [showSuccess],
  );

  const showNetworkError = useCallback(() => {
    return showError({
      title: "Network Error",
      description:
        "Unable to connect to the server. Please check your internet connection and try again.",
      action: {
        label: "Retry",
        onClick: () => window.location.reload(),
      },
      persistent: true,
    });
  }, [showError]);

  const showValidationError = useCallback(
    (message: string) => {
      return showError({
        title: "Validation Error",
        description: message,
        duration: 6000,
      });
    },
    [showError],
  );

  const showMaintenanceWarning = useCallback(() => {
    return showWarning({
      title: "Scheduled Maintenance",
      description:
        "The platform will undergo maintenance tonight from 2:00 AM to 4:00 AM UTC.",
      persistent: true,
      action: {
        label: "Learn More",
        onClick: () => window.open("/maintenance-info", "_blank"),
      },
    });
  }, [showWarning]);

  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissNotification,
    dismissAll,
    // Convenience methods
    showPurchaseSuccess,
    showUploadSuccess,
    showLoginSuccess,
    showSignupSuccess,
    showNetworkError,
    showValidationError,
    showMaintenanceWarning,
  };
}

// Global notification functions for use throughout the app
let globalNotifications: ReturnType<typeof useNotifications> | null = null;

export function setGlobalNotifications(
  notifications: ReturnType<typeof useNotifications>,
) {
  globalNotifications = notifications;
}

export function notifySuccess(options: NotificationOptions) {
  if (globalNotifications) {
    return globalNotifications.showSuccess(options);
  }
}

export function notifyError(options: NotificationOptions) {
  if (globalNotifications) {
    return globalNotifications.showError(options);
  }
}

export function notifyWarning(options: NotificationOptions) {
  if (globalNotifications) {
    return globalNotifications.showWarning(options);
  }
}

export function notifyInfo(options: NotificationOptions) {
  if (globalNotifications) {
    return globalNotifications.showInfo(options);
  }
}

// Auto-dismiss notifications on route changes
export function useDismissOnRouteChange() {
  useEffect(() => {
    const handleRouteChange = () => {
      if (globalNotifications) {
        // Only dismiss non-persistent notifications
        globalNotifications.notifications
          .filter((n) => !n.persistent)
          .forEach((n) => globalNotifications?.dismissNotification(n.id));
      }
    };

    // Listen for popstate events (back/forward button)
    window.addEventListener("popstate", handleRouteChange);

    // Listen for pushstate/replacestate (programmatic navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleRouteChange();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleRouteChange();
    };

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);
}
