// LumbrScan Root Layout — Deep Emerald Glassmorphism Theme

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0F281E',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 17,
            color: '#FFFFFF',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#0B1D15',
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
