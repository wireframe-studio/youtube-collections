import type { Channel } from './types';

export class VideoFilter {
  private channels: Channel[] = [];
  private activeFilters: string[] = [];
  private observer: MutationObserver | null = null;
  private filterTimeout: number | null = null;
  private periodicCheckInterval: number | null = null;

  constructor() {
    this.setupObserver();
    this.setupPeriodicCheck();
  }

  updateChannels(channels: Channel[]) {
    this.channels = channels;
    this.applyFilter();
  }

  updateFilters(filterIds: string[]) {
    this.activeFilters = filterIds;
    this.applyFilter();
  }

  private setupObserver() {
    // Watch for new videos being added to the feed
    // Use debouncing to avoid excessive filter applications
    this.observer = new MutationObserver((mutations) => {
      // Check if any mutations actually added video elements
      const hasVideoElements = mutations.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return false;
          const element = node as Element;
          return element.matches?.('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, ytd-playlist-video-renderer') ||
                 element.querySelector?.('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, ytd-playlist-video-renderer');
        });
      });

      if (hasVideoElements) {
        // Clear any pending timeout
        if (this.filterTimeout !== null) {
          clearTimeout(this.filterTimeout);
        }

        // Debounce the filter application to allow YouTube to fully render new videos
        // Use requestAnimationFrame for better timing with DOM updates
        this.filterTimeout = window.setTimeout(() => {
          requestAnimationFrame(() => {
            this.applyFilter();
            this.filterTimeout = null;
          });
        }, 100);
      }
    });

    const observeTarget = () => {
      const feedContainer = document.querySelector('ytd-browse[page-subtype="subscriptions"]');
      if (feedContainer) {
        this.observer?.observe(feedContainer, {
          childList: true,
          subtree: true,
        });
        console.log('[YouTube Collections] MutationObserver set up for video filtering');
      } else {
        // Retry if container not found yet
        setTimeout(observeTarget, 500);
      }
    };

    // Initial observation
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeTarget);
    } else {
      observeTarget();
    }
  }

  private setupPeriodicCheck() {
    // Fallback: periodically check for new videos that might have been missed
    // This ensures videos loaded via infinite scroll are always filtered
    this.periodicCheckInterval = window.setInterval(() => {
      // Only run periodic check if filters are active
      if (this.activeFilters.length > 0) {
        this.applyFilter();
      }
    }, 2000); // Check every 2 seconds
  }

  private applyFilter() {
    // If no filters are active, show all videos
    if (this.activeFilters.length === 0) {
      this.showAllVideos();
      return;
    }

    // Get channels that match any of the active filters (OR logic)
    const allowedChannelIds = new Set<string>();
    
    this.channels.forEach(channel => {
      if (channel.categoryIds.some(catId => this.activeFilters.includes(catId))) {
        const normalized = this.normalizeChannelId(channel.id);
        allowedChannelIds.add(normalized);
      }
    });

    if (allowedChannelIds.size === 0) {
      // No channels match the filters, hide all videos
      const videoElements = document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, ytd-playlist-video-renderer');
      videoElements.forEach(videoElement => {
        (videoElement as HTMLElement).style.display = 'none';
      });
      return;
    }

    // Filter videos - try multiple selectors for different YouTube layouts
    const videoElements = document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, ytd-playlist-video-renderer');
    let matchedCount = 0;
    let unmatchedCount = 0;
    let noChannelIdCount = 0;

    videoElements.forEach(videoElement => {
      const channelId = this.findChannelIdFromVideo(videoElement);

      if (!channelId) {
        // If we can't determine the channel, hide it when filtering
        (videoElement as HTMLElement).style.display = 'none';
        noChannelIdCount++;
        unmatchedCount++;
        return;
      }

      const normalizedChannelId = this.normalizeChannelId(channelId);
      const shouldShow = allowedChannelIds.has(normalizedChannelId);

      if (shouldShow) {
        matchedCount++;
      } else {
        unmatchedCount++;
      }

      (videoElement as HTMLElement).style.display = shouldShow ? '' : 'none';
    });

    // Debug logging (only log when there are significant changes or issues)
    if (noChannelIdCount > 0 || (videoElements.length > 0 && matchedCount === 0 && unmatchedCount > 0)) {
      console.log('[YouTube Collections] Filter applied:', {
        activeFilters: this.activeFilters.length,
        allowedChannels: allowedChannelIds.size,
        totalVideos: videoElements.length,
        videosMatched: matchedCount,
        videosHidden: unmatchedCount,
        videosWithoutChannelId: noChannelIdCount,
      });
    }
  }

  private showAllVideos() {
    const videoElements = document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, ytd-playlist-video-renderer');
    videoElements.forEach(videoElement => {
      (videoElement as HTMLElement).style.display = '';
    });
  }

  private findChannelIdFromVideo(videoElement: Element): string | null {
    // Try multiple strategies to find the channel link
    // Strategy 1: Look for channel name element with link (most common)
    const channelNameElement = videoElement.querySelector('ytd-channel-name a, #channel-name a, ytd-video-meta-block #channel-name a, ytd-video-meta-block a[href*="/channel/"], ytd-video-meta-block a[href*="/@"]');
    if (channelNameElement) {
      const href = (channelNameElement as HTMLAnchorElement).href;
      if (href) {
        const channelId = this.extractChannelId(href);
        if (channelId) return channelId;
      }
    }

    // Strategy 2: Look for channel link in metadata block
    const metadataArea = videoElement.querySelector('ytd-video-meta-block, #metadata, #meta, ytd-grid-video-renderer #metadata-line, #metadata-line');
    if (metadataArea) {
      // Look for any anchor that points to a channel
      const allLinks = metadataArea.querySelectorAll<HTMLAnchorElement>('a');
      for (const link of allLinks) {
        const href = link.href;
        if (href && (href.includes('/channel/') || href.includes('/@'))) {
          // Make sure it's not a video link
          if (!href.includes('/watch?v=') && !href.includes('/shorts/') && !href.includes('/playlist')) {
            const channelId = this.extractChannelId(href);
            if (channelId) return channelId;
          }
        }
      }
    }

    // Strategy 3: Look for channel link in channel name area (alternative structure)
    const channelNameArea = videoElement.querySelector('#channel-name, ytd-channel-name, [id*="channel"], [class*="channel"]');
    if (channelNameArea) {
      const channelLink = channelNameArea.querySelector<HTMLAnchorElement>('a[href*="/channel/"], a[href*="/@"]');
      if (channelLink) {
        const href = channelLink.href;
        if (href && !href.includes('/watch?v=') && !href.includes('/shorts/')) {
          const channelId = this.extractChannelId(href);
          if (channelId) return channelId;
        }
      }
    }

    // Strategy 4: Look for channel link in the entire video element (fallback)
    const allLinks = videoElement.querySelectorAll<HTMLAnchorElement>('a');
    for (const link of allLinks) {
      const href = link.href;
      if (href && (href.includes('/channel/') || href.includes('/@'))) {
        // Make sure it's not the video link itself
        if (!href.includes('/watch?v=') && !href.includes('/shorts/') && !href.includes('/playlist')) {
          const channelId = this.extractChannelId(href);
          if (channelId) return channelId;
        }
      }
    }

    return null;
  }

  private extractChannelId(url: string): string | null {
    // Handle both /channel/ID and /@handle formats
    // Match: /channel/UC... or /@handle
    const match = url.match(/\/(channel\/[^/?&#]+|@[^/?&#]+)/);
    return match ? match[1] : null;
  }

  private normalizeChannelId(channelId: string): string {
    // Normalize channel IDs to ensure consistent matching
    // Remove leading/trailing slashes and normalize format
    let normalized = channelId.trim();
    
    // If it's already in the format we want, return it
    if (normalized.startsWith('channel/') || normalized.startsWith('@')) {
      return normalized;
    }
    
    // If it's a full URL, extract the ID
    if (normalized.includes('/channel/') || normalized.includes('/@')) {
      const extracted = this.extractChannelId(normalized);
      return extracted || normalized;
    }
    
    // If it's just an ID without prefix, assume it's a channel ID
    if (normalized && !normalized.includes('/')) {
      return `channel/${normalized}`;
    }
    
    return normalized;
  }

  destroy() {
    if (this.filterTimeout !== null) {
      clearTimeout(this.filterTimeout);
      this.filterTimeout = null;
    }
    if (this.periodicCheckInterval !== null) {
      clearInterval(this.periodicCheckInterval);
      this.periodicCheckInterval = null;
    }
    this.observer?.disconnect();
  }
}
