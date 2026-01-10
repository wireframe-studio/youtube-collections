import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { onStorageChange } from '../../storage';
import { queryClient } from './client';
import { queryKeys } from './queries';

// Set up storage listener once globally
let storageListenerSetup = false;

function setupStorageListener() {
  if (storageListenerSetup) return;
  storageListenerSetup = true;

  onStorageChange((data) => {
    // Invalidate queries when storage changes externally (e.g., from another tab)
    queryClient.invalidateQueries({ queryKey: queryKeys.storage });
  });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    setupStorageListener();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
