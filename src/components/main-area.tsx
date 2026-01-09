export const MainArea = ({ children }: { children: React.ReactNode }) => {
	return (
		<view className="flex flex-col gap-8 max-h-[50vh] overflow-y-auto py-10">
			{children}
		</view>
	);
};
