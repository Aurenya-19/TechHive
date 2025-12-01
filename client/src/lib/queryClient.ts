import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { parseError } from "@/utils/errorHandler";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { message: text };
    }
    const error = new Error(parsed.message || `${res.status}: ${res.statusText}`);
    (error as any).status = res.status;
    (error as any).response = { status: res.status, data: parsed };
    throw error;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error: any) {
    const errorResponse = parseError(error);
    console.error(`[API Error] ${url}:`, errorResponse);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Global error handler middleware
queryClient.setDefaultOptions({
  queries: {
    ...queryClient.getDefaultOptions().queries,
  },
});
