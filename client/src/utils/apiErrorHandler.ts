// API-level error handling middleware

import { useQueryClient } from '@tanstack/react-query';
import { parseError } from './errorHandler';

export function setupGlobalErrorHandling() {
  // Handle fetch errors globally
  const originalFetch = window.fetch;
  
  window.fetch = async function(...args) {
    try {
      const response = await originalFetch.apply(this, args);
      
      if (!response.ok && response.status === 401) {
        // Auto-logout on 401
        console.warn('Unauthorized - redirecting to login');
        window.location.href = '/landing';
      }
      
      return response;
    } catch (error) {
      const parsed = parseError(error);
      console.error('Fetch error:', parsed);
      throw error;
    }
  };
}

export function createErrorInterceptor(queryClient: any) {
  // Global mutation error handler
  queryClient.setMutationDefaults({
    onError: (error: any) => {
      const parsed = parseError(error);
      console.error('Mutation error:', parsed);
    }
  });
}
