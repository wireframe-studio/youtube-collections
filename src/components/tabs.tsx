import { createContext, useContext, useState } from 'react';
import { Button } from './button';

const tabsContext = createContext<{
	activeTab: string;
	setActiveTab: (tab: string) => void;
}>({
	activeTab: '',
	setActiveTab: () => {}
});

const useTabs = () => {
	const context = useContext(tabsContext);
	if (!context) {
		throw new Error('useTabs must be used within a TabsProvider');
	}
	return context;
};

export const Tabs = ({
	children,
	defaultValue
}: {
	children: React.ReactNode;
	defaultValue: string;
}) => {
	const [activeTab, setActiveTab] = useState<string>(defaultValue);

	return (
		<tabsContext.Provider
			value={{ activeTab: activeTab, setActiveTab: setActiveTab }}>
			{children}
		</tabsContext.Provider>
	);
};
export const TabsList = ({ children }: { children: React.ReactNode }) => {
	return <view className="flex gap-2 px-8 pt-6 pb-2">{children}</view>;
};
export const TabTrigger = ({
	children,
	value
}: {
	children: React.ReactNode;
	value: string;
}) => {
	const { activeTab, setActiveTab } = useTabs();
	const isActive = activeTab === value;
	return (
		<Button
			onClick={() => setActiveTab(value)}
			variant={isActive ? 'solid-weak' : 'ghost'}
			size="tab">
			{children}
		</Button>
	);
};
export const TabContent = ({
	children,
	value
}: {
	children: React.ReactNode;
	value: string;
}) => {
	const { activeTab } = useTabs();
	const isActive = activeTab === value;

	if (!isActive) return null;

	return children;
};
