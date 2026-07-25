// LumbrScan Main Tab Layout — Custom Floating Tab Bar

import React from 'react';
import { Tabs } from 'expo-router';
import { CustomTabBar } from '../../components/ui/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => <CustomTabBar />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="scan" options={{ title: 'Scan & Assess' }} />
      <Tabs.Screen name="knowledge" options={{ title: 'Knowledge Base' }} />
      <Tabs.Screen name="recommend" options={{ title: 'Two-Way Recommender' }} />
    </Tabs>
  );
}
