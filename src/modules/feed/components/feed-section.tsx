import { Settings } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../components/button';
import { SettingsModal } from '../../settings/components/settings-modal';
import { CategoryToggler } from './category-toggler';

export const FeedSection = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<view className="w-full pt-[24px] flex flex-col">
				<view className="title-2 text-neutral mx-(--yt-offset)">
					Categories
				</view>

				<view className="flex items-center gap-4 w-full justify-between pr-(--yt-offset)">
					<CategoryToggler />

					<Button
						onClick={() => setIsModalOpen(true)}
						variant="solid-weak"
						size="icon"
						className="shrink-0">
						<Settings />
					</Button>
				</view>
			</view>

			{isModalOpen && <SettingsModal onClose={() => setIsModalOpen(false)} />}
		</>
	);
};
