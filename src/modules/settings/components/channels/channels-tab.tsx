import { FC, useMemo, useState } from 'react';
import { addCategory, updateChannelCategories } from '../../../../storage';
import type { Category, Channel } from '../../../../types';
import { ChannelList } from './channel-list';
import { ChannelListHeader } from './channel-list-header';

type FilterType = 'all' | 'unassigned' | string;

export const ChannelsTab: FC<{
	categories: Category[];
	channels: Channel[];
	onUpdate: () => void;
}> = ({ categories, channels, onUpdate }) => {
	const [filter, setFilter] = useState<FilterType>('all');

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

	async function handleCategoryCreate(channelId: string, newCategory: Category) {
		await addCategory(newCategory);
		await handleCategoryChange(channelId, newCategory.id, true);
		onUpdate();
	}

	return (
		<view className="flex flex-col gap-6">
			<ChannelListHeader
				categories={categories}
				filter={filter}
				onFilterChange={setFilter}
				channelCount={filteredChannels.length}
			/>

			<ChannelList
				channels={filteredChannels}
				categories={categories}
				onChannelUpdate={handleCategoryChange}
				onCategoryCreate={handleCategoryCreate}
			/>
		</view>
	);
};
