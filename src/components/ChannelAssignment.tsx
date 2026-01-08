import { Check, ChevronDown, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getIconComponent } from '../iconRegistry';
import { updateChannelCategories } from '../storage';
import type { Category, Channel } from '../types';

interface ChannelAssignmentProps {
	categories: Category[];
	channels: Channel[];
	onUpdate: () => void;
}

type FilterType = 'all' | 'unassigned' | string;

interface CategoryComboboxProps {
	categories: Category[];
	selectedIds: string[];
	onToggle: (categoryId: string) => void;
}

function CategoryCombobox({
	categories,
	selectedIds,
	onToggle
}: CategoryComboboxProps) {
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

	return (
		<view className="relative min-w-[280px]" ref={comboboxRef as any}>
			<view
				className={`flex bg-white/5 border rounded-lg p-2 min-h-[44px] cursor-pointer hover:bg-white/[0.07] transition-colors ${
					isOpen ? 'border-white/20 rounded-b-none' : 'border-white/10'
				}`}
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
									className="hover:bg-black/20 rounded p-0.5 transition-colors"
									aria-label={`Remove ${cat.name}`}>
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
						onFocus={() => setIsOpen(true)}
						className="flex-1 min-w-[120px] bg-transparent outline-none text-white text-sm placeholder:text-white/40 px-2 py-1"
					/>
					<ChevronDown
						className={`w-4 h-4 text-white/50 transition-transform ${
							isOpen ? 'rotate-180' : ''
						}`}
					/>
				</view>
			</view>

			{isOpen && (
				<view className="absolute top-full left-0 right-0 bg-[#1a1a1a] border-l border-r border-b border-white/20 rounded-b-lg shadow-2xl z-10001 max-h-[280px] overflow-y-auto">
					{filteredCategories.length === 0 ? (
						<view className="px-4 py-8 text-center text-white/40 text-sm">
							{searchText ? 'No categories found' : 'No categories available'}
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
}

export function ChannelAssignment({
	categories,
	channels,
	onUpdate
}: ChannelAssignmentProps) {
	const [filter, setFilter] = useState<FilterType>('all');
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
		new Set()
	);

	const sortedChannels = useMemo(() => {
		return [...channels].sort((a, b) => a.name.localeCompare(b.name));
	}, [channels]);

	const filteredChannels = useMemo(() => {
		if (filter === 'all') return sortedChannels;
		if (filter === 'unassigned') {
			return sortedChannels.filter((ch) => ch.categoryIds.length === 0);
		}
		return sortedChannels.filter((ch) => ch.categoryIds.includes(filter));
	}, [sortedChannels, filter]);

	const groupedByCategory = useMemo(() => {
		const groups: Record<string, Channel[]> = {};

		categories.forEach((cat) => {
			groups[cat.id] = channels.filter((ch) => ch.categoryIds.includes(cat.id));
		});

		groups['unassigned'] = channels.filter((ch) => ch.categoryIds.length === 0);

		return groups;
	}, [categories, channels]);

	async function handleCategoryChange(
		channelId: string,
		categoryId: string,
		isChecked: boolean
	) {
		const channel = channels.find((ch) => ch.id === channelId);
		if (!channel) return;

		const newCategoryIds = isChecked
			? [...channel.categoryIds, categoryId]
			: channel.categoryIds.filter((id) => id !== categoryId);

		await updateChannelCategories(channelId, newCategoryIds);
		onUpdate();
	}

	function toggleCategory(categoryId: string) {
		setExpandedCategories((prev) => {
			const next = new Set(prev);
			if (next.has(categoryId)) {
				next.delete(categoryId);
			} else {
				next.add(categoryId);
			}
			return next;
		});
	}

	if (channels.length === 0) {
		return (
			<view className="text-center py-16 px-4">
				<view className="text-white/40 mb-4">
					<view className="text-lg font-medium mb-2">
						No channels detected yet
					</view>
					<p className="text-sm">
						Visit YouTube's{' '}
						<a
							href="https://www.youtube.com/feed/channels"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-400 hover:text-blue-300 underline">
							Subscriptions page
						</a>{' '}
						to scan your channels.
					</p>
				</view>
			</view>
		);
	}

	return (
		<view className="flex flex-col gap-6">
			<view className="flex items-center justify-between gap-4 flex-wrap">
				<view className="flex items-center gap-3">
					<label className="text-sm font-medium text-white/70">
						Filter by:
					</label>
					<select
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
						className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all min-w-[160px]">
						<option value="all">All channels</option>
						<option value="unassigned">Unassigned</option>
						{categories.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{cat.name}
							</option>
						))}
					</select>
				</view>
				<span className="text-sm text-white/50 font-medium">
					{filteredChannels.length} channel
					{filteredChannels.length !== 1 ? 's' : ''}
				</span>
			</view>

			<view className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
				{filteredChannels.map((channel) => (
					<view
						key={channel.id}
						className="bg-white/5 rounded-xl p-4 flex items-center gap-4 border border-white/10 hover:bg-white/[0.07] transition-colors">
						<img
							src={channel.thumbnailUrl}
							alt={channel.name}
							className="w-12 h-12 rounded-full shrink-0 border border-white/10"
						/>
						<view className="flex-1 min-w-0">
							<view className="text-white font-medium truncate">
								{channel.name}
							</view>
							{channel.categoryIds.length > 0 && (
								<view className="text-xs text-white/50 mt-1">
									{channel.categoryIds.length} categor
									{channel.categoryIds.length === 1 ? 'y' : 'ies'}
								</view>
							)}
						</view>

						<CategoryCombobox
							categories={categories}
							selectedIds={channel.categoryIds}
							onToggle={(categoryId) => {
								const isCurrentlySelected =
									channel.categoryIds.includes(categoryId);
								handleCategoryChange(
									channel.id,
									categoryId,
									!isCurrentlySelected
								);
							}}
						/>
					</view>
				))}
			</view>

			{categories.length === 0 && (
				<view className="text-center py-12 px-4">
					<view className="text-white/40">
						<view className="text-lg font-medium mb-2">
							No categories available
						</view>
						<view className="text-sm">
							Create categories first to assign channels.
						</view>
					</view>
				</view>
			)}
		</view>
	);
}
