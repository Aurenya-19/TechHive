import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseError, logError, type ErrorResponse } from '@/utils/errorHandler';

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback((error: any, context?: string): ErrorResponse => {
    const errorResponse = parseError(error);
    logError(error, context);

    // Show user-friendly toast notification
    toast({
      title: 'Error',
      description: errorResponse.message,
      variant: errorResponse.type === 'auth' ? 'destructive' : 'default',
      duration: errorResponse.type === 'network' ? 5000 : 4000,
    });

    return errorResponse;
  }, [toast]);

  const handleErrorSilently = useCallback((error: any, context?: string): ErrorResponse => {
    const errorResponse = parseError(error);
    logError(error, context);
    return errorResponse;
  }, []);

  return { handleError, handleErrorSilently };
}
