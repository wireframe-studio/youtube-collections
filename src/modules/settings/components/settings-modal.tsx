import { MainArea } from '../../../components/main-area';
import {
	TabContent,
	Tabs,
	TabsList,
	TabTrigger
} from '../../../components/tabs';
import { CategoriesTab } from './categories/categories-tab';
import { ChannelsTab } from './channels/channels-tab';
import { DataTab } from './data/data-tab';
import { ModalHeader } from './modal-header';

interface ModalProps {
	onClose: () => void;
}

export function SettingsModal({ onClose }: ModalProps) {
	return (
		<view
			className="fixed inset-0 bg-overlay backdrop-blur-xs flex items-center justify-center z-10000 p-4"
			onClick={onClose}>
			<view
				className="bg-foreground rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl border border-divider mx-4 animate-in zoom-in-95"
				onClick={(e) => e.stopPropagation()}>
				{/* Header */}
				<ModalHeader onClose={onClose} />

				<Tabs defaultValue="categories">
					<MainArea>
						{/* Tabs */}
						<TabsList>
							<TabTrigger value="categories"> Categories </TabTrigger>
							<TabTrigger value="channels"> Channels </TabTrigger>
							<TabTrigger value="data"> Data </TabTrigger>
						</TabsList>

						{/* Content */}
						<TabContent value="categories">
							<CategoriesTab />
						</TabContent>

						<TabContent value="channels">
							<ChannelsTab />
						</TabContent>

						<TabContent value="data">
							<DataTab />
						</TabContent>
					</MainArea>
				</Tabs>
			</view>
		</view>
	);
}
