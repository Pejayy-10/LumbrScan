// LumbrScan FPRDI Structural Strength Group Badge Component

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FprdiGroupCode, FPRDI_RATINGS } from '../../constants/domain';

interface FprdiBadgeProps {
  groupCode: FprdiGroupCode;
  size?: 'sm' | 'md' | 'lg';
}

export const FprdiBadge: React.FC<FprdiBadgeProps> = ({ groupCode, size = 'md' }) => {
  const rating = FPRDI_RATINGS[groupCode] || FPRDI_RATINGS.GROUP_III;

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: rating.badgeColorHex + '22', borderColor: rating.badgeColorHex },
        isSmall && styles.smContainer,
        isLarge && styles.lgContainer,
      ]}
    >
      <View style={[styles.indicatorDot, { backgroundColor: rating.badgeColorHex }]} />
      <Text
        style={[
          styles.text,
          { color: rating.badgeColorHex },
          isSmall && styles.smText,
          isLarge && styles.lgText,
        ]}
      >
        {rating.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  smContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  lgContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  smText: {
    fontSize: 11,
  },
  lgText: {
    fontSize: 15,
  },
});
