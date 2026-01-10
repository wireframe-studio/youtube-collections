import { Settings } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../components/button';
import {
	useActiveFilters,
	useCategories,
	useClearActiveFilters,
	useSetActiveFilters
} from '../../data/hooks';
import { QueryProvider } from '../../data/query-provider';
import { SettingsModal } from '../../settings/components/settings-modal';
import { CategoryItem } from './category-item';

function FeedSectionContent() {
	const { categories } = useCategories();
	const { activeFilters } = useActiveFilters();
	const setActiveFiltersMutation = useSetActiveFilters();
	const clearActiveFiltersMutation = useClearActiveFilters();
	const [isModalOpen, setIsModalOpen] = useState(false);

	async function toggleCategory(categoryId: string) {
		const newFilters = activeFilters.includes(categoryId)
			? activeFilters.filter((id) => id !== categoryId)
			: [...activeFilters, categoryId];

		setActiveFiltersMutation.mutate(newFilters);
	}

	async function showAll() {
		clearActiveFiltersMutation.mutate();
	}

	return (
		<>
			<view className="w-full pt-[24px] flex flex-col">
				<view className="title-2 px-0 mb-6 text-neutral">Categories</view>

				<view className="flex items-center gap-4 w-full justify-between">
					<view className="overflow-x-auto">
						<view className="flex gap-6">
							{categories.map((category) => (
								<CategoryItem
									key={category.id}
									category={category}
									isActive={activeFilters.includes(category.id)}
									onClick={() => toggleCategory(category.id)}
								/>
							))}
						</view>
					</view>

					<Button
						onClick={() => setIsModalOpen(true)}
						variant="solid-weak"
						size="icon"
						className="shrink-0">
						<Settings />
					</Button>
				</view>
			</view>

			{isModalOpen && <SettingsModal onClose={() => setIsModalOpen(false)} />}
		</>
	);
}

export function FeedSection() {
	return (
		<QueryProvider>
			<FeedSectionContent />
		</QueryProvider>
	);
}
