import { FC } from 'react';
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
			<view className="flex items-center gap-3">
				<label className="text-sm font-medium text-white/70">Filter by:</label>
				<select
					value={filter}
					onChange={(e) => onFilterChange(e.target.value)}
					className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all min-w-[160px]">
					<option value="all">All channels</option>
					<option value="unassigned">Unassigned</option>
					{categories.map((cat) => (
						<option key={cat.id} value={cat.id}>
							{cat.name}
						</option>
					))}
				</select>
			</view>
			<span className="text-sm text-white/50 font-medium">
				{channelCount} channel{channelCount !== 1 ? 's' : ''}
			</span>
		</view>
	);
};
