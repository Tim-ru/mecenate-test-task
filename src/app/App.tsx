import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppProviders } from '@/app/providers/AppProviders';
import { env } from '@/shared/config/env';

export function App() {
  const apiHost = new URL(env.apiBaseUrl).host;

  return (
    <AppProviders>
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Mecenate Feed</Text>
        <Text style={styles.caption}>API: {apiHost}</Text>
        <StatusBar style="auto" />
      </SafeAreaView>
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
  caption: {
    marginTop: 8,
    fontSize: 13,
    color: '#6b7280',
  },
});
