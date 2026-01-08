import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getStorageData, onStorageChange, setActiveFilters } from '../storage';
import type { Category } from '../types';
import { CategoryCircle } from './CategoryCircle';
import { Modal } from './Modal';

export function CategorySection() {
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
			<view className="bg-[#0f0f0f] border-b border-white/10 py-4 px-6">
				<view className="flex items-center gap-4">
					<button
						onClick={() => setIsModalOpen(true)}
						className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
						title="Manage collections">
						<Settings className="w-6 h-6 text-white" />
					</button>

					{categories.length > 0 && (
						<button
							onClick={showAll}
							className={`
                flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${
									activeFilters.length === 0
										? 'bg-white text-black'
										: 'bg-white/10 text-white hover:bg-white/20'
								}
              `}>
							Show All
						</button>
					)}

					<view className="flex-1 overflow-x-auto">
						<view className="flex gap-6 pb-2">
							{categories.map((category) => (
								<CategoryCircle
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

			{isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
		</>
	);
}
