// LumbrScan FPRDI Strength Group Badge — Light Theme

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FprdiGroupCode } from '../../constants/domain';

const GROUP_CONFIG: Record<
  FprdiGroupCode,
  { label: string; color: string; bg: string; border: string }
> = {
  GROUP_I: {
    label: 'FPRDI GROUP I',
    color: '#1B4332',
    bg: '#D1FAE5',
    border: '#6EE7B7',
  },
  GROUP_II: {
    label: 'FPRDI GROUP II',
    color: '#1D4ED8',
    bg: '#DBEAFE',
    border: '#93C5FD',
  },
  GROUP_III: {
    label: 'FPRDI GROUP III',
    color: '#D97706',
    bg: '#FEF3C7',
    border: '#FCD34D',
  },
  GROUP_IV: {
    label: 'FPRDI GROUP IV',
    color: '#DC2626',
    bg: '#FEE2E2',
    border: '#FCA5A5',
  },
};

interface FprdiBadgeProps {
  groupCode: FprdiGroupCode;
  size?: 'sm' | 'md' | 'lg';
}

export function FprdiBadge({ groupCode, size = 'md' }: FprdiBadgeProps) {
  const cfg = GROUP_CONFIG[groupCode];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: cfg.bg, borderColor: cfg.border },
        size === 'sm' && styles.badgeSm,
        size === 'lg' && styles.badgeLg,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: cfg.color },
          size === 'sm' && styles.labelSm,
          size === 'lg' && styles.labelLg,
        ]}
      >
        {cfg.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeLg: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  labelSm: {
    fontSize: 9,
  },
  labelLg: {
    fontSize: 13,
  },
});
