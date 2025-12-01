import React, { ReactNode } from "react";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorCount: number;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorCount: 0 };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Error caught by boundary:", error);
    console.error("Error info:", info);
    
    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // Example: Send to Sentry, LogRocket, etc.
    }

    this.setState(prev => ({ errorCount: prev.errorCount + 1 }));
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-4">
          <Card className="w-full max-w-lg shadow-lg">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <CardTitle className="text-xl">Something Went Wrong</CardTitle>
              </div>
              <CardDescription>
                We encountered an unexpected error. Don't worry, our team has been notified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-xs text-muted-foreground font-mono break-words">
                  {this.state.error.message}
                </p>
              </div>

              {this.state.errorCount > 2 && (
                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/30 p-3 border border-yellow-200 dark:border-yellow-900">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Multiple errors detected. Refreshing the page might help.
                  </p>
                </div>
              )}

              <div className="flex gap-2 flex-col sm:flex-row">
                <Button 
                  onClick={this.handleReset}
                  className="flex-1"
                  data-testid="button-error-retry"
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex-1"
                  data-testid="button-error-home"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.reload()}
                className="w-full text-muted-foreground hover:text-foreground"
                data-testid="button-error-refresh"
              >
                Or refresh the entire page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
