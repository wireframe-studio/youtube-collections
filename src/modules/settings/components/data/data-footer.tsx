import { FC } from 'react';

export const DataFooter: FC = () => {
	return (
		<view className="text-center p-4 border-t border-t-divider">
			<p className="body-3 text-neutral-muted">
				Maintained by{' '}
				<a
					href="https://www.wireframe.hr"
					target="_blank"
					rel="noopener noreferrer"
					className="text-neutral hover:underline">
					Wireframe Studio
				</a>
			</p>
		</view>
	);
};
