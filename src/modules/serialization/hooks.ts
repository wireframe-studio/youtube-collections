import { useUploadDialog } from '../../lib/upload/use-upload-dialog';
import { getStorageData, setStorageData } from '../../storage';
import { type Category, type Channel } from '../../types';

export const useSerialization = ({ onUpdate }: { onUpdate: () => void }) => {
	const { openUploadDialog } = useUploadDialog();

	const handleExport = async () => {
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
	};

	const handleImport = async () => {
		await openUploadDialog(handleImportedFile);
	};

	const handleImportedFile = async (files: File[]) => {
		if (files.length === 0) return;

		const file = files[0];
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
		}
	};

	const mergeImportData = async (importData: any) => {
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
	};

	return {
		handleExport,
		handleImport
	};
};
