import { FC } from 'react';
import { buttonVariants } from '../../../../components/button';
import type { Category } from '../../../../types';

type FilterType = 'all' | 'unassigned' | string;

export const ChannelListHeader: FC<{
	categories: Category[];
	filter: FilterType;
	onFilterChange: (filter: FilterType) => void;
	channelCount: number;
}> = ({ categories, filter, onFilterChange, channelCount }) => {
	return (
		<view className="flex items-center justify-between gap-4 flex-wrap">
			<view className="flex flex-col gap-0">
				<h3 className="title-2 text-neutral">Your channels</h3>
				<p className="body-3 text-neutral-muted">
					{channelCount} channel{channelCount !== 1 ? 's' : ''}
				</p>
			</view>

			<view className="flex items-center gap-3">
				<select
					value={filter}
					onChange={(e) => onFilterChange(e.target.value)}
					className={buttonVariants({
						variant: 'outline',
						size: 'md',
						className: 'min-w-[160px]'
					})}>
					<option value="all">All channels</option>
					<option value="unassigned">Unassigned</option>
					{categories.map((cat) => (
						<option key={cat.id} value={cat.id}>
							{cat.name}
						</option>
					))}
				</select>
			</view>
		</view>
	);
};
