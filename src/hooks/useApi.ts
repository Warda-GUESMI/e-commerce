import { useState, useCallback } from 'react';
import { config } from '../config';

interface UseApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  data?: any;
}

export const useApi = <T,>(url: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const request = useCallback(
    async (options: UseApiOptions = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${config.api.baseUrl}${url}`, {
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          body: options.data ? JSON.stringify(options.data) : undefined,
          signal: AbortSignal.timeout(config.api.timeout),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Une erreur est survenue';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  return { data, loading, error, request };
};
