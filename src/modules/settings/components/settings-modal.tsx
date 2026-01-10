import { useEffect, useState } from 'react';
import { MainArea } from '../../../components/main-area';
import {
	TabContent,
	Tabs,
	TabsList,
	TabTrigger
} from '../../../components/tabs';
import { getStorageData } from '../../../storage';
import type { Category, Channel } from '../../../types';
import { CategoriesTab } from './categories/categories-tab';
import { ChannelsTab } from './channels/channels-tab';
import { DataTab } from './data/data-tab';
import { ModalHeader } from './modal-header';

interface ModalProps {
	onClose: () => void;
}

export function SettingsModal({ onClose }: ModalProps) {
	const [categories, setCategories] = useState<Category[]>([]);
	const [channels, setChannels] = useState<Channel[]>([]);

	useEffect(() => {
		loadData();
	}, []);

	async function loadData() {
		const data = await getStorageData();
		const sortedCategories = data.categories.sort((a, b) =>
			a.name.localeCompare(b.name)
		);
		setCategories(sortedCategories);
		setChannels(data.channels);
	}

	return (
		<view
			className="fixed inset-0 bg-[var(--yt-overlay-bg-medium)] backdrop-blur-xs flex items-center justify-center z-10000 p-4"
			onClick={onClose}>
			<view
				className="bg-[var(--yt-spec-base-background)] rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl border border-[var(--yt-spec-outline)] mx-4 animate-in zoom-in-95"
				onClick={(e) => e.stopPropagation()}>
				{/* Header */}
				<ModalHeader onClose={onClose} />

				<Tabs defaultValue="categories">
					<MainArea>
						{/* Tabs */}
						<TabsList>
							<TabTrigger value="categories"> Categories </TabTrigger>
							<TabTrigger value="channels"> Channels </TabTrigger>
							<TabTrigger value="data"> Data </TabTrigger>
						</TabsList>

						{/* Content */}
						<TabContent value="categories">
							<CategoriesTab categories={categories} onUpdate={loadData} />
						</TabContent>

						<TabContent value="channels">
							<ChannelsTab
								categories={categories}
								channels={channels}
								onUpdate={loadData}
							/>
						</TabContent>

						<TabContent value="data">
							<DataTab
								categories={categories}
								channels={channels}
								onUpdate={loadData}
							/>
						</TabContent>
					</MainArea>
				</Tabs>
			</view>
		</view>
	);
}
