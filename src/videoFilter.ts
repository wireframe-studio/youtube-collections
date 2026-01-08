import type { Channel } from './types';

export class VideoFilter {
  private channels: Channel[] = [];
  private activeFilters: string[] = [];
  private observer: MutationObserver | null = null;

  constructor() {
    this.setupObserver();
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
    this.observer = new MutationObserver(() => {
      this.applyFilter();
    });

    const observeTarget = () => {
      const feedContainer = document.querySelector('ytd-browse[page-subtype="subscriptions"]');
      if (feedContainer) {
        this.observer?.observe(feedContainer, {
          childList: true,
          subtree: true,
        });
      }
    };

    // Initial observation
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeTarget);
    } else {
      observeTarget();
    }
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
        allowedChannelIds.add(channel.id);
      }
    });

    // Filter videos
    const videoElements = document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer');

    videoElements.forEach(videoElement => {
      const channelLink = videoElement.querySelector<HTMLAnchorElement>('a.yt-simple-endpoint[href*="/@"], a.yt-simple-endpoint[href*="/channel/"]');

      if (!channelLink) {
        // If we can't determine the channel, hide it when filtering
        (videoElement as HTMLElement).style.display = 'none';
        return;
      }

      const channelId = this.extractChannelId(channelLink.href);
      const shouldShow = allowedChannelIds.has(channelId);

      (videoElement as HTMLElement).style.display = shouldShow ? '' : 'none';
    });
  }

  private showAllVideos() {
    const videoElements = document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer');
    videoElements.forEach(videoElement => {
      (videoElement as HTMLElement).style.display = '';
    });
  }

  private extractChannelId(url: string): string {
    const match = url.match(/\/(channel\/[^/?]+|@[^/?]+)/);
    return match ? match[1] : url;
  }

  destroy() {
    this.observer?.disconnect();
  }
}
