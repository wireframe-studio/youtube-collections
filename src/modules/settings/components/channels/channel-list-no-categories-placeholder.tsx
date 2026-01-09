export const ChannelListNoCategoriesPlaceholder = () => {
	return (
		<view className="text-center text-neutral-muted flex flex-col gap-3 bg-surface rounded-xl p-12">
			<h3 className="title-2 text-neutral"> No categories available</h3>

			<p className="body-2 text-neutral-muted">
				Create categories first to assign channels.
			</p>
		</view>
	);
};
