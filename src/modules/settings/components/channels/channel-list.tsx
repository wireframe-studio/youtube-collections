import { FC } from 'react';
import type { Category, Channel } from '../../../../types';
import { ChannelListEmptyPlaceholder } from './channel-list-empty-placeholder';
import { ChannelListItem } from './channel-list-item';

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
	if (channels.length === 0) {
		return <ChannelListEmptyPlaceholder />;
	}

	if (categories.length === 0) {
		return (
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
		);
	}

	return (
		<view className="flex flex-col gap-2 max-h-[500px] overflow-y-scroll">
			{channels.map((channel) => (
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
			))}
		</view>
	);
};
