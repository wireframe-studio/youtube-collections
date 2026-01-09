import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/button';
import { getStorageData } from '../../../storage';
import type { Category, Channel } from '../../../types';
import { CategoriesTab } from './tabs/categories-tab';
import { ChannelAssignment } from './tabs/channels-tab';
import { DataTab } from './tabs/data-tab';

interface ModalProps {
	onClose: () => void;
}

type Tab = 'categories' | 'channels' | 'data';

export function SettingsModal({ onClose }: ModalProps) {
	const [activeTab, setActiveTab] = useState<Tab>('categories');
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
				<view className="flex items-center justify-between px-8 py-6 border-b border-[var(--yt-spec-outline)]">
					<h2 className="text-3xl font-bold text-[var(--yt-spec-text-primary)]">
						YouTube Collections
					</h2>
					<button
						onClick={onClose}
						className="p-2.5 hover:bg-[var(--yt-spec-badge-chip-background)] rounded-xl transition-colors group"
						aria-label="Close modal">
						<X className="w-6 h-6 text-[var(--yt-spec-text-secondary)] group-hover:text-[var(--yt-spec-text-primary)] transition-colors" />
					</button>
				</view>

				{/* Tabs */}
				<view className="flex gap-2 px-8 pt-6 pb-2">
					<Button
						onClick={() => setActiveTab('categories')}
						size="tab"
						variant={activeTab === 'categories' ? 'solid-weak' : 'ghost'}>
						Your Categories
					</Button>
					<Button
						onClick={() => setActiveTab('channels')}
						size="tab"
						variant={activeTab === 'channels' ? 'solid-weak' : 'ghost'}>
						Channels by Category
					</Button>
					<Button
						onClick={() => setActiveTab('data')}
						size="tab"
						variant={activeTab === 'data' ? 'solid-weak' : 'ghost'}>
						Data
					</Button>
				</view>

				{/* Content */}
				<view className="flex-1 overflow-y-auto px-8 py-6 min-h-0">
					{activeTab === 'categories' && (
						<CategoriesTab categories={categories} onUpdate={loadData} />
					)}
					{activeTab === 'channels' && (
						<ChannelAssignment
							categories={categories}
							channels={channels}
							onUpdate={loadData}
						/>
					)}
					{activeTab === 'data' && (
						<DataTab
							categories={categories}
							channels={channels}
							onUpdate={loadData}
						/>
					)}
				</view>
			</view>
		</view>
	);
}
