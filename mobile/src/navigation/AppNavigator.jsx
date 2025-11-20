import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../pages/Home';
import Artists from '../pages/Artists';
import Songs from '../pages/Songs';
import Song from '../pages/Song';
import Artist from '../pages/Artist';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Artists" component={Artists} />
        <Stack.Screen name="Songs" component={Songs} />
        <Stack.Screen name="Song" component={Song} />
        <Stack.Screen name="Artist" component={Artist} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
