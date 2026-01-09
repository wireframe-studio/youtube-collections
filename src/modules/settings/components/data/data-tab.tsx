import { Download, Upload } from 'lucide-react';
import { FC, useRef } from 'react';
import { getStorageData, setStorageData } from '../../../../storage';
import type { Category, Channel } from '../../../../types';
import { DataActionCard } from './data-action-card';
import { DataFooter } from './data-footer';
import { DataHeader } from './data-header';
import { DataInfoSection } from './data-info-section';
import { DataStats } from './data-stats';

export const DataTab: FC<{
	categories: Category[];
	channels: Channel[];
	onUpdate: () => void;
}> = ({ categories, channels, onUpdate }) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	async function handleExport() {
		const data = await getStorageData();
		const exportData = {
			version: '1.0',
			exportDate: new Date().toISOString(),
			categories: data.categories,
			channels: data.channels.map((ch) => ({
				id: ch.id,
				name: ch.name,
				thumbnailUrl: ch.thumbnailUrl,
				categoryIds: ch.categoryIds
			}))
		};

		const blob = new Blob([JSON.stringify(exportData, null, 2)], {
			type: 'application/json'
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `youtube-collections-${
			new Date().toISOString().split('T')[0]
		}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();
			const importData = JSON.parse(text);

			if (!importData.categories || !importData.channels) {
				alert('Invalid file format. Please select a valid export file.');
				return;
			}

			await mergeImportData(importData);
			onUpdate();
			alert('Data imported successfully!');
		} catch (error) {
			console.error('Import error:', error);
			alert('Failed to import data. Please check the file format.');
		} finally {
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	}

	async function mergeImportData(importData: any) {
		const currentData = await getStorageData();

		const existingChannelIds = new Set(currentData.channels.map((ch) => ch.id));

		const categoryMap = new Map<string, Category>();

		currentData.categories.forEach((cat) => {
			categoryMap.set(cat.id, cat);
		});

		importData.categories.forEach((cat: Category) => {
			if (!categoryMap.has(cat.id)) {
				categoryMap.set(cat.id, cat);
			}
		});

		const mergedCategories = Array.from(categoryMap.values());

		const channelMap = new Map<string, Channel>();

		currentData.channels.forEach((ch) => {
			channelMap.set(ch.id, { ...ch });
		});

		importData.channels.forEach((importedCh: Channel) => {
			if (existingChannelIds.has(importedCh.id)) {
				const existingChannel = channelMap.get(importedCh.id);
				if (existingChannel) {
					const mergedCategoryIds = new Set([
						...existingChannel.categoryIds,
						...importedCh.categoryIds
					]);

					const validCategoryIds = Array.from(mergedCategoryIds).filter(
						(catId) => categoryMap.has(catId)
					);

					existingChannel.categoryIds = validCategoryIds;
				}
			}
		});

		const mergedChannels = Array.from(channelMap.values());

		await setStorageData({
			categories: mergedCategories,
			channels: mergedChannels
		});
	}

	return (
		<view className="flex flex-col gap-8">
			<DataHeader />

			<view className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
				<DataActionCard
					icon={
						<Download className="w-5 h-5 text-[var(--yt-spec-text-primary)]" />
					}
					title="Export"
					description="Download your categories and channel assignments as a JSON file."
					buttonLabel="Export Data"
					buttonIcon={<Download className="w-4 h-4" />}
					onButtonClick={handleExport}
					buttonVariant="primary"
				/>

				<DataActionCard
					icon={
						<Upload className="w-5 h-5 text-[var(--yt-spec-text-primary)]" />
					}
					title="Import"
					description="Upload a JSON file to merge with your existing collections."
					buttonLabel="Import Data"
					buttonIcon={<Upload className="w-4 h-4" />}
					onButtonClick={() => fileInputRef.current?.click()}
					buttonVariant="secondary"
				/>
			</view>

			<input
				ref={fileInputRef}
				type="file"
				accept=".json"
				onChange={handleImport}
				className="hidden"
				id="import-file-input"
			/>

			<DataInfoSection />

			<DataStats
				categoryCount={categories.length}
				channelCount={channels.length}
			/>

			<DataFooter />
		</view>
	);
};
