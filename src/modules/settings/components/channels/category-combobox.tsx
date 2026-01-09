import { Check, ChevronDown, X } from 'lucide-react';
import { FC, useEffect, useRef, useState } from 'react';
import { getIconComponent } from '../../../../iconRegistry';
import type { Category } from '../../../../types';
import { CATEGORY_COLORS } from '../../../../types';
import { cn } from '../../../../utils/utils';

export const CategoryCombobox: FC<{
	categories: Category[];
	selectedIds: string[];
	onToggle: (categoryId: string) => void;
	onCreate: (category: Category) => void;
}> = ({ categories, selectedIds, onToggle, onCreate }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchText, setSearchText] = useState('');
	const comboboxRef = useRef<HTMLElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const selectedCategories = categories.filter((cat) =>
		selectedIds.includes(cat.id)
	);
	const filteredCategories = categories.filter((cat) =>
		cat.name.toLowerCase().includes(searchText.toLowerCase())
	);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				comboboxRef.current &&
				!comboboxRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
				setSearchText('');
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	function handleRemoveCategory(categoryId: string, e: React.MouseEvent) {
		e.stopPropagation();
		onToggle(categoryId);
	}

	async function handleCreateCategory() {
		const trimmedName = searchText.trim();
		if (!trimmedName || filteredCategories.length > 0) return;

		const randomColor =
			CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)];
		const newCategory: Category = {
			id: crypto.randomUUID(),
			name: trimmedName,
			icon: 'Circle',
			color: randomColor
		};

		onCreate(newCategory);
		setSearchText('');
		setIsOpen(false);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleCreateCategory();
		}
	}

	return (
		<view className="relative min-w-[280px]" ref={comboboxRef as any}>
			<view
				className={cn(
					'flex bg-white/5 border rounded-lg p-2 min-h-[44px] cursor-pointer hover:bg-white/[0.07] transition-colors',
					isOpen ? 'border-white/20 rounded-b-none' : 'border-white/10'
				)}
				onClick={() => {
					setIsOpen(!isOpen);
					if (!isOpen) {
						setTimeout(() => inputRef.current?.focus(), 0);
					}
				}}>
				<view className="flex flex-wrap gap-1.5 items-center">
					{selectedCategories.map((cat) => {
						const IconComponent = getIconComponent(cat.icon);
						return (
							<view
								key={cat.id}
								className="inline-flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-md text-xs font-medium text-white"
								style={{
									backgroundColor: cat.color + '40',
									borderColor: cat.color,
									borderWidth: '1px'
								}}>
								<IconComponent className="w-3 h-3" />
								<span>{cat.name}</span>
								<button
									onClick={(e) => handleRemoveCategory(cat.id, e)}
									className="hover:bg-black/20 rounded p-0.5 transition-colors">
									<X className="w-3 h-3" />
								</button>
							</view>
						);
					})}
					<input
						ref={inputRef}
						type="text"
						placeholder={
							selectedCategories.length === 0
								? 'Select categories...'
								: 'Search ...'
						}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						onClick={(e) => {
							e.stopPropagation();
							setIsOpen(true);
						}}
						onFocus={() => setIsOpen(true)}
						onKeyDown={handleKeyDown}
						className="flex-1 min-w-[120px] bg-transparent outline-none text-white text-sm placeholder:text-white/40 px-2 py-1"
					/>
					<ChevronDown
						className={cn(
							'w-4 h-4 text-white/50 transition-transform',
							isOpen && 'rotate-180'
						)}
					/>
				</view>
			</view>

			{isOpen && (
				<view className="absolute top-full left-0 right-0 bg-[#1a1a1a] border-l border-r border-b border-white/20 rounded-b-lg shadow-2xl z-10001 max-h-[280px] overflow-y-auto">
					{filteredCategories.length === 0 ? (
						<view className="px-4 py-8 text-center text-white/40 text-sm">
							{searchText ? (
								<view>
									<view className="mb-2">No categories found</view>
									<view className="text-xs text-white/60">
										Press{' '}
										<kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/80 font-mono">
											Enter
										</kbd>{' '}
										to create "{searchText}"
									</view>
								</view>
							) : (
								'No categories available'
							)}
						</view>
					) : (
						<view className="py-1">
							{filteredCategories.map((cat) => {
								const IconComponent = getIconComponent(cat.icon);
								const isSelected = selectedIds.includes(cat.id);

								return (
									<button
										key={cat.id}
										onClick={() => onToggle(cat.id)}
										className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left">
										<view
											className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
											style={{ backgroundColor: cat.color }}>
											<IconComponent className="w-4 h-4 text-white" />
										</view>
										<span className="flex-1 text-white text-sm font-medium">
											{cat.name}
										</span>
										{isSelected && <Check className="w-4 h-4 text-white" />}
									</button>
								);
							})}
						</view>
					)}
				</view>
			)}
		</view>
	);
};
