// LumbrScan — Custom Floating Tab Bar
// Design: Dark forest green pill nav + separate green camera FAB

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const tabs = [
    {
      path: '/',
      icon: 'home-outline' as const,
      activeIcon: 'home' as const,
      label: 'Home',
    },
    {
      path: '/knowledge',
      icon: 'library-outline' as const,
      activeIcon: 'library' as const,
      label: 'Catalog',
    },
    {
      path: '/recommend',
      icon: 'bulb-outline' as const,
      activeIcon: 'bulb' as const,
      label: 'Recommend',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname === '/index' || pathname === '';
    }
    return pathname.startsWith(path);
  };

  const bottomPad = Math.max(insets.bottom, 16);

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPad }]}>
      {/* Floating Pill Navigation */}
      <View style={styles.pill}>
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          return (
            <TouchableOpacity
              key={tab.path}
              style={styles.tabItem}
              onPress={() => router.push(tab.path as never)}
              activeOpacity={0.75}
            >
              <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                <Ionicons
                  name={active ? tab.activeIcon : tab.icon}
                  size={22}
                  color={active ? '#FFFFFF' : '#74C69D'}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Camera / Scan FAB — separated from the pill */}
      <TouchableOpacity
        style={[
          styles.fab,
          pathname.startsWith('/scan') && styles.fabActive,
        ]}
        onPress={() => router.push('/scan' as never)}
        activeOpacity={0.85}
      >
        <Ionicons name="camera" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    gap: 12,
    // No background — purely floating
    pointerEvents: 'box-none',
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1B4332',
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 14,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#2D6A4F',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 14,
    marginBottom: 2,
  },
  fabActive: {
    backgroundColor: '#1B4332',
  },
});
