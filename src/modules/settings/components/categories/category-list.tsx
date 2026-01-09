import { FC, ReactNode } from 'react';
import type { Category } from '../../../../types';
import { CategoryListEmptyPlaceholder } from './category-list-empty-placeholder';
import { CategoryListItem } from './category-list-item';

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
		return <CategoryListEmptyPlaceholder />;
	}

	return (
		<view className="flex flex-col gap-3">
			{categories.map((category) => {
				const isEditing = editingId === category.id;

				if (isEditing) {
					return renderEditForm(category);
				}

				return (
					<CategoryListItem
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
