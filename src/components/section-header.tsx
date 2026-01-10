import { FC } from 'react';
import { cn } from '../utils/utils';

export const SectionHeader: FC<{
	title: string;
	description?: string;
	children?: React.ReactNode;
	className?: string;
}> = ({ title, description, children, className }) => {
	return (
		<view
			className={cn(
				'flex flex-row items-center justify-between gap-3 px-8',
				className
			)}>
			<view className="flex flex-col gap-3">
				<h3 className="title-2 text-neutral">{title}</h3>

				{description && (
					<p className="body-3 text-neutral-muted">{description}</p>
				)}
			</view>

			{children}
		</view>
	);
};
