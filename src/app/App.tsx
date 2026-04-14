import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppProviders } from '@/app/providers/AppProviders';
import { env } from '@/shared/config/env';
import { colors, spacing } from '@/shared/theme/tokens';
import { Button, ErrorState, Screen, Text } from '@/shared/ui';

export function App() {
  const apiHost = new URL(env.apiBaseUrl).host;
  const [showErrorPreview, setShowErrorPreview] = useState(false);

  return (
    <AppProviders>
      <Screen style={styles.container}>
        <Text variant="title">Mecenate Feed</Text>
        <Text variant="caption" color={colors.textSecondary}>
          API: {apiHost}
        </Text>
        <View style={styles.previewToggle}>
          <Button
            title={showErrorPreview ? 'Hide ErrorState Preview' : 'Show ErrorState Preview'}
            onPress={() => setShowErrorPreview((value) => !value)}
          />
        </View>
        {showErrorPreview ? (
          <ErrorState
            message="Unable to load posts preview"
            onRetry={() => setShowErrorPreview(false)}
            retryLabel="Retry"
            style={styles.errorState}
          />
        ) : null}
        <StatusBar style="auto" />
      </Screen>
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  previewToggle: {
    marginTop: spacing.lg,
  },
  errorState: {
    marginTop: spacing.xl,
    width: '100%',
  },
});
