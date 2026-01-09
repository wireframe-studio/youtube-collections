export const CategoryListEmptyPlaceholder = () => {
	return (
		<view className="text-center py-12 text-neutral-muted flex flex-col gap-3">
			<h3 className="title-2 text-neutral">No categories yet</h3>

			<p className="body-2 text-neutral-muted">
				Create your first category to get started!
			</p>
		</view>
	);
};
