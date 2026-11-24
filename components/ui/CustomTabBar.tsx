import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../hooks/useAppTheme';

const tabs = [
  { path: '/', route: '/(tabs)', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { path: '/scan', route: '/(tabs)/scan', label: 'Scan', icon: 'scan-outline', activeIcon: 'scan' },
  { path: '/knowledge', route: '/(tabs)/knowledge', label: 'Catalog', icon: 'library-outline', activeIcon: 'library' },
  { path: '/estimator', route: '/(tabs)/estimator', label: 'Estimate', icon: 'calculator-outline', activeIcon: 'calculator' },
  { path: '/history', route: '/(tabs)/history', label: 'History', icon: 'time-outline', activeIcon: 'time' },
] as const;

export function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, paddingBottom: Math.max(insets.bottom, 8) }]}>
      {tabs.map((tab) => {
        const active = tab.path === '/' ? pathname === '/' || pathname === '/index' : pathname.startsWith(tab.path);
        const color = active ? theme.colors.primary : theme.colors.textMuted;
        return (
          <TouchableOpacity
            key={tab.path}
            accessibilityLabel={tab.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            activeOpacity={0.72}
            onPress={() => router.navigate(tab.route as never)}
            style={[styles.tab, active && { backgroundColor: theme.colors.primarySoft }]}
          >
            <Ionicons name={active ? tab.activeIcon : tab.icon} size={21} color={color} />
            <Text numberOfLines={1} style={[styles.tabLabel, { color }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    bottom: 0,
    elevation: 12,
    flexDirection: 'row',
    left: 0,
    minHeight: 68,
    paddingHorizontal: 10,
    paddingTop: 7,
    position: 'absolute',
    right: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tab: { alignItems: 'center', borderRadius: 12, flex: 1, justifyContent: 'center', minHeight: 48 },
  tabLabel: { fontSize: 10, fontWeight: '800', marginTop: 3 },
});
