import { ExternalLink } from 'lucide-react';
import { FC } from 'react';
import { Button } from '../../../../components/button';
import type { Category, Channel } from '../../../../types';
import { CategoryCombobox } from './category-combobox';

export const ChannelListItem: FC<{
	channel: Channel;
	categories: Category[];
	onCategoryToggle: (categoryId: string, isSelected: boolean) => void;
	onCategoryCreate: (category: Category) => void;
}> = ({ channel, categories, onCategoryToggle, onCategoryCreate }) => {
	return (
		<view className="bg-surface-muted rounded-xl p-4 flex items-center gap-4 transition-colors">
			{!channel.thumbnailUrl && (
				<view className="w-12 h-12 rounded-full shrink-0 border border-white/10 bg-surface" />
			)}

			{channel.thumbnailUrl && (
				<img
					src={channel.thumbnailUrl}
					alt={channel.name}
					className="w-12 h-12 rounded-full shrink-0 border border-white/10"
				/>
			)}

			<view className="title-3 text-neutral truncate flex-1">
				{channel.name}
			</view>

			<Button
				variant="ghost"
				size="icon"
				onClick={() =>
					window.open(`https://www.youtube.com/${channel.id}`, '_blank')
				}>
				<ExternalLink />
			</Button>

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
