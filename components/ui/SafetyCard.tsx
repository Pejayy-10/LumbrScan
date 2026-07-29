// LumbrScan Construction Application Suitability Card — TripGlide Light Aesthetic

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
          border: '#A7F3D0',
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
          leftBar: '#F59E0B',
          text: '#92400E',
          label: 'PERMISSIBLE WITH CAUTION',
          icon: 'warning' as const,
          iconColor: '#F59E0B',
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
          border: '#FECACA',
          leftBar: '#EF4444',
          text: '#991B1B',
          label: 'PROHIBITED — UNSAFE',
          icon: 'close-circle' as const,
          iconColor: '#EF4444',
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
    borderRadius: 20,
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
    color: '#1A1D1F',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  rationaleText: {
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 18,
  },
});
