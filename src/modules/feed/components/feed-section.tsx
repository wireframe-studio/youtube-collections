import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/button';
import {
	getStorageData,
	onStorageChange,
	setActiveFilters
} from '../../../storage';
import type { Category } from '../../../types';
import { SettingsModal } from '../../settings/components/settings-modal';
import { CategoryItem } from './category-item';

export function FeedSection() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [activeFilters, setActiveFiltersState] = useState<string[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		loadData();
		onStorageChange(handleStorageChange);
	}, []);

	async function loadData() {
		const data = await getStorageData();
		setCategories(data.categories);
		setActiveFiltersState(data.activeFilters);
	}

	function handleStorageChange(data: any) {
		setCategories(data.categories);
		setActiveFiltersState(data.activeFilters);
	}

	async function toggleCategory(categoryId: string) {
		const newFilters = activeFilters.includes(categoryId)
			? activeFilters.filter((id) => id !== categoryId)
			: [...activeFilters, categoryId];

		await setActiveFilters(newFilters);
		setActiveFiltersState(newFilters);
	}

	async function showAll() {
		await setActiveFilters([]);
		setActiveFiltersState([]);
	}

	return (
		<>
			<view className="py-4 bg-test">
				<view className="flex items-center gap-4">
					<Button
						onClick={() => setIsModalOpen(true)}
						variant="solid-weak"
						size="icon">
						<Settings />
					</Button>

					{categories.length > 0 && (
						<Button
							onClick={showAll}
							variant={activeFilters.length === 0 ? 'solid-weak' : 'ghost'}>
							Show All
						</Button>
					)}

					<view className="flex-1 overflow-x-auto p-2">
						<view className="flex gap-6 pb-2">
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
				</view>
			</view>

			{isModalOpen && <SettingsModal onClose={() => setIsModalOpen(false)} />}
		</>
	);
}
