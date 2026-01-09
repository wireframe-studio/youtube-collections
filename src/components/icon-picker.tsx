import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ICON_LIST } from '../iconRegistry';
import { Button } from './button';
import { Input } from './input';

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
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-muted" />
				<Input
					type="text"
					placeholder="Search icons (e.g., star, heart, video)..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="pl-10"
				/>
			</view>

			<view className="bg-surface border border-divider rounded-lg p-3">
				<view className="grid grid-cols-8 gap-2 max-h-72 overflow-y-auto">
					{filteredIcons.map((icon) => {
						const IconComponent = icon.component;
						const isSelected = icon.name === selectedIcon;

						return (
							<Button
								key={icon.name}
								onClick={() => onSelect(icon.name)}
								variant={isSelected ? 'outline' : 'ghost'}
								size="icon">
								<IconComponent />
							</Button>
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
