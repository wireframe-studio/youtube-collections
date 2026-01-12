import { FC, useMemo, useState } from 'react';
import { Input } from '../../../../components/input';
import type { Category, Channel } from '../../../../types';
import { ChannelListEmptyPlaceholder } from './channel-list-empty-placeholder';
import { ChannelListItem } from './channel-list-item';
import { ChannelListNoCategoriesPlaceholder } from './channel-list-no-categories-placeholder';

export const ChannelList: FC<{
	channels: Channel[];
	categories: Category[];
	onChannelUpdate: (
		channelId: string,
		categoryId: string,
		isChecked: boolean
	) => void;
	onCategoryCreate: (channelId: string, category: Category) => void;
}> = ({ channels, categories, onChannelUpdate, onCategoryCreate }) => {
	const [searchQuery, setSearchQuery] = useState('');

	const filteredChannels = useMemo(() => {
		if (!searchQuery.trim()) {
			return channels;
		}
		const query = searchQuery.toLowerCase();
		return channels.filter((channel) =>
			channel.name.toLowerCase().includes(query)
		);
	}, [channels, searchQuery]);

	if (channels.length === 0) {
		return (
			<view className="px-8">
				<ChannelListEmptyPlaceholder />
			</view>
		);
	}

	if (categories.length === 0) {
		return (
			<view className="px-8">
				<ChannelListNoCategoriesPlaceholder />
			</view>
		);
	}

	return (
		<view className="flex flex-col gap-3 px-8">
			<Input
				variant="outline"
				type="search"
				placeholder="Search channels..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			<view className="flex flex-col gap-3 max-h-[500px] overflow-y-scroll">
				{filteredChannels.length === 0 ? (
					<view className="py-8 text-center text-neutral-muted body-1">
						No channels found matching "{searchQuery}"
					</view>
				) : (
					filteredChannels.map((channel) => (
						<ChannelListItem
							key={channel.id}
							channel={channel}
							categories={categories}
							onCategoryToggle={(categoryId, isSelected) =>
								onChannelUpdate(channel.id, categoryId, isSelected)
							}
							onCategoryCreate={(category) =>
								onCategoryCreate(channel.id, category)
							}
						/>
					))
				)}
			</view>
		</view>
	);
};
