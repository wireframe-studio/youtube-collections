import { Download, Upload } from 'lucide-react';
import { FC } from 'react';
import type { Category, Channel } from '../../../../types';
import { useSerialization } from '../../../serialization/hooks';
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
	const { handleExport, handleImport } = useSerialization({ onUpdate });

	return (
		<>
			<DataHeader />

			<view className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto w-full">
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
					onButtonClick={handleImport}
					buttonVariant="secondary"
				/>
			</view>

			<DataInfoSection />

			<DataStats
				categoryCount={categories.length}
				channelCount={channels.length}
			/>

			<DataFooter />
		</>
	);
};
