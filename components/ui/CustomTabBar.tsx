// LumbrScan — Custom Floating Tab Bar
// Design: Dark forest green pill nav with 4 tabs + separate circular green camera FAB

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
              <View style={[styles.iconWrapCircle, active && styles.iconWrapActiveCircle]}>
                <Ionicons
                  name={active ? tab.activeIcon : tab.icon}
                  size={21}
                  color={active ? '#FFFFFF' : '#74C69D'}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Camera / Scan FAB — Perfect Circle */}
      <TouchableOpacity
        style={[
          styles.fabCircle,
          pathname.startsWith('/scan') && styles.fabActiveCircle,
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
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    pointerEvents: 'box-none',
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0F281E',
    borderRadius: 40,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.25)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 14,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapCircle: {
    width: 44,
    height: 44,
    borderRadius: 22, // Perfect circle!
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActiveCircle: {
    backgroundColor: '#2D6A4F',
    shadowColor: '#74C69D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  fabCircle: {
    width: 58,
    height: 58,
    borderRadius: 29, // Perfect circle FAB!
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.3)',
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 14,
  },
  fabActiveCircle: {
    backgroundColor: '#1B4332',
    borderColor: '#74C69D',
  },
});
