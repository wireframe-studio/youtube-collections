import { useEffect, useState } from 'react';
import {
	TabContent,
	Tabs,
	TabsList,
	TabTrigger
} from '../../../components/tabs';
import { getStorageData } from '../../../storage';
import type { Category, Channel } from '../../../types';
import { ModalHeader } from './modal-header';
import { CategoriesTab } from './tabs/categories-tab';
import { ChannelAssignment } from './tabs/channels-tab';
import { DataTab } from './tabs/data-tab';

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
		setCategories(data.categories);
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
					{/* Tabs */}
					<TabsList>
						<TabTrigger value="categories">Your Categories</TabTrigger>
						<TabTrigger value="channels">Channels by Category</TabTrigger>
						<TabTrigger value="data">Data</TabTrigger>
					</TabsList>

					{/* Content */}
					<view className="flex-1 overflow-y-auto px-8 py-6 min-h-0">
						<TabContent value="categories">
							<CategoriesTab categories={categories} onUpdate={loadData} />
						</TabContent>
						<TabContent value="channels">
							<ChannelAssignment
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
					</view>
				</Tabs>
			</view>
		</view>
	);
}
