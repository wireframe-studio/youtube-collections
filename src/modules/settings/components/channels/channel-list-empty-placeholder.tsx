export const ChannelListEmptyPlaceholder = () => {
	return (
		<view className="text-center py-12 text-neutral-muted flex flex-col gap-3">
			<h3 className="title-2 text-neutral">No channels detected yet</h3>

			<p className="body-2 text-neutral-muted">
				Visit YouTube's{' '}
				<a
					href="https://www.youtube.com/feed/channels"
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-400 hover:text-blue-300 underline">
					Subscriptions page
				</a>{' '}
				to scan your channels.
			</p>
		</view>
	);
};
