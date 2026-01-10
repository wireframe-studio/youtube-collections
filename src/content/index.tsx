import { createRoot, Root } from 'react-dom/client';
import {
	refreshChannelList,
	showScrapeProgress,
	showScrapeSuccess
} from '../channelScraper';
import {
	clearActiveFilters,
	getStorageData,
	onStorageChange
} from '../storage';
import { VideoFilter } from '../videoFilter';
import { App } from './app';

let categoryRoot: Root | null = null;
let videoFilter: VideoFilter | null = null;

async function init() {
	console.log('[YouTube Collections] Extension loaded');

	// Handle page navigation in YouTube's SPA
	let lastUrl = location.href;
	new MutationObserver(() => {
		const currentUrl = location.href;
		if (currentUrl !== lastUrl) {
			lastUrl = currentUrl;
			handlePageChange();
		}
	}).observe(document.body, { subtree: true, childList: true });

	// Initial page load
	handlePageChange();

	// Clear filters on browser startup (session-based persistence)
	window.addEventListener('beforeunload', () => {
		clearActiveFilters();
	});

	// Listen for storage changes to update video filter
	onStorageChange(async (data) => {
		if (videoFilter) {
			videoFilter.updateChannels(data.channels);
			videoFilter.updateFilters(data.activeFilters);
		}
	});
}

async function handlePageChange() {
	const path = location.pathname;

	if (path === '/feed/subscriptions') {
		injectFeedSection();
		await initializeVideoFilter();
	} else if (path === '/feed/channels') {
		await handleChannelsPage();
	} else {
		cleanupCategorySection();
	}
}

function injectFeedSection() {
	// Find the main content area
	const waitForContainer = setInterval(() => {
		const container = document.querySelector(
			'ytd-browse[page-subtype="subscriptions"]'
		);

		if (container) {
			clearInterval(waitForContainer);

			// Check if already injected
			if (document.getElementById('yt-collections-root')) {
				return;
			}

			// Create container for our React app
			const rootElement = document.createElement('div');
			rootElement.id = 'yt-collections-root';

			// Insert before the video grid
			const videoGrid = container.querySelector('#contents');
			if (videoGrid) {
				videoGrid.parentElement?.insertBefore(rootElement, videoGrid);

				// Mount React component
				categoryRoot = createRoot(rootElement);
				categoryRoot.render(<App />);
			}
		}
	}, 100);

	// Timeout after 10 seconds
	setTimeout(() => clearInterval(waitForContainer), 10000);
}

function cleanupCategorySection() {
	if (categoryRoot) {
		categoryRoot.unmount();
		categoryRoot = null;
	}

	const rootElement = document.getElementById('yt-collections-root');
	if (rootElement) {
		rootElement.remove();
	}
}

async function initializeVideoFilter() {
	if (!videoFilter) {
		videoFilter = new VideoFilter();
	}

	const data = await getStorageData();
	videoFilter.updateChannels(data.channels);
	videoFilter.updateFilters(data.activeFilters);
}

async function handleChannelsPage() {
	// Wait a bit for the page to fully load
	setTimeout(async () => {
		const progressIndicator = showScrapeProgress();

		try {
			await refreshChannelList();
			showScrapeSuccess(progressIndicator);
			console.log('[YouTube Collections] Channels refreshed');
		} catch (error) {
			console.error('[YouTube Collections] Error refreshing channels:', error);
			progressIndicator.remove();
		}
	}, 2000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
