// LumbrScan Construction Application Suitability Card — Glassmorphism Theme

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafetyRating } from '../../types';

interface SafetyCardProps {
  title: string;
  safetyRating: SafetyRating;
  rationale: string;
}

export const SafetyCard: React.FC<SafetyCardProps> = ({ title, safetyRating, rationale }) => {
  const getRatingStyle = (rating: SafetyRating) => {
    switch (rating) {
      case 'SAFE':
        return {
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.3)',
          leftBar: '#10B981',
          text: '#74C69D',
          label: 'SAFE APPLICATION',
          icon: 'shield-checkmark' as const,
          iconColor: '#74C69D',
        };
      case 'PERMISSIBLE_WITH_CAUTION':
        return {
          bg: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.3)',
          leftBar: '#F59E0B',
          text: '#FBBF24',
          label: 'PERMISSIBLE WITH CAUTION',
          icon: 'warning' as const,
          iconColor: '#FBBF24',
        };
      case 'HIGH_RISK_NOT_RECOMMENDED':
        return {
          bg: 'rgba(249, 115, 22, 0.12)',
          border: 'rgba(249, 115, 22, 0.3)',
          leftBar: '#F97316',
          text: '#FDBA74',
          label: 'HIGH RISK — NOT RECOMMENDED',
          icon: 'alert-circle' as const,
          iconColor: '#FDBA74',
        };
      case 'PROHIBITED_UNSAFE':
      default:
        return {
          bg: 'rgba(239, 68, 68, 0.12)',
          border: 'rgba(239, 68, 68, 0.3)',
          leftBar: '#EF4444',
          text: '#F87171',
          label: 'PROHIBITED — UNSAFE',
          icon: 'close-circle' as const,
          iconColor: '#F87171',
        };
    }
  };

  const cfg = getRatingStyle(safetyRating);

  return (
    <View style={[styles.card, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
      <View style={[styles.leftBar, { backgroundColor: cfg.leftBar }]} />
      <View style={styles.inner}>
        <View style={styles.headerRow}>
          <Ionicons name={cfg.icon} size={15} color={cfg.iconColor} />
          <Text style={[styles.headerLabel, { color: cfg.text }]}>{cfg.label}</Text>
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.rationaleText}>{rationale}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  leftBar: {
    width: 4,
  },
  inner: {
    flex: 1,
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  rationaleText: {
    color: '#95A99E',
    fontSize: 13,
    lineHeight: 18,
  },
});
