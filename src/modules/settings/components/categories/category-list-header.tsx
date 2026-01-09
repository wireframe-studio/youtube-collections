import { Plus } from 'lucide-react';
import { FC } from 'react';
import { Button } from '../../../../components/button';

export const CategoryListHeader: FC<{
	onCreateClick: () => void;
	isCreating: boolean;
}> = ({ onCreateClick, isCreating }) => {
	return (
		<view className="flex items-center justify-between">
			<h3 className="title-2 text-neutral">Your Categories</h3>
			<Button onClick={onCreateClick} variant="outline" size="md">
				New Category
				<Plus />
			</Button>
		</view>
	);
};
