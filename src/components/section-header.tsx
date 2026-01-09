import { FC } from 'react';

export const SectionHeader: FC<{
	title: string;
	description?: string;
	children?: React.ReactNode;
}> = ({ title, description, children }) => {
	return (
		<view className="flex flex-row items-center justify-between gap-3 px-8">
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
