import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
        </div>
        
        <h1 className="font-display text-4xl font-bold mb-2">404</h1>
        <h2 className="font-display text-2xl font-semibold mb-4">Page Not Found</h2>
        
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track!
        </p>

        <div className="flex flex-col gap-3">
          <Button asChild size="lg" data-testid="button-home">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg" data-testid="button-go-back">
            <Link href="/" onClick={() => window.history.back()}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
