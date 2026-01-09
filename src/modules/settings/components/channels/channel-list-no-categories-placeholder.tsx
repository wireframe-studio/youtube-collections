export const ChannelListNoCategoriesPlaceholder = () => {
	return (
		<view className="text-center py-12 text-neutral-muted flex flex-col gap-3">
			<h3 className="title-2 text-neutral"> No categories available</h3>

			<p className="body-2 text-neutral-muted">
				Create categories first to assign channels.
			</p>
		</view>
	);
};
