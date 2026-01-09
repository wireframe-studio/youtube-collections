import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { getIconComponent } from '../../../../iconRegistry';
import type { Category } from '../../../../types';

export const CategoryItem: FC<{
	category: Category;
	onEdit: () => void;
	onDelete: () => void;
}> = ({ category, onEdit, onDelete }) => {
	const IconComponent = getIconComponent(category.icon);

	return (
		<view
			key={category.id}
			className="bg-white/5 rounded-xl p-4 flex items-center gap-4 border border-white/10 hover:bg-white/[0.07] transition-colors">
			<view
				className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
				style={{ backgroundColor: category.color }}>
				<IconComponent className="w-6 h-6 text-white" />
			</view>
			<span className="text-[var(--yt-spec-text-primary)] flex-1 font-medium">
				{category.name}
			</span>
			<button
				onClick={onEdit}
				className="p-2.5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white">
				<Pencil className="w-5 h-5" />
			</button>
			<button
				onClick={onDelete}
				className="p-2.5 hover:bg-red-500/10 rounded-lg transition-colors text-red-400 hover:text-red-300">
				<Trash2 className="w-5 h-5" />
			</button>
		</view>
	);
};
