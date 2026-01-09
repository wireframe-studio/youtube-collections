import { Database, Download, ExternalLink, Upload } from 'lucide-react';
import { useRef } from 'react';
import { getStorageData, setStorageData } from '../../../../storage';
import type { Category, Channel } from '../../../../types';

interface DataManagementProps {
	categories: Category[];
	channels: Channel[];
	onUpdate: () => void;
}

export function DataTab({
	categories,
	channels,
	onUpdate
}: DataManagementProps) {
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
			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	}

	async function mergeImportData(importData: any) {
		const currentData = await getStorageData();

		// Get current channel IDs (channels that exist locally)
		const existingChannelIds = new Set(currentData.channels.map((ch) => ch.id));

		// Merge categories: Add new categories, keep existing ones
		const categoryMap = new Map<string, Category>();

		// Add existing categories first
		currentData.categories.forEach((cat) => {
			categoryMap.set(cat.id, cat);
		});

		// Add/merge imported categories
		importData.categories.forEach((cat: Category) => {
			if (!categoryMap.has(cat.id)) {
				// New category, add it
				categoryMap.set(cat.id, cat);
			}
			// If category exists, keep the existing one (no overwrite)
		});

		const mergedCategories = Array.from(categoryMap.values());

		// Merge channel category assignments
		const channelMap = new Map<string, Channel>();

		// Add existing channels
		currentData.channels.forEach((ch) => {
			channelMap.set(ch.id, { ...ch });
		});

		// Merge imported channel assignments
		importData.channels.forEach((importedCh: Channel) => {
			// Only process if channel exists locally
			if (existingChannelIds.has(importedCh.id)) {
				const existingChannel = channelMap.get(importedCh.id);
				if (existingChannel) {
					// Merge category IDs (union of both sets)
					const mergedCategoryIds = new Set([
						...existingChannel.categoryIds,
						...importedCh.categoryIds
					]);

					// Only keep category IDs that exist in our merged categories
					const validCategoryIds = Array.from(mergedCategoryIds).filter(
						(catId) => categoryMap.has(catId)
					);

					existingChannel.categoryIds = validCategoryIds;
				}
			}
			// If channel doesn't exist locally, ignore it (as per requirements)
		});

		const mergedChannels = Array.from(channelMap.values());

		// Save merged data
		await setStorageData({
			categories: mergedCategories,
			channels: mergedChannels
		});
	}

	return (
		<view className="flex flex-col gap-8">
			{/* Header Section */}
			<view className="text-center space-y-3">
				<view className="flex justify-center">
					<view className="p-4 bg-[var(--yt-spec-additive-background)] rounded-2xl">
						<Database className="w-12 h-12 text-[var(--yt-spec-text-primary)]" />
					</view>
				</view>
				<h3 className="text-2xl font-semibold text-[var(--yt-spec-text-primary)]">
					Manage Your Data
				</h3>
				<p className="text-[var(--yt-spec-text-secondary)] max-w-xl mx-auto">
					Export your collections to back them up or share with others. Import
					data to restore or merge collections across devices.
				</p>
			</view>

			{/* Actions */}
			<view className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
				{/* Export Card */}
				<view className="bg-[var(--yt-spec-additive-background)] border border-[var(--yt-spec-outline)] rounded-xl p-6 space-y-4">
					<view className="flex items-start gap-3">
						<view className="p-2 bg-[var(--yt-spec-10-percent-layer)] rounded-lg">
							<Download className="w-5 h-5 text-[var(--yt-spec-text-primary)]" />
						</view>
						<view className="flex-1">
							<h4 className="text-lg font-semibold text-[var(--yt-spec-text-primary)] mb-1">
								Export
							</h4>
							<p className="text-sm text-[var(--yt-spec-text-secondary)]">
								Download your categories and channel assignments as a JSON file.
							</p>
						</view>
					</view>
					<button
						onClick={handleExport}
						className="w-full px-4 py-3 bg-[var(--yt-spec-text-primary)] text-[var(--yt-spec-base-background)] rounded-lg font-medium hover:bg-[var(--yt-spec-text-secondary)] transition-colors flex items-center justify-center gap-2">
						<Download className="w-4 h-4" />
						Export Data
					</button>
				</view>

				{/* Import Card */}
				<view className="bg-[var(--yt-spec-additive-background)] border border-[var(--yt-spec-outline)] rounded-xl p-6 space-y-4">
					<view className="flex items-start gap-3">
						<view className="p-2 bg-[var(--yt-spec-10-percent-layer)] rounded-lg">
							<Upload className="w-5 h-5 text-[var(--yt-spec-text-primary)]" />
						</view>
						<view className="flex-1">
							<h4 className="text-lg font-semibold text-[var(--yt-spec-text-primary)] mb-1">
								Import
							</h4>
							<p className="text-sm text-[var(--yt-spec-text-secondary)]">
								Upload a JSON file to merge with your existing collections.
							</p>
						</view>
					</view>
					<input
						ref={fileInputRef}
						type="file"
						accept=".json"
						onChange={handleImport}
						className="hidden"
						id="import-file-input"
					/>
					<button
						onClick={() => fileInputRef.current?.click()}
						className="w-full px-4 py-3 bg-[var(--yt-spec-10-percent-layer)] text-[var(--yt-spec-text-primary)] rounded-lg font-medium hover:bg-[var(--yt-spec-badge-chip-background)] transition-colors flex items-center justify-center gap-2">
						<Upload className="w-4 h-4" />
						Import Data
					</button>
				</view>
			</view>

			{/* Info Section */}
			<view className="bg-[var(--yt-spec-additive-background)] border border-[var(--yt-spec-outline)] rounded-xl p-6 max-w-2xl mx-auto w-full">
				<h4 className="text-base font-semibold text-[var(--yt-spec-text-primary)] mb-3">
					How Import Works
				</h4>
				<ul className="space-y-2 text-sm text-[var(--yt-spec-text-secondary)]">
					<li className="flex gap-2">
						<span className="text-[var(--yt-spec-text-primary)]">•</span>
						<span>
							New categories from the file will be added to your collection
						</span>
					</li>
					<li className="flex gap-2">
						<span className="text-[var(--yt-spec-text-primary)]">•</span>
						<span>
							Channel assignments will be merged (channels can be in multiple
							categories)
						</span>
					</li>
					<li className="flex gap-2">
						<span className="text-[var(--yt-spec-text-primary)]">•</span>
						<span>Channels you've unsubscribed from will be ignored</span>
					</li>
					<li className="flex gap-2">
						<span className="text-[var(--yt-spec-text-primary)]">•</span>
						<span>Your existing data will never be deleted, only merged</span>
					</li>
				</ul>
			</view>

			{/* Stats */}
			<view className="bg-[var(--yt-spec-additive-background)] border border-[var(--yt-spec-outline)] rounded-xl p-6 max-w-2xl mx-auto w-full">
				<h4 className="text-base font-semibold text-[var(--yt-spec-text-primary)] mb-4">
					Current Statistics
				</h4>
				<view className="grid grid-cols-2 gap-6">
					<view className="text-center">
						<view className="text-3xl font-bold text-[var(--yt-spec-text-primary)]">
							{categories.length}
						</view>
						<view className="text-sm text-[var(--yt-spec-text-secondary)] mt-1">
							{categories.length === 1 ? 'Category' : 'Categories'}
						</view>
					</view>
					<view className="text-center">
						<view className="text-3xl font-bold text-[var(--yt-spec-text-primary)]">
							{channels.length}
						</view>
						<view className="text-sm text-[var(--yt-spec-text-secondary)] mt-1">
							{channels.length === 1 ? 'Channel' : 'Channels'}
						</view>
					</view>
				</view>
			</view>

			{/* Credits */}
			<view className="text-center pt-4 border-t border-[var(--yt-spec-outline)]">
				<p className="text-sm text-[var(--yt-spec-text-secondary)]">
					Maintained by{' '}
					<a
						href="https://www.wireframe.hr"
						target="_blank"
						rel="noopener noreferrer"
						className="text-[var(--yt-spec-text-primary)] hover:underline font-medium inline-flex items-center gap-1">
						Wireframe Studio
						<ExternalLink className="w-3 h-3" />
					</a>
				</p>
			</view>
		</view>
	);
}
