export const CategoryListEmptyPlaceholder = () => {
	return (
		<view className="text-center text-neutral-muted flex flex-col gap-3 bg-surface rounded-xl p-12">
			<h3 className="title-2 text-neutral">No categories yet</h3>

			<p className="body-2 text-neutral-muted">
				Create your first category to get started!
			</p>
		</view>
	);
};
