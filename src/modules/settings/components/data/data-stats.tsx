import { FC } from 'react';

export const DataStats: FC<{
	categoryCount: number;
	channelCount: number;
}> = ({ categoryCount, channelCount }) => {
	return (
		<view className="bg-surface rounded-xl p-6 w-full">
			<h4 className="title-3 text-neutral mb-4">Current Statistics</h4>
			<view className="grid grid-cols-2 gap-6">
				<view className="flex flex-row items-center justify-center gap-3">
					<view className="title-2 text-neutral">{categoryCount}</view>
					<view className="body-3 text-neutral-muted mt-1">
						{categoryCount === 1 ? 'Category' : 'Categories'}
					</view>
				</view>
				<view className="flex flex-row items-center justify-center gap-3">
					<view className="title-2 text-neutral">{channelCount}</view>
					<view className="body-3 text-neutral-muted mt-1">
						{channelCount === 1 ? 'Channel' : 'Channels'}
					</view>
				</view>
			</view>
		</view>
	);
};
