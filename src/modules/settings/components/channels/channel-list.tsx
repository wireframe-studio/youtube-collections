import { FC } from 'react';
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
	if (channels.length === 0) {
		return <ChannelListEmptyPlaceholder />;
	}

	if (categories.length === 0) {
		return <ChannelListNoCategoriesPlaceholder />;
	}

	return (
		<view className="flex flex-col gap-3 max-h-[500px] overflow-y-scroll px-8">
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
