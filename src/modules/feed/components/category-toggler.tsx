import { useSetActiveFilters } from '../../data/mutations';
import { useActiveFilters, useCategories } from '../../data/queries';
import { CategoryItem } from './category-item';

export function CategoryToggler() {
	const { categories } = useCategories();
	const { activeFilters } = useActiveFilters();
	const setActiveFiltersMutation = useSetActiveFilters();

	async function toggleCategory(categoryId: string) {
		const newFilters = activeFilters.includes(categoryId)
			? activeFilters.filter((id) => id !== categoryId)
			: [...activeFilters, categoryId];

		setActiveFiltersMutation.mutate(newFilters);
	}

	return (
		<view className="flex flex-row gap-6 overflow-x-auto py-6 px-(--yt-offset)">
			{categories.map((category) => (
				<CategoryItem
					key={category.id}
					category={category}
					isActive={activeFilters.includes(category.id)}
					onClick={() => toggleCategory(category.id)}
				/>
			))}
		</view>
	);
}
