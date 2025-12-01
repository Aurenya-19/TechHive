import { AlertCircle, AlertTriangle, Info, Wifi } from "lucide-react";

interface ErrorToastProps {
  message: string;
  type: "network" | "auth" | "validation" | "server" | "unknown";
}

export function ErrorToast({ message, type }: ErrorToastProps) {
  const config = {
    network: {
      icon: Wifi,
      title: "Connection Error",
      color: "text-yellow-600 dark:text-yellow-500",
    },
    auth: {
      icon: AlertTriangle,
      title: "Authentication Error",
      color: "text-red-600 dark:text-red-500",
    },
    validation: {
      icon: AlertCircle,
      title: "Invalid Input",
      color: "text-orange-600 dark:text-orange-500",
    },
    server: {
      icon: AlertTriangle,
      title: "Server Error",
      color: "text-red-600 dark:text-red-500",
    },
    unknown: {
      icon: AlertCircle,
      title: "Error",
      color: "text-gray-600 dark:text-gray-400",
    },
  };

  const { icon: Icon, title, color } = config[type];

  return (
    <div className={`flex items-start gap-3 ${color}`}>
      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs mt-1 opacity-90">{message}</p>
      </div>
    </div>
  );
}
