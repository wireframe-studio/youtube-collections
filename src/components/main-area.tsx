export const MainArea = ({ children }: { children: React.ReactNode }) => {
	return (
		<view className="flex flex-col gap-6 max-h-[50vh] overflow-y-auto py-6">
			{children}
		</view>
	);
};
