import { Database } from 'lucide-react';
import { FC } from 'react';

export const DataHeader: FC = () => {
	return (
		<view className="text-center flex flex-col gap-3 px-8">
			<view className="flex justify-center">
				<view className="p-4 bg-surface-muted rounded-2xl">
					<Database className="w-12 h-12 text-neutral" />
				</view>
			</view>

			<h3 className="title-3 text-neutral">Manage Your Data</h3>

			<p className="body-3 text-neutral-muted">
				Export your collections to back them up or share with others. Import
				data to restore or merge collections across devices.
			</p>
		</view>
	);
};
