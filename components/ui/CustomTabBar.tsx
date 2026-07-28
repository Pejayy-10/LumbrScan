// LumbrScan — Custom Floating Tab Bar
// Design: Dark forest green pill nav with 4 tabs + separate green camera FAB

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
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
      path: '/estimator',
      icon: 'calculator-outline' as const,
      activeIcon: 'calculator' as const,
      label: 'Estimator',
    },
    {
      path: '/history',
      icon: 'time-outline' as const,
      activeIcon: 'time' as const,
      label: 'History',
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
                  size={20}
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
        <Ionicons name="camera" size={24} color="#FFFFFF" />
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
    paddingHorizontal: 16,
    gap: 10,
    pointerEvents: 'box-none',
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1B4332',
    borderRadius: 40,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#2D6A4F',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    marginBottom: 2,
  },
  fabActive: {
    backgroundColor: '#1B4332',
  },
});
