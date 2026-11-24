import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

export function AppButton({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
  loading = false,
  accessibilityLabel,
  style,
}: AppButtonProps) {
  const theme = useAppTheme();
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  const foreground = isPrimary ? theme.colors.textOnStrong : theme.colors.text;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      activeOpacity={0.82}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: isPrimary
            ? theme.colors.primary
            : isGhost
              ? 'transparent'
              : theme.colors.surfaceMuted,
          borderColor: isGhost ? 'transparent' : isPrimary ? theme.colors.primary : theme.colors.border,
          opacity: disabled || loading ? 0.48 : 1,
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={foreground} /> : icon ? <Ionicons name={icon} size={18} color={foreground} /> : null}
      <Text style={[styles.label, { color: foreground }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
  },
  label: { fontSize: 15, fontWeight: '800' },
});
