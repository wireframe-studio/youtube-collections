import { Database } from 'lucide-react';
import { FC } from 'react';

export const DataHeader: FC = () => {
	return (
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
	);
};
