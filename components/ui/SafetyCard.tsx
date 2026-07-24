// LumbrScan Construction Application Suitability Card Component

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
          bg: '#0596691A',
          border: '#059669',
          text: '#059669',
          label: '✅ SAFE APPLICATION',
        };
      case 'PERMISSIBLE_WITH_CAUTION':
        return {
          bg: '#D977061A',
          border: '#D97706',
          text: '#D97706',
          label: '⚠️ PERMISSIBLE WITH CAUTION',
        };
      case 'HIGH_RISK_NOT_RECOMMENDED':
        return {
          bg: '#EA580C1A',
          border: '#EA580C',
          text: '#EA580C',
          label: '🟧 HIGH RISK - NOT RECOMMENDED',
        };
      case 'PROHIBITED_UNSAFE':
      default:
        return {
          bg: '#DC26261A',
          border: '#DC2626',
          text: '#DC2626',
          label: '🚫 PROHIBITED - UNSAFE',
        };
    }
  };

  const styleConfig = getRatingStyle(safetyRating);

  return (
    <View style={[styles.card, { borderColor: styleConfig.border, backgroundColor: '#1E293B' }]}>
      <View style={[styles.headerBadge, { backgroundColor: styleConfig.bg }]}>
        <Text style={[styles.headerLabel, { color: styleConfig.text }]}>
          {styleConfig.label}
        </Text>
      </View>

      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.rationaleText}>{rationale}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  headerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  rationaleText: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
  },
});
