import { FC } from 'react';
import type { Category, Channel } from '../../../../types';
import { ChannelListItem } from './channel-list-item';

export const ChannelList: FC<{
	channels: Channel[];
	categories: Category[];
	onChannelUpdate: (channelId: string, categoryId: string, isChecked: boolean) => void;
	onCategoryCreate: (channelId: string, category: Category) => void;
}> = ({ channels, categories, onChannelUpdate, onCategoryCreate }) => {
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
		<view className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
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
