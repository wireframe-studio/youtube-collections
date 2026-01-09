import { FC, ReactNode } from 'react';
import { Button } from '../../../../components/button';

export const DataActionCard: FC<{
	icon: ReactNode;
	title: string;
	description: string;
	buttonLabel: string;
	buttonIcon: ReactNode;
	onButtonClick: () => void;
	buttonVariant?: 'solid' | 'solid-weak' | 'ghost' | 'outline';
}> = ({
	icon,
	title,
	description,
	buttonLabel,
	buttonIcon,
	onButtonClick,
	buttonVariant = 'solid'
}) => {
	return (
		<view className="bg-surface rounded-xl p-6 space-y-4">
			<view className="flex items-start gap-3">
				<view className="p-3 bg-surface-muted rounded-lg">{icon}</view>
				<view className="flex-1">
					<h4 className="title-3 text-neutral mb-1">{title}</h4>
					<p className="body-3 text-neutral-muted">{description}</p>
				</view>
			</view>
			<Button onClick={onButtonClick} variant={buttonVariant}>
				{buttonIcon}
				{buttonLabel}
			</Button>
		</view>
	);
};
