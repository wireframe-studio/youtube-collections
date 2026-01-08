import { getStorageData, updateChannels } from './storage';
import type { Channel } from './types';

export async function scrapeChannels(): Promise<Channel[]> {
	// Wait for the page to fully load
	await waitForElement('ytd-channel-renderer');

	const channelElements = document.querySelectorAll('ytd-channel-renderer');
	const channels: Channel[] = [];

	for (const element of channelElements) {
		try {
			const channelLink =
				element.querySelector<HTMLAnchorElement>('#main-link');
			const channelName = element
				.querySelector<HTMLElement>('#text')
				?.textContent?.trim();
			const thumbnail = element.querySelector<HTMLImageElement>('img#img');

			if (channelLink && channelName && thumbnail) {
				// Extract channel ID from URL (format: /channel/CHANNEL_ID or /@handle)
				const channelUrl = channelLink.href;
				const channelId = extractChannelId(channelUrl);

				if (channelId) {
					channels.push({
						id: channelId,
						name: channelName,
						thumbnailUrl: thumbnail.src,
						categoryIds: []
					});
				} else {
					console.warn(
						'[YouTube Collections] Could not extract channel ID from:',
						channelUrl
					);
				}
			}
		} catch (error) {
			console.error('Error parsing channel:', error);
		}
	}

	return channels;
}

function extractChannelId(url: string): string | null {
	// Handle both /channel/ID and /@handle formats
	// Match: /channel/UC... or /@handle (stop at /, ?, &, #)
	const match = url.match(/\/(channel\/[^/?&#]+|@[^/?&#]+)/);
	return match ? match[1] : null;
}

function waitForElement(selector: string, timeout = 10000): Promise<Element> {
	return new Promise((resolve, reject) => {
		const element = document.querySelector(selector);
		if (element) {
			resolve(element);
			return;
		}

		const observer = new MutationObserver(() => {
			const element = document.querySelector(selector);
			if (element) {
				observer.disconnect();
				resolve(element);
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});

		setTimeout(() => {
			observer.disconnect();
			reject(new Error(`Timeout waiting for ${selector}`));
		}, timeout);
	});
}

export async function refreshChannelList(): Promise<void> {
	const newChannels = await scrapeChannels();
	const existingData = await getStorageData();

	// Merge with existing channels, preserving category assignments
	const channelMap = new Map(existingData.channels.map((ch) => [ch.id, ch]));

	for (const newChannel of newChannels) {
		const existing = channelMap.get(newChannel.id);
		if (existing) {
			// Keep existing category assignments
			newChannel.categoryIds = existing.categoryIds;
		}
		channelMap.set(newChannel.id, newChannel);
	}

	const mergedChannels = Array.from(channelMap.values());
	await updateChannels(mergedChannels);
}

export function showScrapeProgress(): HTMLDivElement {
	const container = document.createElement('div');
	container.className =
		'fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-[10000]';
	container.innerHTML = `
    <view class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></view>
    <span>Scanning channels...</span>
  `;
	document.body.appendChild(container);
	return container;
}

export function showScrapeSuccess(container: HTMLDivElement): void {
	container.innerHTML = `
    <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span>Channels updated!</span>
  `;
	setTimeout(() => {
		container.style.opacity = '0';
		container.style.transition = 'opacity 0.5s';
		setTimeout(() => container.remove(), 500);
	}, 2000);
}
