import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import { FeedSection } from '../src/modules/feed/components/feed-section';
import { SettingsModal } from '../src/modules/settings/components/settings-modal';
import type { StorageData } from '../src/types';

// Mock Chrome Storage API for development
const STORAGE_KEY = 'youtube_collections_data';
const storageListeners: Array<(changes: any, areaName: string) => void> = [];

// Initialize with some mock data
const mockData: StorageData = {
  categories: [
    { id: '1', name: 'Tech', icon: '💻', channelCount: 5 },
    { id: '2', name: 'Music', icon: '🎵', channelCount: 3 },
    { id: '3', name: 'Gaming', icon: '🎮', channelCount: 8 },
  ],
  channels: [
    { id: 'ch1', name: 'Fireship', handle: '@fireship', categoryIds: ['1'], thumbnailUrl: '' },
    { id: 'ch2', name: 'ThePrimeagen', handle: '@theprimeagen', categoryIds: ['1'], thumbnailUrl: '' },
    { id: 'ch3', name: 'Lofi Girl', handle: '@lofigirl', categoryIds: ['2'], thumbnailUrl: '' },
  ],
  activeFilters: [],
};

// Initialize localStorage with mock data if empty
if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
}

// Mock chrome.storage API
(window as any).chrome = {
  storage: {
    local: {
      get: (keys: string[], callback: (result: any) => void) => {
        const result: any = {};
        for (const key of keys) {
          const value = localStorage.getItem(key);
          if (value) {
            result[key] = JSON.parse(value);
          }
        }
        callback(result);
      },
      set: (items: Record<string, any>, callback?: () => void) => {
        for (const [key, value] of Object.entries(items)) {
          const oldValue = localStorage.getItem(key);
          localStorage.setItem(key, JSON.stringify(value));

          // Trigger change listeners
          const changes: any = {};
          changes[key] = {
            oldValue: oldValue ? JSON.parse(oldValue) : undefined,
            newValue: value,
          };
          storageListeners.forEach(listener => listener(changes, 'local'));
        }
        callback?.();
      },
    },
    onChanged: {
      addListener: (callback: (changes: any, areaName: string) => void) => {
        storageListeners.push(callback);
      },
    },
  },
};

// Dev wrapper that opens modal by default
function DevApp() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <>
      <FeedSection />
      {isModalOpen && <SettingsModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

// Render the app
const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<DevApp />);
}
