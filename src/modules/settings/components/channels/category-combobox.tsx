import { Check, ChevronDown, X } from 'lucide-react';
import { FC, useEffect, useRef, useState } from 'react';
import { getIconComponent, ICON_LIST } from '../../../../iconRegistry';
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

	const selectedCategories = categories
		.sort((a, b) => a.name.localeCompare(b.name))
		.filter((cat) => selectedIds.includes(cat.id));

	const filteredCategories = categories
		.sort((a, b) => a.name.localeCompare(b.name))
		.filter((cat) => cat.name.toLowerCase().includes(searchText.toLowerCase()));

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
		const randomIcon =
			ICON_LIST[Math.floor(Math.random() * ICON_LIST.length)].name;
		const newCategory: Category = {
			id: crypto.randomUUID(),
			name: trimmedName,
			icon: randomIcon,
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
					'flex border rounded-xl p-3 min-h-[44px] max-w-[280px] overflow-x-scroll cursor-pointer transition-colors',
					isOpen
						? 'border-divider rounded-b-none bg-foreground'
						: 'border-divider bg-surface-muted hover:bg-surface-hover'
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
								className="inline-flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl body-3 font-medium text-neutral"
								style={{
									backgroundColor: cat.color + '40',
									borderColor: cat.color,
									borderWidth: '1px'
								}}>
								<IconComponent className="w-4 h-4" />

								<span>{cat.name}</span>

								<button
									onClick={(e) => handleRemoveCategory(cat.id, e)}
									className="hover:bg-black/20 rounded p-0.5 transition-colors">
									<X className="w-4 h-4" />
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
						className="flex-1 min-w-[120px] bg-transparent body-1 outline-none text-neutral placeholder:text-neutral-muted px-2 py-1"
					/>
					<ChevronDown
						className={cn(
							'w-4 h-4 text-neutral-muted transition-transform',
							isOpen && 'rotate-180'
						)}
					/>
				</view>
			</view>

			{isOpen && (
				<view className="absolute top-full left-0 right-0 bg-foreground border-l border-r border-b border-divider rounded-b-lg shadow-2xl z-10001 max-h-[280px] overflow-y-auto py-3">
					{filteredCategories.length === 0 ? (
						<view className="px-4 py-8 text-center text-neutral-muted">
							{searchText ? (
								<view className="body-3 text-neutral-muted">
									Press{' '}
									<kbd className="px-2 py-1 bg-surface rounded text-neutral font-mono">
										Enter
									</kbd>{' '}
									to create "{searchText}"
								</view>
							) : (
								'No categories available.'
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
										className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-hover active:bg-surface-active text-left">
										<view
											className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
											style={{ backgroundColor: cat.color }}>
											<IconComponent className="w-6 h-6 text-neutral" />
										</view>

										<span className="flex-1 title-3 text-neutral font-medium">
											{cat.name}
										</span>

										{isSelected && <Check className="w-4 h-4 text-neutral" />}
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
