import { FC } from 'react';

export const DataInfoSection: FC = () => {
	return (
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
	);
};
