import { useQuery } from '@tanstack/react-query';
import { getStorageData } from '../../storage';
import type { Category, StorageData } from '../../types';

// Query keys
export const queryKeys = {
  storage: ['storage'] as const,
  categories: () => [...queryKeys.storage, 'categories'] as const,
  channels: () => [...queryKeys.storage, 'channels'] as const,
  activeFilters: () => [...queryKeys.storage, 'activeFilters'] as const,
};

// Helper to get sorted categories
function sortCategories(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => a.name.localeCompare(b.name));
}

// Fetch storage data
async function fetchStorageData(): Promise<StorageData> {
  return getStorageData();
}

// Hook to fetch all storage data
export function useStorageData() {
  return useQuery({
    queryKey: queryKeys.storage,
    queryFn: fetchStorageData,
    refetchOnWindowFocus: false,
  });
}

// Hook to fetch categories (sorted)
export function useCategories() {
  const { data, ...rest } = useStorageData();
  
  return {
    ...rest,
    data: data ? sortCategories(data.categories) : undefined,
    categories: data ? sortCategories(data.categories) : [],
  };
}

// Hook to fetch channels
export function useChannels() {
  const { data, ...rest } = useStorageData();
  
  return {
    ...rest,
    data: data?.channels,
    channels: data?.channels ?? [],
  };
}

// Hook to fetch active filters
export function useActiveFilters() {
  const { data, ...rest } = useStorageData();
  
  return {
    ...rest,
    data: data?.activeFilters,
    activeFilters: data?.activeFilters ?? [],
  };
}
