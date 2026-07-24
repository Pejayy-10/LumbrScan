// LumbrScan Main Tab Layout

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#D97706', // Timber Amber
        tabBarInactiveTintColor: '#64748B', // Slate 500
        tabBarStyle: {
          backgroundColor: '#1E293B', // Slate 800
          borderTopColor: '#334155',
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        headerStyle: {
          backgroundColor: '#0F172A',
        },
        headerTintColor: '#F8FAFC',
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 18,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'LumbrScan',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan & Assess',
          tabBarLabel: 'Scan',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="scan-helper" size={size + 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="knowledge"
        options={{
          title: 'Knowledge Base',
          tabBarLabel: 'Catalog',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recommend"
        options={{
          title: 'Two-Way Recommender',
          tabBarLabel: 'Recommend',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="swap-horizontal-bold" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
