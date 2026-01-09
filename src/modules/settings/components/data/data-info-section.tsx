import { FC } from 'react';

export const DataInfoSection: FC = () => {
	return (
		<view className="bg-surface rounded-xl p-6 w-full ">
			<h4 className="title-3 text-neutral mb-3">How Import Works</h4>
			<ul className="space-y-2 body-3 text-neutral-muted">
				<li className="flex gap-2">
					<span className="text-neutral">•</span>
					<span>
						New categories from the file will be added to your collection
					</span>
				</li>
				<li className="flex gap-2">
					<span className="text-neutral">•</span>
					<span>
						Channel assignments will be merged (channels can be in multiple
						categories)
					</span>
				</li>
				<li className="flex gap-2">
					<span className="text-neutral">•</span>
					<span>Channels you've unsubscribed from will be ignored</span>
				</li>
				<li className="flex gap-2">
					<span className="text-neutral">•</span>
					<span>Your existing data will never be deleted, only merged</span>
				</li>
			</ul>
		</view>
	);
};
