import { X } from 'lucide-react';
import { FC } from 'react';

import { Button } from '../../../components/button';

export const ModalHeader: FC<{ onClose: () => void }> = ({ onClose }) => {
	return (
		<view className="flex items-center justify-between px-8 py-6 border-b border-divider">
			<view className="flex flex-row gap-2">
				<h2 className="title-2 text-neutral">YouTube Collections</h2>

				<view className="px-2 py-1 caption text-white bg-red-500 rounded-md h-fit">
					BETA
				</view>
			</view>

			<Button onClick={onClose} size="icon" variant="ghost">
				<X />
			</Button>
		</view>
	);
};
