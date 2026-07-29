// LumbrScan — Custom Floating Tab Bar
// TripGlide Sample Aesthetic: Dark Charcoal Pill (#1A1D1F) + Animated Sliding White Circle Indicator + Camera FAB

import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, LayoutChangeEvent } from 'react-native';
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

  const getActiveIndex = () => {
    if (pathname === '/' || pathname === '/index' || pathname === '') return 0;
    if (pathname.startsWith('/knowledge')) return 1;
    if (pathname.startsWith('/estimator')) return 2;
    if (pathname.startsWith('/history')) return 3;
    return -1;
  };

  const activeIndex = getActiveIndex();

  // Layout measurement for smooth sliding active indicator
  const [pillWidth, setPillWidth] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const tabWidth = pillWidth > 0 ? pillWidth / tabs.length : 0;

  useEffect(() => {
    if (activeIndex >= 0 && tabWidth > 0) {
      Animated.spring(slideAnim, {
        toValue: activeIndex * tabWidth + (tabWidth - 44) / 2,
        useNativeDriver: true,
        friction: 8,
        tension: 60,
      }).start();
    }
  }, [activeIndex, tabWidth]);

  const handlePillLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setPillWidth(width);
  };

  const bottomPad = Math.max(insets.bottom, 16);

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPad }]}>
      {/* Floating Pill Navigation Bar */}
      <View style={styles.pill} onLayout={handlePillLayout}>
        {/* Animated Sliding White Circular Pill */}
        {activeIndex >= 0 && tabWidth > 0 && (
          <Animated.View
            style={[
              styles.slidingIndicator,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          />
        )}

        {tabs.map((tab, idx) => {
          const active = activeIndex === idx;
          return (
            <TouchableOpacity
              key={tab.path}
              style={styles.tabItem}
              onPress={() => router.push(tab.path as never)}
              activeOpacity={0.8}
            >
              <View style={styles.iconWrapCircle}>
                <Ionicons
                  name={active ? tab.activeIcon : tab.icon}
                  size={21}
                  color={active ? '#1A1D1F' : '#9CA3AF'}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Camera / Scan FAB — TripGlide Dark Circular FAB */}
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
    paddingHorizontal: 20,
    gap: 12,
    pointerEvents: 'box-none',
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1A1D1F', // TripGlide Charcoal Pill
    borderRadius: 36,
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  slidingIndicator: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22, // White Circular Selection Pill
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconWrapCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1A1D1F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  fabActiveCircle: {
    backgroundColor: '#10B981',
    borderColor: '#FFFFFF',
  },
});
