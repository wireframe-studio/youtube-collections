import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ICON_LIST } from '../iconRegistry';
import { cn } from '../utils/utils';

interface IconPickerProps {
	selectedIcon: string;
	onSelect: (iconName: string) => void;
}

export function IconPicker({ selectedIcon, onSelect }: IconPickerProps) {
	const [searchQuery, setSearchQuery] = useState('');

	const filteredIcons = useMemo(() => {
		if (!searchQuery) return ICON_LIST;
		return ICON_LIST.filter((icon) =>
			icon.name.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [searchQuery]);

	return (
		<view className="flex flex-col gap-3">
			<view className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--yt-spec-text-disabled)]" />
				<input
					type="text"
					placeholder="Search icons (e.g., star, heart, video)..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full bg-[var(--yt-spec-additive-background)] border border-[var(--yt-spec-outline)] rounded-lg pl-10 pr-4 py-2.5 text-[var(--yt-spec-text-primary)] placeholder:text-[var(--yt-spec-text-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--yt-spec-outline)] transition-all"
				/>
			</view>

			<view className="bg-[var(--yt-spec-additive-background)] border border-[var(--yt-spec-outline)] rounded-lg p-3">
				<view className="grid grid-cols-8 gap-2 max-h-72 overflow-y-auto">
					{filteredIcons.map((icon) => {
						const IconComponent = icon.component;
						const isSelected = icon.name === selectedIcon;

						return (
							<button
								key={icon.name}
								onClick={() => onSelect(icon.name)}
								className={cn(
									'w-11 h-11 rounded-lg flex items-center justify-center transition-all',
									isSelected
										? 'bg-[var(--yt-spec-badge-chip-background)] ring-2 ring-[var(--yt-spec-text-primary)] scale-105 shadow-lg'
										: 'bg-[var(--yt-spec-additive-background)] hover:bg-[var(--yt-spec-10-percent-layer)] hover:scale-105'
								)}
								title={icon.name}
								aria-label={`Select ${icon.name} icon`}>
								<IconComponent className="w-5 h-5 text-[var(--yt-spec-text-primary)]" />
							</button>
						);
					})}
				</view>
				{filteredIcons.length === 0 && (
					<view className="text-center py-8 text-[var(--yt-spec-text-disabled)] text-sm">
						No icons found for "{searchQuery}"
					</view>
				)}
			</view>

			<view className="text-xs text-[var(--yt-spec-text-disabled)] text-center">
				Showing {filteredIcons.length} icon
				{filteredIcons.length !== 1 ? 's' : ''}
			</view>
		</view>
	);
}
