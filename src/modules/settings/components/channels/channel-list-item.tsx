import { FC } from 'react';
import type { Category, Channel } from '../../../../types';
import { CategoryCombobox } from './category-combobox';

export const ChannelListItem: FC<{
	channel: Channel;
	categories: Category[];
	onCategoryToggle: (categoryId: string, isSelected: boolean) => void;
	onCategoryCreate: (category: Category) => void;
}> = ({ channel, categories, onCategoryToggle, onCategoryCreate }) => {
	return (
		<view className="bg-white/5 rounded-xl p-4 flex items-center gap-4 border border-white/10 hover:bg-white/[0.07] transition-colors">
			<img
				src={channel.thumbnailUrl}
				alt={channel.name}
				className="w-12 h-12 rounded-full shrink-0 border border-white/10"
			/>
			<view className="flex-1 min-w-0">
				<view className="text-white font-medium truncate">{channel.name}</view>
				{channel.categoryIds.length > 0 && (
					<view className="text-xs text-white/50 mt-1">
						{channel.categoryIds.length} categor
						{channel.categoryIds.length === 1 ? 'y' : 'ies'}
					</view>
				)}
			</view>

			<CategoryCombobox
				categories={categories}
				selectedIds={channel.categoryIds}
				onToggle={(categoryId) => {
					const isCurrentlySelected = channel.categoryIds.includes(categoryId);
					onCategoryToggle(categoryId, !isCurrentlySelected);
				}}
				onCreate={onCategoryCreate}
			/>
		</view>
	);
};
