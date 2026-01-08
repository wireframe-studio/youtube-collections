import { useMemo, useState } from 'react';
import { updateChannelCategories } from '../storage';
import type { Category, Channel } from '../types';

interface ChannelAssignmentProps {
	categories: Category[];
	channels: Channel[];
	onUpdate: () => void;
}

type FilterType = 'all' | 'unassigned' | string;

export function ChannelAssignment({
	categories,
	channels,
	onUpdate
}: ChannelAssignmentProps) {
	const [filter, setFilter] = useState<FilterType>('all');
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
		new Set()
	);

	const sortedChannels = useMemo(() => {
		return [...channels].sort((a, b) => a.name.localeCompare(b.name));
	}, [channels]);

	const filteredChannels = useMemo(() => {
		if (filter === 'all') return sortedChannels;
		if (filter === 'unassigned') {
			return sortedChannels.filter((ch) => ch.categoryIds.length === 0);
		}
		return sortedChannels.filter((ch) => ch.categoryIds.includes(filter));
	}, [sortedChannels, filter]);

	const groupedByCategory = useMemo(() => {
		const groups: Record<string, Channel[]> = {};

		categories.forEach((cat) => {
			groups[cat.id] = channels.filter((ch) => ch.categoryIds.includes(cat.id));
		});

		groups['unassigned'] = channels.filter((ch) => ch.categoryIds.length === 0);

		return groups;
	}, [categories, channels]);

	async function handleCategoryChange(
		channelId: string,
		categoryId: string,
		isChecked: boolean
	) {
		const channel = channels.find((ch) => ch.id === channelId);
		if (!channel) return;

		const newCategoryIds = isChecked
			? [...channel.categoryIds, categoryId]
			: channel.categoryIds.filter((id) => id !== categoryId);

		await updateChannelCategories(channelId, newCategoryIds);
		onUpdate();
	}

	function toggleCategory(categoryId: string) {
		setExpandedCategories((prev) => {
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
			<view className="text-center py-16 px-4">
				<view className="text-white/40 mb-4">
					<view className="text-lg font-medium mb-2">
						No channels detected yet
					</view>
					<p className="text-sm">
						Visit YouTube's{' '}
						<a
							href="https://www.youtube.com/feed/channels"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-400 hover:text-blue-300 underline">
							Subscriptions page
						</a>{' '}
						to scan your channels.
					</p>
				</view>
			</view>
		);
	}

	return (
		<view className="flex flex-col gap-6">
			<view className="flex items-center justify-between gap-4 flex-wrap">
				<view className="flex items-center gap-3">
					<label className="text-sm font-medium text-white/70">
						Filter by:
					</label>
					<select
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
						className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all min-w-[160px]">
						<option value="all">All channels</option>
						<option value="unassigned">Unassigned</option>
						{categories.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{cat.name}
							</option>
						))}
					</select>
				</view>
				<span className="text-sm text-white/50 font-medium">
					{filteredChannels.length} channel
					{filteredChannels.length !== 1 ? 's' : ''}
				</span>
			</view>

			<view className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
				{filteredChannels.map((channel) => (
					<view
						key={channel.id}
						className="bg-white/5 rounded-xl p-4 flex items-center gap-4 border border-white/10 hover:bg-white/[0.07] transition-colors">
						<img
							src={channel.thumbnailUrl}
							alt={channel.name}
							className="w-12 h-12 rounded-full flex-shrink-0 border border-white/10"
						/>
						<view className="flex-1 min-w-0">
							<view className="text-white font-medium truncate">
								{channel.name}
							</view>
							{channel.categoryIds.length > 0 && (
								<view className="text-xs text-white/50 mt-1">
									{channel.categoryIds.length} categor
									{channel.categoryIds.length === 1 ? 'y' : 'ies'}
								</view>
							)}
						</view>

						<view className="relative flex-shrink-0">
							<select
								multiple
								value={channel.categoryIds}
								onChange={(e) => {
									const selectedOptions = Array.from(
										e.target.selectedOptions
									).map((opt) => opt.value);
									const currentIds = new Set(channel.categoryIds);
									const newIds = new Set(selectedOptions);

									// Find added and removed
									selectedOptions.forEach((id) => {
										if (!currentIds.has(id)) {
											handleCategoryChange(channel.id, id, true);
										}
									});

									channel.categoryIds.forEach((id) => {
										if (!newIds.has(id)) {
											handleCategoryChange(channel.id, id, false);
										}
									});
								}}
								className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 min-w-[220px] transition-all"
								size={Math.min(categories.length, 6)}>
								{categories.map((cat) => (
									<option key={cat.id} value={cat.id} className="py-1">
										{channel.categoryIds.includes(cat.id) ? '✓ ' : '  '}
										{cat.name}
									</option>
								))}
							</select>
						</view>
					</view>
				))}
			</view>

			{categories.length === 0 && (
				<view className="text-center py-12 px-4">
					<view className="text-white/40">
						<view className="text-lg font-medium mb-2">
							No categories available
						</view>
						<view className="text-sm">
							Create categories first to assign channels.
						</view>
					</view>
				</view>
			)}
		</view>
	);
}
