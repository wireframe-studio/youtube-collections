import { getIconComponent } from '../../../iconRegistry';
import type { Category } from '../../../types';
import { cn } from '../../../utils/utils';

interface CategoryCircleProps {
	category: Category;
	isActive: boolean;
	onClick: () => void;
}

export function CategoryItem({
	category,
	isActive,
	onClick
}: CategoryCircleProps) {
	const IconComponent = getIconComponent(category.icon);

	return (
		<view
			className="flex flex-col items-center gap-2 cursor-pointer group"
			onClick={onClick}>
			<view
				className={cn(
					'w-16 h-16 rounded-full flex items-center justify-center transition-all',
					isActive
						? 'ring-4 ring-[var(--yt-spec-text-primary)] scale-110'
						: 'hover:scale-105'
				)}
				style={{ backgroundColor: category.color }}>
				<IconComponent className="w-8 h-8 text-[var(--yt-spec-text-primary)]" />
			</view>
			<span className="text-xs text-[var(--yt-spec-text-primary)] text-center max-w-[80px] truncate">
				{category.name}
			</span>
		</view>
	);
}
