import { FC, ReactNode } from 'react';
import type { Category } from '../../../../types';
import { CategoryItem } from './category-item';

export const CategoryList: FC<{
	categories: Category[];
	editingId: string | null;
	onEdit: (category: Category) => void;
	onDelete: (categoryId: string) => void;
	renderEditForm: (category: Category) => ReactNode;
	isCreating: boolean;
}> = ({
	categories,
	editingId,
	onEdit,
	onDelete,
	renderEditForm,
	isCreating
}) => {
	if (categories.length === 0 && !isCreating) {
		return (
			<view className="text-center py-12 text-white/40">
				<view className="text-lg mb-2">No categories yet</view>
				<view className="text-sm">
					Create your first category to get started!
				</view>
			</view>
		);
	}

	return (
		<view className="space-y-3">
			{categories.map((category) => {
				const isEditing = editingId === category.id;

				if (isEditing) {
					return renderEditForm(category);
				}

				return (
					<CategoryItem
						key={category.id}
						category={category}
						onEdit={() => onEdit(category)}
						onDelete={() => onDelete(category.id)}
					/>
				);
			})}
		</view>
	);
};
