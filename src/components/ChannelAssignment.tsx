import React, { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Category, Channel } from '../types';
import { updateChannelCategories } from '../storage';

interface ChannelAssignmentProps {
  categories: Category[];
  channels: Channel[];
  onUpdate: () => void;
}

type FilterType = 'all' | 'unassigned' | string;

export function ChannelAssignment({ categories, channels, onUpdate }: ChannelAssignmentProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const sortedChannels = useMemo(() => {
    return [...channels].sort((a, b) => a.name.localeCompare(b.name));
  }, [channels]);

  const filteredChannels = useMemo(() => {
    if (filter === 'all') return sortedChannels;
    if (filter === 'unassigned') {
      return sortedChannels.filter(ch => ch.categoryIds.length === 0);
    }
    return sortedChannels.filter(ch => ch.categoryIds.includes(filter));
  }, [sortedChannels, filter]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, Channel[]> = {};

    categories.forEach(cat => {
      groups[cat.id] = channels.filter(ch => ch.categoryIds.includes(cat.id));
    });

    groups['unassigned'] = channels.filter(ch => ch.categoryIds.length === 0);

    return groups;
  }, [categories, channels]);

  async function handleCategoryChange(channelId: string, categoryId: string, isChecked: boolean) {
    const channel = channels.find(ch => ch.id === channelId);
    if (!channel) return;

    const newCategoryIds = isChecked
      ? [...channel.categoryIds, categoryId]
      : channel.categoryIds.filter(id => id !== categoryId);

    await updateChannelCategories(channelId, newCategoryIds);
    onUpdate();
  }

  function toggleCategory(categoryId: string) {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }

  if (channels.length === 0) {
    return (
      <div className="text-center py-12 text-white/40">
        <p className="mb-2">No channels detected yet.</p>
        <p className="text-sm">Visit YouTube's <a href="https://www.youtube.com/feed/channels" target="_blank" className="text-white/60 underline">Subscriptions page</a> to scan your channels.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm text-white/70">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="all">All channels</option>
          <option value="unassigned">Unassigned</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <span className="text-sm text-white/40 ml-auto">
          {filteredChannels.length} channel{filteredChannels.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-1 max-h-[500px] overflow-y-auto">
        {filteredChannels.map(channel => (
          <div
            key={channel.id}
            className="bg-white/5 rounded-lg p-3 flex items-center gap-3 border border-white/10"
          >
            <img
              src={channel.thumbnailUrl}
              alt={channel.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{channel.name}</div>
            </div>

            <div className="relative">
              <select
                multiple
                value={channel.categoryIds}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
                  const currentIds = new Set(channel.categoryIds);
                  const newIds = new Set(selectedOptions);

                  // Find added and removed
                  selectedOptions.forEach(id => {
                    if (!currentIds.has(id)) {
                      handleCategoryChange(channel.id, id, true);
                    }
                  });

                  channel.categoryIds.forEach(id => {
                    if (!newIds.has(id)) {
                      handleCategoryChange(channel.id, id, false);
                    }
                  });
                }}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 min-w-[200px]"
                size={Math.min(categories.length + 1, 5)}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {channel.categoryIds.includes(cat.id) ? '✓ ' : ''}{cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-8 text-white/40">
          Create categories first to assign channels.
        </div>
      )}
    </div>
  );
}
