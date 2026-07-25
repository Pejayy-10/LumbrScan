// LumbrScan Construction Application Suitability Card — Light Theme

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
          bg: '#ECFDF5',
          border: '#6EE7B7',
          leftBar: '#10B981',
          text: '#065F46',
          label: 'SAFE APPLICATION',
          icon: 'shield-checkmark' as const,
          iconColor: '#10B981',
        };
      case 'PERMISSIBLE_WITH_CAUTION':
        return {
          bg: '#FFFBEB',
          border: '#FCD34D',
          leftBar: '#D97706',
          text: '#92400E',
          label: 'PERMISSIBLE WITH CAUTION',
          icon: 'warning' as const,
          iconColor: '#D97706',
        };
      case 'HIGH_RISK_NOT_RECOMMENDED':
        return {
          bg: '#FFF7ED',
          border: '#FDBA74',
          leftBar: '#EA580C',
          text: '#9A3412',
          label: 'HIGH RISK — NOT RECOMMENDED',
          icon: 'alert-circle' as const,
          iconColor: '#EA580C',
        };
      case 'PROHIBITED_UNSAFE':
      default:
        return {
          bg: '#FEF2F2',
          border: '#FCA5A5',
          leftBar: '#DC2626',
          text: '#991B1B',
          label: 'PROHIBITED — UNSAFE',
          icon: 'close-circle' as const,
          iconColor: '#DC2626',
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
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
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
    color: '#1B4332',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  rationaleText: {
    color: '#52796F',
    fontSize: 13,
    lineHeight: 18,
  },
});
