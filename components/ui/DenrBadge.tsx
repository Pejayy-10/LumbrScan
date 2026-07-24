// LumbrScan DENR DAO 2026-20 Legal Regulatory Status Badge

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DenrStatusCode, DENR_BADGES } from '../../constants/domain';

interface DenrBadgeProps {
  statusCode: DenrStatusCode;
  showNotice?: boolean;
}

export const DenrBadge: React.FC<DenrBadgeProps> = ({ statusCode, showNotice = false }) => {
  const badge = DENR_BADGES[statusCode] || DENR_BADGES.REGULATED_PERMIT_REQUIRED;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          { backgroundColor: badge.badgeColorHex + '22', borderColor: badge.badgeColorHex },
        ]}
      >
        <Text style={[styles.title, { color: badge.badgeColorHex }]}>
          ⚖️ {badge.title}
        </Text>
      </View>

      {showNotice && (
        <View style={[styles.noticeBox, { borderColor: badge.badgeColorHex + '55' }]}>
          <Text style={styles.noticeText}>{badge.legalNotice}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
  },
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  noticeBox: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  noticeText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 17,
  },
});
