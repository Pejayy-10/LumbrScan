// LumbrScan AI Species Match Confidence Gauge Component
// Deep Emerald Glassmorphism Theme

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
    if (score >= 0.85) return '#74C69D';
    if (score >= 0.65) return '#F59E0B';
    return '#F87171';
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
    backgroundColor: 'rgba(20, 46, 34, 0.75)',
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.2)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  percentageText: {
    fontSize: 22,
    fontWeight: '800',
  },
  track: {
    height: 10,
    backgroundColor: 'rgba(11, 29, 21, 0.7)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.15)',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
  footerNote: {
    color: '#95A99E',
    fontSize: 12,
  },
  boldText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
