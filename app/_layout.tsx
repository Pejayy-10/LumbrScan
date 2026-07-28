// LumbrScan Root Layout — Light Nature Theme

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#1B4332',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 17,
            color: '#1B4332',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#F4F8F5',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="species/[id]"
          options={{
            title: 'Species Profile & Compliance',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="history/[id]"
          options={{
            title: 'Inspection History Log',
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
