// LumbrScan AI Species Match Confidence Gauge Component

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ConfidenceGaugeProps {
  confidenceScore: number; // e.g. 0.942 for 94.2%
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
    if (score >= 0.85) return '#059669'; // Emerald High Confidence
    if (score >= 0.65) return '#D97706'; // Amber Moderate
    return '#DC2626'; // Red Low
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
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: '800',
  },
  track: {
    height: 10,
    backgroundColor: '#0F172A',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
  footerNote: {
    color: '#94A3B8',
    fontSize: 12,
  },
  boldText: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
});
