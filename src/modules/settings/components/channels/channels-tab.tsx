import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/lib/shadcn/ui/select';
import { FC, useMemo, useState } from 'react';
import { SectionHeader } from '../../../../components/section-header';
import type { Category } from '../../../../types';
import {
	useCategories,
	useChannels,
	useCreateCategory,
	useUpdateChannelCategories
} from '../../../data/hooks';
import { ChannelList } from './channel-list';

type FilterType = 'all' | 'unassigned' | string;

export const ChannelsTab: FC = () => {
	const { categories } = useCategories();
	const { channels } = useChannels();
	const createCategoryMutation = useCreateCategory();
	const updateChannelCategoriesMutation = useUpdateChannelCategories();
	const [filter, setFilter] = useState<FilterType>('all');

	const sortedChannels = useMemo(() => {
		return [...channels].sort((a, b) => a.name.localeCompare(b.name));
	}, [channels]);

	const filteredChannels = useMemo(() => {
		if (filter === 'all') return sortedChannels;
		if (filter === 'unassigned') {
			return sortedChannels.filter((ch) => ch.categoryIds.length === 0);
		}
		return sortedChannels.filter((ch) => ch.categoryIds.includes(filter));
	}, [sortedChannels, filter]);

	async function handleCategoryChange(
		channelId: string,
		categoryId: string,
		isChecked: boolean
	) {
		const channel = channels.find((ch) => ch.id === channelId);
		if (!channel) return;

		const newCategoryIds = isChecked
			? [...channel.categoryIds, categoryId]
			: channel.categoryIds.filter((id) => id !== categoryId);

		updateChannelCategoriesMutation.mutate({
			channelId,
			categoryIds: newCategoryIds
		});
	}

	async function handleCategoryCreate(
		channelId: string,
		newCategory: Category
	) {
		createCategoryMutation.mutate(newCategory, {
			onSuccess: () => {
				// After category is created, add it to the channel
				const channel = channels.find((ch) => ch.id === channelId);
				if (channel) {
					const newCategoryIds = [...channel.categoryIds, newCategory.id];
					updateChannelCategoriesMutation.mutate({
						channelId,
						categoryIds: newCategoryIds
					});
				}
			}
		});
	}

	return (
		<>
			<SectionHeader
				title="Your Channels"
				description={`${filteredChannels.length} channel${
					filteredChannels.length !== 1 ? 's' : ''
				}`}>
				<div className="relative">
					<Select
						defaultValue="all"
						onChange={(value) => setFilter(value ?? 'all')}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Filter by category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Filter by category</SelectItem>
							<SelectItem value="unassigned">Unassigned</SelectItem>
							{categories.map((cat) => (
								<SelectItem key={cat.id} value={cat.id}>
									{cat.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</SectionHeader>

			<ChannelList
				channels={filteredChannels}
				categories={categories}
				onChannelUpdate={handleCategoryChange}
				onCategoryCreate={handleCategoryCreate}
			/>
		</>
	);
};
