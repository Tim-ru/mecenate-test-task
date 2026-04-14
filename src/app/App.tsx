import { StatusBar } from 'expo-status-bar';
import { AppProviders } from '@/app/providers/AppProviders';
import { FeedScreen } from '@/screens/feed/FeedScreen';

export function App() {
  return (
    <AppProviders>
      <FeedScreen />
      <StatusBar style="auto" />
    </AppProviders>
  );
}
