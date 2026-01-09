import { FC } from 'react';
import { Button } from '../../../../components/button';
import { IconPicker } from '../../../../components/icon-picker';
import { CATEGORY_COLORS } from '../../../../types';
import { cn } from '../../../../utils/utils';

export const CategoryForm: FC<{
	name: string;
	icon: string;
	color: string;
	onNameChange: (name: string) => void;
	onIconChange: (icon: string) => void;
	onColorChange: (color: string) => void;
	onSubmit: () => void;
	onCancel: () => void;
	submitLabel: string;
}> = ({
	name,
	icon,
	color,
	onNameChange,
	onIconChange,
	onColorChange,
	onSubmit,
	onCancel,
	submitLabel
}) => {
	return (
		<view className="bg-white/5 rounded-xl p-6 space-y-5 border border-white/10">
			<view>
				<label className="block text-sm font-medium text-white/70 mb-2">
					Category Name
				</label>
				<input
					type="text"
					placeholder="e.g., Science, Gaming, Music"
					value={name}
					onChange={(e) => onNameChange(e.target.value)}
					className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[var(--yt-spec-text-primary)] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
					autoFocus
				/>
			</view>

			<view>
				<label className="block text-sm font-medium text-white/70 mb-3">
					Choose an Icon
				</label>
				<IconPicker selectedIcon={icon} onSelect={onIconChange} />
			</view>

			<view>
				<label className="block text-sm font-medium text-white/70 mb-3">
					Pick a Color
				</label>
				<view className="flex gap-2.5 flex-wrap">
					{CATEGORY_COLORS.map((c) => (
						<button
							key={c}
							onClick={() => onColorChange(c)}
							className={cn(
								'w-10 h-10 rounded-full transition-all',
								c === color
									? 'ring-3 ring-white/50 scale-110 shadow-lg'
									: 'hover:scale-105 hover:ring-2 hover:ring-white/20'
							)}
							style={{ backgroundColor: c }}
						/>
					))}
				</view>
			</view>

			<view className="flex gap-3 pt-2">
				<Button
					onClick={onSubmit}
					disabled={!name.trim()}
					variant="solid"
					size="md">
					{submitLabel}
				</Button>
				<Button onClick={onCancel} variant="solid-weak" size="md">
					Cancel
				</Button>
			</view>
		</view>
	);
};
