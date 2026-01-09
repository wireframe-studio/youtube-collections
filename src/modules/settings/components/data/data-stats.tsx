import { FC } from 'react';

export const DataStats: FC<{
	categoryCount: number;
	channelCount: number;
}> = ({ categoryCount, channelCount }) => {
	return (
		<view className="bg-[var(--yt-spec-additive-background)] border border-[var(--yt-spec-outline)] rounded-xl p-6 max-w-2xl mx-auto w-full">
			<h4 className="text-base font-semibold text-[var(--yt-spec-text-primary)] mb-4">
				Current Statistics
			</h4>
			<view className="grid grid-cols-2 gap-6">
				<view className="text-center">
					<view className="text-3xl font-bold text-[var(--yt-spec-text-primary)]">
						{categoryCount}
					</view>
					<view className="text-sm text-[var(--yt-spec-text-secondary)] mt-1">
						{categoryCount === 1 ? 'Category' : 'Categories'}
					</view>
				</view>
				<view className="text-center">
					<view className="text-3xl font-bold text-[var(--yt-spec-text-primary)]">
						{channelCount}
					</view>
					<view className="text-sm text-[var(--yt-spec-text-secondary)] mt-1">
						{channelCount === 1 ? 'Channel' : 'Channels'}
					</view>
				</view>
			</view>
		</view>
	);
};
