import { X } from 'lucide-react';
import { FC } from 'react';

import { Button } from '../../../components/button';

export const ModalHeader: FC<{ onClose: () => void }> = ({ onClose }) => {
	return (
		<view className="flex items-center justify-between px-8 py-6 border-b border-[var(--yt-spec-outline)]">
			<h2 className="title-2 text-neutral">YouTube Collections</h2>
			<Button onClick={onClose} size="icon" variant="ghost">
				<X />
			</Button>
		</view>
	);
};
