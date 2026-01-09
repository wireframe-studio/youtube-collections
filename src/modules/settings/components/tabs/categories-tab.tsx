import { Pencil, Plus, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import { Button } from '../../../../components/button';
import { IconPicker } from '../../../../components/icon-picker';
import { getIconComponent } from '../../../../iconRegistry';
import {
	addCategory,
	deleteCategory,
	updateCategory
} from '../../../../storage';
import { CATEGORY_COLORS, type Category } from '../../../../types';
import { cn } from '../../../../utils/utils';

interface CategoryManagementProps {
	categories: Category[];
	onUpdate: () => void;
}

export function CategoriesTab({
	categories,
	onUpdate
}: CategoryManagementProps) {
	const [isCreating, setIsCreating] = useState(false);
	const [newName, setNewName] = useState('');
	const [newIcon, setNewIcon] = useState('Circle');
	const [newColor, setNewColor] = useState(CATEGORY_COLORS[0]);

	const [editingId, setEditingId] = useState<string | null>(null);
	const [editName, setEditName] = useState('');
	const [editIcon, setEditIcon] = useState('Circle');
	const [editColor, setEditColor] = useState(CATEGORY_COLORS[0]);

	async function handleCreate() {
		if (!newName.trim()) return;

		const category: Category = {
			id: crypto.randomUUID(),
			name: newName.trim(),
			icon: newIcon,
			color: newColor
		};

		await addCategory(category);
		setIsCreating(false);
		setNewName('');
		setNewIcon('Circle');
		setNewColor(CATEGORY_COLORS[0]);
		onUpdate();
	}

	async function handleDelete(categoryId: string) {
		if (confirm('Delete this category? Channels will be unassigned from it.')) {
			await deleteCategory(categoryId);
			onUpdate();
		}
	}

	function handleStartEdit(category: Category) {
		setEditingId(category.id);
		setEditName(category.name);
		setEditIcon(category.icon);
		setEditColor(category.color);
		setIsCreating(false); // Close create form if open
	}

	async function handleSaveEdit() {
		if (!editName.trim() || !editingId) return;

		const updatedCategory: Category = {
			id: editingId,
			name: editName.trim(),
			icon: editIcon,
			color: editColor
		};

		await updateCategory(updatedCategory);
		setEditingId(null);
		setEditName('');
		setEditIcon('Circle');
		setEditColor(CATEGORY_COLORS[0]);
		onUpdate();
	}

	function handleCancelEdit() {
		setEditingId(null);
		setEditName('');
		setEditIcon('Circle');
		setEditColor(CATEGORY_COLORS[0]);
	}

	const NewCategoryForm = () => {
		return (
			<view className="bg-white/5 rounded-xl p-6 space-y-5 border border-white/10">
				<view>
					<label className="block text-sm font-medium text-white/70 mb-2">
						Category Name
					</label>
					<input
						type="text"
						placeholder="e.g., Science, Gaming, Music"
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[var(--yt-spec-text-primary)] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
						autoFocus
					/>
				</view>

				<view>
					<label className="block text-sm font-medium text-white/70 mb-3">
						Choose an Icon
					</label>
					<IconPicker selectedIcon={newIcon} onSelect={setNewIcon} />
				</view>

				<view>
					<label className="block text-sm font-medium text-white/70 mb-3">
						Pick a Color
					</label>
					<view className="flex gap-2.5 flex-wrap">
						{CATEGORY_COLORS.map((color) => (
							<button
								key={color}
								onClick={() => setNewColor(color)}
								className={cn(
									'w-10 h-10 rounded-full transition-all',
									color === newColor
										? 'ring-3 ring-white/50 scale-110 shadow-lg'
										: 'hover:scale-105 hover:ring-2 hover:ring-white/20'
								)}
								style={{ backgroundColor: color }}
							/>
						))}
					</view>
				</view>

				<view className="flex gap-3 pt-2">
					<Button
						onClick={handleCreate}
						disabled={!newName.trim()}
						variant="solid"
						size="md">
						Create Category
					</Button>
					<Button
						onClick={() => setIsCreating(false)}
						variant="solid-weak"
						size="md">
						Cancel
					</Button>
				</view>
			</view>
		);
	};

	const EditCategoryForm: FC<{ category: Category }> = ({ category }) => {
		return (
			<view
				key={category.id}
				className="bg-white/5 rounded-xl p-6 space-y-5 border border-white/10">
				<view>
					<label className="block text-sm font-medium text-white/70 mb-2">
						Category Name
					</label>
					<input
						type="text"
						placeholder="e.g., Science, Gaming, Music"
						value={editName}
						onChange={(e) => setEditName(e.target.value)}
						className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[var(--yt-spec-text-primary)] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
						autoFocus
					/>
				</view>

				<view>
					<label className="block text-sm font-medium text-white/70 mb-3">
						Choose an Icon
					</label>
					<IconPicker selectedIcon={editIcon} onSelect={setEditIcon} />
				</view>

				<view>
					<label className="block text-sm font-medium text-white/70 mb-3">
						Pick a Color
					</label>
					<view className="flex gap-2.5 flex-wrap">
						{CATEGORY_COLORS.map((color) => (
							<button
								key={color}
								onClick={() => setEditColor(color)}
								className={cn(
									'w-10 h-10 rounded-full transition-all',
									color === editColor
										? 'ring-3 ring-white/50 scale-110 shadow-lg'
										: 'hover:scale-105 hover:ring-2 hover:ring-white/20'
								)}
								style={{ backgroundColor: color }}
								aria-label={`Select color ${color}`}
							/>
						))}
					</view>
				</view>

				<view className="flex gap-3 pt-2">
					<button
						onClick={handleSaveEdit}
						disabled={!editName.trim()}
						className="px-6 py-2.5 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
						Save Changes
					</button>
					<button
						onClick={handleCancelEdit}
						className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-[var(--yt-spec-text-primary)] rounded-xl transition-colors font-medium">
						Cancel
					</button>
				</view>
			</view>
		);
	};

	return (
		<view className="flex flex-col gap-6">
			<view className="flex items-center justify-between">
				<h3 className="text-xl font-semibold text-[var(--yt-spec-text-primary)]">
					Your Categories
				</h3>
				<Button
					onClick={() => setIsCreating(!isCreating)}
					variant="outline"
					size="md">
					New Category
					<Plus />
				</Button>
			</view>

			{isCreating && <NewCategoryForm />}

			<view className="space-y-3">
				{categories.map((category) => {
					const IconComponent = getIconComponent(category.icon);
					const isEditing = editingId === category.id;

					if (isEditing) {
						return <EditCategoryForm category={category} />;
					}

					return (
						<view
							key={category.id}
							className="bg-white/5 rounded-xl p-4 flex items-center gap-4 border border-white/10 hover:bg-white/[0.07] transition-colors">
							<view
								className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
								style={{ backgroundColor: category.color }}>
								<IconComponent className="w-6 h-6 text-white" />
							</view>
							<span className="text-[var(--yt-spec-text-primary)] flex-1 font-medium">
								{category.name}
							</span>
							<button
								onClick={() => handleStartEdit(category)}
								className="p-2.5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
								aria-label={`Edit ${category.name}`}>
								<Pencil className="w-5 h-5" />
							</button>
							<button
								onClick={() => handleDelete(category.id)}
								className="p-2.5 hover:bg-red-500/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
								aria-label={`Delete ${category.name}`}>
								<Trash2 className="w-5 h-5" />
							</button>
						</view>
					);
				})}

				{categories.length === 0 && !isCreating && (
					<view className="text-center py-12 text-white/40">
						<view className="text-lg mb-2">No categories yet</view>
						<view className="text-sm">
							Create your first category to get started!
						</view>
					</view>
				)}
			</view>
		</view>
	);
}
