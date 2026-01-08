import type { StorageData, Category, Channel } from './types';

const STORAGE_KEY = 'youtube_collections_data';

export async function getStorageData(): Promise<StorageData> {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const defaultData: StorageData = {
        categories: [],
        channels: [],
        activeFilters: [],
      };
      resolve(result[STORAGE_KEY] || defaultData);
    });
  });
}

export async function setStorageData(data: Partial<StorageData>): Promise<void> {
  const currentData = await getStorageData();
  const newData = { ...currentData, ...data };
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: newData }, () => {
      resolve();
    });
  });
}

export async function addCategory(category: Category): Promise<void> {
  const data = await getStorageData();
  data.categories.push(category);
  await setStorageData({ categories: data.categories });
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const data = await getStorageData();
  data.categories = data.categories.filter(c => c.id !== categoryId);

  // Remove category from all channels
  data.channels = data.channels.map(ch => ({
    ...ch,
    categoryIds: ch.categoryIds.filter(id => id !== categoryId)
  }));

  await setStorageData({
    categories: data.categories,
    channels: data.channels
  });
}

export async function updateCategory(category: Category): Promise<void> {
  const data = await getStorageData();
  const index = data.categories.findIndex(c => c.id === category.id);
  if (index !== -1) {
    data.categories[index] = category;
    await setStorageData({ categories: data.categories });
  }
}

export async function updateChannels(channels: Channel[]): Promise<void> {
  await setStorageData({ channels });
}

export async function updateChannelCategories(channelId: string, categoryIds: string[]): Promise<void> {
  const data = await getStorageData();
  const channel = data.channels.find(ch => ch.id === channelId);
  if (channel) {
    channel.categoryIds = categoryIds;
    await setStorageData({ channels: data.channels });
  }
}

export async function setActiveFilters(filterIds: string[]): Promise<void> {
  await setStorageData({ activeFilters: filterIds });
}

export async function clearActiveFilters(): Promise<void> {
  await setStorageData({ activeFilters: [] });
}

// Storage change listener
export function onStorageChange(callback: (data: StorageData) => void): void {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes[STORAGE_KEY]) {
      callback(changes[STORAGE_KEY].newValue);
    }
  });
}
