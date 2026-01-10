import { QueryProvider } from '../modules/data/query-provider';
import { FeedSection } from '../modules/feed/components/feed-section';

export const App = () => {
	return (
		<QueryProvider>
			<FeedSection />
		</QueryProvider>
	);
};
