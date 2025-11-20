import { Platform } from 'react-native';

// getApiUrl returns a sensible default depending on the execution environment.
// - Android emulator (Android Studio): use 10.0.2.2
// - iOS simulator and Web: use localhost
// - Physical device with Expo: replace with your machine IP (see README)

export function getApiUrl() {
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000';
  return 'http://localhost:3000';
}

export default getApiUrl;
