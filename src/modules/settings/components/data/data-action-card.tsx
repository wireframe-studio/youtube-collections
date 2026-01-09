import { FC, ReactNode } from 'react';

export const DataActionCard: FC<{
	icon: ReactNode;
	title: string;
	description: string;
	buttonLabel: string;
	buttonIcon: ReactNode;
	onButtonClick: () => void;
	buttonVariant?: 'primary' | 'secondary';
}> = ({
	icon,
	title,
	description,
	buttonLabel,
	buttonIcon,
	onButtonClick,
	buttonVariant = 'primary'
}) => {
	const buttonClasses =
		buttonVariant === 'primary'
			? 'bg-[var(--yt-spec-text-primary)] text-[var(--yt-spec-base-background)] hover:bg-[var(--yt-spec-text-secondary)]'
			: 'bg-[var(--yt-spec-10-percent-layer)] text-[var(--yt-spec-text-primary)] hover:bg-[var(--yt-spec-badge-chip-background)]';

	return (
		<view className="bg-[var(--yt-spec-additive-background)] border border-[var(--yt-spec-outline)] rounded-xl p-6 space-y-4">
			<view className="flex items-start gap-3">
				<view className="p-2 bg-[var(--yt-spec-10-percent-layer)] rounded-lg">
					{icon}
				</view>
				<view className="flex-1">
					<h4 className="text-lg font-semibold text-[var(--yt-spec-text-primary)] mb-1">
						{title}
					</h4>
					<p className="text-sm text-[var(--yt-spec-text-secondary)]">
						{description}
					</p>
				</view>
			</view>
			<button
				onClick={onButtonClick}
				className={`w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${buttonClasses}`}>
				{buttonIcon}
				{buttonLabel}
			</button>
		</view>
	);
};
