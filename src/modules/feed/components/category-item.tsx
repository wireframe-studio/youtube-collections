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
					isActive ? 'scale-110' : 'hover:scale-105'
				)}
				style={{
					backgroundColor: `color-mix(in srgb, ${category.color} ${
						isActive ? '100%' : '40%'
					}, transparent)`
				}}>
				<IconComponent className="w-8 h-8 text-neutral" />
			</view>
			<span className="body-3 text-neutral text-center truncate w-16">
				{category.name}
			</span>
		</view>
	);
}
