// LumbrScan Root Layout — TripGlide Soft Light Theme

import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../stores/useOnboardingStore';

export default function RootLayout() {
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#1A1D1F',
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 17,
            color: '#1A1D1F',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#F4F6F8',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
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
