import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { Button } from '../../../../components/button';
import { getIconComponent } from '../../../../iconRegistry';
import type { Category } from '../../../../types';

export const CategoryListItem: FC<{
	category: Category;
	onEdit: () => void;
	onDelete: () => void;
}> = ({ category, onEdit, onDelete }) => {
	const IconComponent = getIconComponent(category.icon);

	return (
		<view
			key={category.id}
			className="bg-surface rounded-xl p-4 flex items-center gap-4 transition-colors">
			<view
				className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
				style={{ backgroundColor: category.color }}>
				<IconComponent className="w-6 h-6 text-white" />
			</view>

			<span className="title-3 text-neutral flex-1 font-medium">
				{category.name}
			</span>

			<Button onClick={onEdit} variant="outline" size="icon">
				<Pencil />
			</Button>

			<Button onClick={onDelete} variant="outline" size="icon">
				<Trash2 />
			</Button>
		</view>
	);
};
