import { registerRootComponent } from 'expo';

import App from './App';

const globalErrorUtils = (globalThis as { ErrorUtils?: { getGlobalHandler?: () => ((error: unknown, isFatal?: boolean) => void) | undefined; setGlobalHandler?: (handler: (error: unknown, isFatal?: boolean) => void) => void } }).ErrorUtils;
if (globalErrorUtils?.setGlobalHandler) {
  const originalHandler = globalErrorUtils.getGlobalHandler?.();
  globalErrorUtils.setGlobalHandler((error, isFatal) => {
    originalHandler?.(error, isFatal);
  });
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
