import { ExternalLink } from 'lucide-react';
import { FC } from 'react';

export const DataFooter: FC = () => {
	return (
		<view className="text-center pt-4 border-t border-[var(--yt-spec-outline)]">
			<p className="text-sm text-[var(--yt-spec-text-secondary)]">
				Maintained by{' '}
				<a
					href="https://www.wireframe.hr"
					target="_blank"
					rel="noopener noreferrer"
					className="text-[var(--yt-spec-text-primary)] hover:underline font-medium inline-flex items-center gap-1">
					Wireframe Studio
					<ExternalLink className="w-3 h-3" />
				</a>
			</p>
		</view>
	);
};
