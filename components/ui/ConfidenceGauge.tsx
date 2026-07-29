// LumbrScan AI Species Match Confidence Gauge Component
// TripGlide Light & Dark Pill Aesthetic

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ConfidenceGaugeProps {
  confidenceScore: number;
  speciesName: string;
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({
  confidenceScore,
  speciesName,
}) => {
  const percentage = Math.round(confidenceScore * 100);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: percentage,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [confidenceScore]);

  const getScoreColor = (score: number) => {
    if (score >= 0.85) return '#10B981';
    if (score >= 0.65) return '#F59E0B';
    return '#DC2626';
  };

  const scoreColor = getScoreColor(confidenceScore);

  const barWidthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>AI Prediction Confidence</Text>
        <Text style={[styles.percentageText, { color: scoreColor }]}>{percentage}%</Text>
      </View>

      {/* Progress Track */}
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            { width: barWidthInterpolate, backgroundColor: scoreColor },
          ]}
        />
      </View>

      <Text style={styles.footerNote}>
        Matches verified wood grain patterns for <Text style={styles.boldText}>{speciesName}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#1A1D1F',
    fontSize: 14,
    fontWeight: '800',
  },
  percentageText: {
    fontSize: 22,
    fontWeight: '800',
  },
  track: {
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
  footerNote: {
    color: '#6B7280',
    fontSize: 12,
  },
  boldText: {
    color: '#1A1D1F',
    fontWeight: '700',
  },
});
