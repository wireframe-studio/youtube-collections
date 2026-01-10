import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addCategory,
  deleteCategory,
  updateCategory,
  updateChannelCategories,
  updateChannels,
  setActiveFilters,
  clearActiveFilters,
  setStorageData,
} from '../../storage';
import type { Category, Channel } from '../../types';
import { queryKeys } from './queries';

// Mutation: Create category
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: Category) => addCategory(category),
    onSuccess: () => {
      // Invalidate categories query to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() });
      queryClient.invalidateQueries({ queryKey: queryKeys.storage });
    },
  });
}

// Mutation: Delete category
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () => {
      // Invalidate both categories and channels (channels may have categoryIds removed)
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() });
      queryClient.invalidateQueries({ queryKey: queryKeys.channels() });
      queryClient.invalidateQueries({ queryKey: queryKeys.storage });
    },
  });
}

// Mutation: Update category
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: Category) => updateCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() });
      queryClient.invalidateQueries({ queryKey: queryKeys.storage });
    },
  });
}

// Mutation: Update channel categories
export function useUpdateChannelCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, categoryIds }: { channelId: string; categoryIds: string[] }) =>
      updateChannelCategories(channelId, categoryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels() });
      queryClient.invalidateQueries({ queryKey: queryKeys.storage });
    },
  });
}

// Mutation: Update channels
export function useUpdateChannels() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (channels: Channel[]) => updateChannels(channels),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels() });
      queryClient.invalidateQueries({ queryKey: queryKeys.storage });
    },
  });
}

// Mutation: Set active filters
export function useSetActiveFilters() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filterIds: string[]) => setActiveFilters(filterIds),
    onSuccess: (_, filterIds) => {
      // Optimistically update the cache
      queryClient.setQueryData(queryKeys.storage, (old: any) => {
        if (!old) return old;
        return { ...old, activeFilters: filterIds };
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.activeFilters() });
    },
  });
}

// Mutation: Clear active filters
export function useClearActiveFilters() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearActiveFilters(),
    onSuccess: () => {
      // Optimistically update the cache
      queryClient.setQueryData(queryKeys.storage, (old: any) => {
        if (!old) return old;
        return { ...old, activeFilters: [] };
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.activeFilters() });
    },
  });
}

// Mutation: Import data (used by serialization)
export function useImportData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { categories: Category[]; channels: Channel[] }) =>
      setStorageData(data),
    onSuccess: () => {
      // Invalidate all storage queries
      queryClient.invalidateQueries({ queryKey: queryKeys.storage });
    },
  });
}
