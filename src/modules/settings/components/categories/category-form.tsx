import { FC } from 'react';
import { Button } from '../../../../components/button';
import { FormLabel } from '../../../../components/form-label';
import { IconPicker } from '../../../../components/icon-picker';
import { Input } from '../../../../components/input';
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
		<view className="bg-surface rounded-xl p-8 flex flex-col gap-6 border border-divider">
			<FormLabel title="Category Name">
				<Input
					type="text"
					placeholder="e.g., Science, Gaming, Music"
					value={name}
					onChange={(e) => onNameChange(e.target.value)}
					autoFocus
				/>
			</FormLabel>

			<FormLabel title="Choose an Icon">
				<IconPicker selectedIcon={icon} onSelect={onIconChange} />
			</FormLabel>

			<FormLabel title="Pick a Color">
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
			</FormLabel>

			<view className="flex gap-2">
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
