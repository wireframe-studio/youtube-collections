import { Plus } from 'lucide-react';
import { FC, useState } from 'react';
import { Button } from '../../../../components/button';
import { SectionHeader } from '../../../../components/section-header';
import {
	addCategory,
	deleteCategory,
	updateCategory
} from '../../../../storage';
import { CATEGORY_COLORS, type Category } from '../../../../types';
import { CategoryForm } from './category-form';
import { CategoryList } from './category-list';

export const CategoriesTab: FC<{
	categories: Category[];
	onUpdate: () => void;
}> = ({ categories, onUpdate }) => {
	const [isCreating, setIsCreating] = useState(false);
	const [newName, setNewName] = useState('');
	const [newIcon, setNewIcon] = useState('Circle');
	const [newColor, setNewColor] = useState<string>(CATEGORY_COLORS[0]);

	const [editingId, setEditingId] = useState<string | null>(null);
	const [editName, setEditName] = useState('');
	const [editIcon, setEditIcon] = useState('Circle');
	const [editColor, setEditColor] = useState<string>(CATEGORY_COLORS[0]);

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
		setIsCreating(false);
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

	return (
		<>
			<SectionHeader
				title="Your Categories"
				description={`${categories.length} category${
					categories.length !== 1 ? 's' : ''
				}`}>
				<Button
					onClick={() => setIsCreating(!isCreating)}
					variant="outline"
					size="md">
					New Category
					<Plus />
				</Button>
			</SectionHeader>

			<view className="flex flex-col gap-3 px-8">
				{isCreating && (
					<CategoryForm
						name={newName}
						icon={newIcon}
						color={newColor}
						onNameChange={setNewName}
						onIconChange={setNewIcon}
						onColorChange={setNewColor}
						onSubmit={handleCreate}
						onCancel={() => setIsCreating(false)}
						submitLabel="Create Category"
					/>
				)}

				<CategoryList
					categories={categories}
					editingId={editingId}
					onEdit={handleStartEdit}
					onDelete={handleDelete}
					isCreating={isCreating}
					renderEditForm={(category) => (
						<CategoryForm
							key={category.id}
							name={editName}
							icon={editIcon}
							color={editColor}
							onNameChange={setEditName}
							onIconChange={setEditIcon}
							onColorChange={setEditColor}
							onSubmit={handleSaveEdit}
							onCancel={handleCancelEdit}
							submitLabel="Save Changes"
						/>
					)}
				/>
			</view>
		</>
	);
};
