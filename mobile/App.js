import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import checkSpotifySetup from './src/utils/setupChecker';

export default function App() {
  useEffect(() => {
    // Check Spotify setup on app start
    if (__DEV__) {
      console.log('\n🎵 Spotify Mobile App iniciando...\n');
      checkSpotifySetup();
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AppNavigator />
    </View>
  );
}
