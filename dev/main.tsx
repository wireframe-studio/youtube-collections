import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../src/content/app';
import type { StorageData } from '../src/types';

// Mock Chrome Storage API for development
const STORAGE_KEY = 'youtube_collections_data';
const storageListeners: Array<(changes: any, areaName: string) => void> = [];

// Initialize with some mock data
const mockData: StorageData = {
	categories: [
		{ id: '1', name: 'Tech', icon: 'Circle', color: '#64b5f6' },
		{ id: '2', name: 'Music', icon: 'Music', color: '#f06292' },
		{ id: '3', name: 'Gaming', icon: 'Gamepad2', color: '#81c784' }
	],
	channels: [
		{
			id: 'ch1',
			name: 'Fireship',
			categoryIds: ['1'],
			thumbnailUrl: 'https://via.placeholder.com/40/64b5f6/ffffff?text=FS'
		},
		{
			id: 'ch2',
			name: 'ThePrimeagen',
			categoryIds: ['1'],
			thumbnailUrl: 'https://via.placeholder.com/40/64b5f6/ffffff?text=TP'
		},
		{
			id: 'ch3',
			name: 'Lofi Girl',
			categoryIds: ['2'],
			thumbnailUrl: 'https://via.placeholder.com/40/f06292/ffffff?text=LG'
		}
	],
	activeFilters: []
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
						newValue: value
					};
					storageListeners.forEach((listener) => listener(changes, 'local'));
				}
				callback?.();
			}
		},
		onChanged: {
			addListener: (callback: (changes: any, areaName: string) => void) => {
				storageListeners.push(callback);
			}
		}
	}
};

// Dev wrapper that opens modal by default
function DevApp() {
	const [isModalOpen, setIsModalOpen] = useState(true);

	return <App />;
}

// Render the app
const root = document.getElementById('root');
if (root) {
	createRoot(root).render(<DevApp />);
}
