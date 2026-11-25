// LumbrScan Root Layout — TripGlide Soft Light Theme

import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAppTheme } from "../hooks/useAppTheme";

export default function RootLayout() {
  const theme = useAppTheme();

  return (
    <SafeAreaProvider>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 17,
            color: theme.colors.text,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.colors.canvas,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen
          name="species/[id]"
          options={{
            title: "Species reference",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="grading/[id]"
          options={{
            title: "Structural grading",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="history/[id]"
          options={{
            title: "Scan history",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
