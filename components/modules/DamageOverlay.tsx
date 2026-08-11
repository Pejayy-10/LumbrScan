import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AutomatedDefectDetection, AutomatedDefectItem, SeverityLevel } from '../../types';

interface DamageOverlayProps {
  imageUri: string | null | undefined;
  detection: AutomatedDefectDetection | null | undefined;
}

const getSeverityColor = (severity: SeverityLevel) => {
  if (severity === 'SEVERE') return '#DC2626';
  if (severity === 'MODERATE') return '#F97316';
  return '#F59E0B';
};

const getSeverityFill = (severity: SeverityLevel) => {
  if (severity === 'SEVERE') return 'rgba(220, 38, 38, 0.26)';
  if (severity === 'MODERATE') return 'rgba(249, 115, 22, 0.24)';
  return 'rgba(245, 158, 11, 0.22)';
};

const hasLocation = (defect: AutomatedDefectItem) => Boolean(defect.boundingBox);

export const DamageOverlay: React.FC<DamageOverlayProps> = ({ imageUri, detection }) => {
  const [activeDefectType, setActiveDefectType] = useState<AutomatedDefectItem['defectType'] | null>(null);

  const overlayDefects = useMemo(
    () => (detection?.detectedDefects || []).filter(hasLocation),
    [detection]
  );

  if (!imageUri || overlayDefects.length === 0) {
    return null;
  }

  const activeDefect =
    overlayDefects.find((defect) => defect.defectType === activeDefectType) || null;

  return (
    <View style={styles.overlayRoot} pointerEvents="box-none">
      <View style={styles.hintPill} pointerEvents="none">
        <Text style={styles.hintText}>Tap a highlighted region for defect details</Text>
      </View>

      {overlayDefects.map((defect) => {
        const box = defect.boundingBox;
        if (!box) return null;

        const isActive = activeDefect?.defectType === defect.defectType;
        const overlayColor = getSeverityColor(defect.severity);
        const fillColor = getSeverityFill(defect.severity);

        return (
          <Pressable
            key={defect.defectType}
            onPress={() => setActiveDefectType(defect.defectType)}
            style={({ pressed }) => [
              styles.marker,
              {
                left: `${box.x * 100}%`,
                top: `${box.y * 100}%`,
                width: `${box.width * 100}%`,
                height: `${box.height * 100}%`,
                borderColor: overlayColor,
                backgroundColor: fillColor,
                borderWidth: isActive ? 3 : 2,
                opacity: pressed ? 0.95 : 1,
              },
            ]}
          >
            <View style={[styles.labelChip, { backgroundColor: overlayColor }]}> 
              <Text style={styles.labelChipText}>{defect.label}</Text>
            </View>
          </Pressable>
        );
      })}

      {activeDefect?.boundingBox ? (
        <View
          style={[
            styles.callout,
            {
              left: `${Math.min(Math.max(activeDefect.boundingBox.x * 100, 4), 68)}%`,
              top:
                activeDefect.boundingBox.y < 0.55
                  ? `${Math.min((activeDefect.boundingBox.y + activeDefect.boundingBox.height + 0.03) * 100, 82)}%`
                  : `${Math.max((activeDefect.boundingBox.y - 0.18) * 100, 4)}%`,
              borderColor: getSeverityColor(activeDefect.severity),
            },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.calloutTitle}>{activeDefect.label}</Text>
          <Text style={styles.calloutMeta}>{activeDefect.severity} severity</Text>
          <Text style={styles.calloutText}>
            {activeDefect.penaltyPoints > 1
              ? 'Remediation: Apply structural repair before use.'
              : 'Remediation: Minor localized repair and sealing recommended.'}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  overlayRoot: {
    ...StyleSheet.absoluteFillObject,
  },
  hintPill: {
    position: 'absolute',
    left: 12,
    top: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(17, 24, 39, 0.82)',
  },
  hintText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  marker: {
    position: 'absolute',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  labelChip: {
    position: 'absolute',
    left: 6,
    top: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  labelChipText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  callout: {
    position: 'absolute',
    maxWidth: '72%',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  calloutTitle: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  calloutMeta: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  calloutText: {
    color: '#374151',
    fontSize: 11,
    lineHeight: 15,
  },
});