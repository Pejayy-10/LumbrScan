// LumbrScan Module 1: Automated AI Defect Vision Classification & Preprocessing Screen
// Deep Emerald Glassmorphism Theme

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScanStore } from '../../stores/useScanStore';
import { useHistoryStore } from '../../stores/useHistoryStore';
import { ModalityType } from '../../types';

export default function ScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addHistoryLog = useHistoryStore((state) => state.addLog);

  const {
    imageUri,
    setImageUri,
    croppedUri,
    setCroppedUri,
    modalityType,
    setModalityType,
    isProcessing,
    activeResult,
    runInference,
  } = useScanStore();

  // ---------------------------------------------------------------------------
  // IMAGE PICKER HANDLERS
  // ---------------------------------------------------------------------------
  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Camera access is required to capture timber grain & cross-section images.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        setCroppedUri(uri);
      }
    } catch (err) {
      console.error('Failed to capture photo:', err);
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Photo gallery access is required to select timber images.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        setCroppedUri(uri);
      }
    } catch (err) {
      console.error('Failed to pick image:', err);
    }
  };

  const handleRunInference = async () => {
    try {
      const result = await runInference({});

      if (result && result.prediction?.primaryMatch) {
        addHistoryLog(
          result,
          croppedUri || imageUri || 'file:///mock/scanned_wood.jpg'
        );
      }
    } catch (err) {
      console.error('Prediction failed:', err);
    }
  };

  const displayUri = croppedUri || imageUri;
  const automatedDefects = activeResult?.automatedDefectDetection;
  const severeFallback = activeResult?.structuralAssessment?.severeDefectFallback;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: 120 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Page Header ── */}
      <Text style={styles.pageTitle}>AI Timber Vision Scan</Text>
      <Text style={styles.pageSubtitle}>
        Dual-Backbone AI predicts species AND automated defect condition
      </Text>

      {/* ── Preprocessing Frame ── */}
      <View style={styles.glassCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardBadge}>
            <Text style={styles.cardBadgeText}>MODULE 1</Text>
          </View>
          <Text style={styles.cardTitle}>Image Preprocessing & 224×224 Crop</Text>
        </View>

        {/* 224×224 Target Frame */}
        <View style={styles.cropFrame}>
          {displayUri ? (
            <Image source={{ uri: displayUri }} style={styles.capturedImage} resizeMode="cover" />
          ) : (
            <View style={styles.emptyPlaceholder}>
              <View style={styles.cameraIconWrap}>
                <Ionicons name="camera-outline" size={32} color="#74C69D" />
              </View>
              <Text style={styles.cropLabel}>224 × 224 RGB Target</Text>
              <Text style={styles.cropHint}>Capture wood grain, cross-section, or bark photo</Text>
            </View>
          )}
        </View>

        {/* Picker Buttons */}
        <View style={styles.pickerRow}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleTakePhoto}
            activeOpacity={0.85}
          >
            <Ionicons name="camera" size={17} color="#0B1D15" />
            <Text style={styles.btnPrimaryText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={handlePickFromGallery}
            activeOpacity={0.85}
          >
            <Ionicons name="images-outline" size={17} color="#74C69D" />
            <Text style={styles.btnSecondaryText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Modality Selector Chips */}
        <Text style={styles.subLabel}>Target Timber Modality</Text>
        <View style={styles.pillRow}>
          {(
            [
              { type: 'TRANSVERSAL_CROSS_SECTION', label: 'Cross-Section' },
              { type: 'WOOD_GRAIN', label: 'Wood Grain' },
              { type: 'LOG_BARK', label: 'Log Bark' },
            ] as const
          ).map((m) => (
            <TouchableOpacity
              key={m.type}
              style={[styles.pill, modalityType === m.type && styles.pillActive]}
              onPress={() => setModalityType(m.type as ModalityType)}
              activeOpacity={0.8}
            >
              {modalityType === m.type && <View style={styles.activeDot} />}
              <Text
                style={[
                  styles.pillText,
                  modalityType === m.type && styles.pillTextActive,
                ]}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Run AI Classification Button ── */}
      <TouchableOpacity
        style={[styles.executeCta, isProcessing && styles.executeCtaDisabled]}
        onPress={handleRunInference}
        disabled={isProcessing}
        activeOpacity={0.85}
      >
        {isProcessing ? (
          <ActivityIndicator color="#0B1D15" />
        ) : (
          <>
            <Ionicons name="sparkles" size={20} color="#0B1D15" />
            <Text style={styles.executeCtaText}>Run AI Species & Defect Classification</Text>
          </>
        )}
      </TouchableOpacity>

      {/* ── AI Vision Output Results ── */}
      {activeResult && (
        <View style={styles.resultsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>AI VISION OUTPUT</Text>
            </View>
            <Text style={styles.cardTitle}>Automated Defect Findings</Text>
          </View>

          {/* Primary Identified Species Banner */}
          <View style={styles.speciesBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.speciesBannerTitle}>
                {activeResult.prediction.primaryMatch.commonName}
              </Text>
              <Text style={styles.speciesBannerSub}>
                {activeResult.prediction.primaryMatch.botanicalName}
              </Text>
            </View>
            <View style={styles.confidencePill}>
              <Text style={styles.confidenceText}>
                {Math.round(activeResult.prediction.primaryMatch.confidenceScore * 100)}% Match
              </Text>
            </View>
          </View>

          {/* Severe Warning or Safe Badge */}
          {severeFallback ? (
            <View style={styles.severeWarningCard}>
              <View style={styles.severeHeader}>
                <Ionicons name="alert-circle" size={22} color="#F87171" />
                <Text style={styles.severeBadgeTitle}>UNSAFE FOR STRUCTURAL USE</Text>
              </View>
              <Text style={styles.severeMessage}>{severeFallback.warningMessage}</Text>

              <Text style={styles.fallbackTitle}>Suggested Sound Timber Alternatives:</Text>
              {severeFallback.suggestedAlternativeSpecies.map((alt) => (
                <View key={alt.id} style={styles.fallbackRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#74C69D" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fallbackName}>
                      {alt.commonName} ({alt.fprdiGroup})
                    </Text>
                    <Text style={styles.fallbackReason}>{alt.reason}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.safeBanner}>
              <Ionicons name="shield-checkmark" size={18} color="#74C69D" />
              <Text style={styles.safeText}>
                Structural Capacity Confirmed — Retained Grade:{' '}
                <Text style={{ fontWeight: '800' }}>
                  {activeResult.structuralAssessment.effectiveFprdiGroup}
                </Text>
              </Text>
            </View>
          )}

          {/* Detected Defects */}
          {automatedDefects && automatedDefects.detectedDefects.length > 0 ? (
            <View style={styles.defectList}>
              <Text style={styles.sectionHeader}>Detected Surface & Internal Defects:</Text>
              {automatedDefects.detectedDefects.map((def, idx) => (
                <View key={idx} style={styles.defectItem}>
                  <View style={styles.defectHeaderRow}>
                    <Ionicons name="warning-outline" size={16} color="#F59E0B" />
                    <Text style={styles.defectItemTitle}>{def.label}</Text>
                    <View style={styles.severityTag}>
                      <Text style={styles.severityTagText}>{def.severity}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noDefectsText}>✅ No structural defects auto-detected.</Text>
          )}

          {/* Remediation Recommendations */}
          {automatedDefects && automatedDefects.remediationRecommendations.length > 0 && (
            <View style={styles.remediationCard}>
              <View style={styles.remedyHeader}>
                <Ionicons name="build-outline" size={18} color="#74C69D" />
                <Text style={styles.remedyTitle}>Minor Defect Remediation Steps</Text>
              </View>
              {automatedDefects.remediationRecommendations.map((step, idx) => (
                <View key={idx} style={styles.remedyRow}>
                  <Text style={styles.remedyBullet}>•</Text>
                  <Text style={styles.remedyText}>{step}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Link to Full Profile */}
          <TouchableOpacity
            style={styles.fullProfileBtn}
            onPress={() =>
              router.push(`/species/${activeResult.prediction.primaryMatch.id}`)
            }
            activeOpacity={0.85}
          >
            <Text style={styles.fullProfileBtnText}>View Full Species Certificate & Report</Text>
            <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1D15',
  },
  content: {
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#95A99E',
    marginBottom: 20,
  },
  glassCard: {
    backgroundColor: 'rgba(20, 46, 34, 0.75)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.2)',
  },
  cardHeader: {
    marginBottom: 14,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(116, 198, 157, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.3)',
  },
  cardBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#74C69D',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cropFrame: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'rgba(11, 29, 21, 0.7)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#74C69D',
    borderStyle: 'dashed',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  capturedImage: {
    width: '100%',
    height: '100%',
  },
  emptyPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cameraIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(116, 198, 157, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cropLabel: {
    color: '#74C69D',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  cropHint: {
    color: '#95A99E',
    fontSize: 12,
    textAlign: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  btnPrimary: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#74C69D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  btnPrimaryText: {
    color: '#0B1D15',
    fontSize: 13,
    fontWeight: '800',
  },
  btnSecondary: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(116, 198, 157, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.3)',
    gap: 6,
  },
  btnSecondaryText: {
    color: '#74C69D',
    fontSize: 13,
    fontWeight: '700',
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#95A99E',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(11, 29, 21, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.2)',
    gap: 6,
  },
  pillActive: {
    backgroundColor: '#2D6A4F',
    borderColor: '#74C69D',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#74C69D',
  },
  pillText: {
    color: '#95A99E',
    fontSize: 12,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  executeCta: {
    backgroundColor: '#74C69D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    marginBottom: 20,
    shadowColor: '#74C69D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  executeCtaDisabled: {
    opacity: 0.6,
  },
  executeCtaText: {
    color: '#0B1D15',
    fontSize: 15,
    fontWeight: '800',
  },
  resultsCard: {
    backgroundColor: 'rgba(20, 46, 34, 0.85)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.25)',
  },
  speciesBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 29, 21, 0.8)',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.25)',
  },
  speciesBannerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  speciesBannerSub: {
    color: '#74C69D',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 2,
  },
  confidencePill: {
    backgroundColor: 'rgba(116, 198, 157, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#74C69D',
  },
  confidenceText: {
    color: '#74C69D',
    fontSize: 13,
    fontWeight: '800',
  },
  severeWarningCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    marginBottom: 14,
  },
  severeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  severeBadgeTitle: {
    color: '#F87171',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  severeMessage: {
    color: '#FECCAE',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  fallbackTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  fallbackRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 4,
  },
  fallbackName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  fallbackReason: {
    color: '#95A99E',
    fontSize: 11,
  },
  safeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 14,
  },
  safeText: {
    color: '#74C69D',
    fontSize: 12,
    flex: 1,
  },
  defectList: {
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  defectItem: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: 6,
  },
  defectHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  defectItemTitle: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  severityTag: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  severityTagText: {
    color: '#0B1D15',
    fontSize: 10,
    fontWeight: '800',
  },
  noDefectsText: {
    color: '#74C69D',
    fontSize: 13,
    marginBottom: 14,
  },
  remediationCard: {
    backgroundColor: 'rgba(116, 198, 157, 0.12)',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.25)',
    marginBottom: 14,
  },
  remedyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  remedyTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  remedyRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  remedyBullet: {
    color: '#74C69D',
    fontWeight: '800',
  },
  remedyText: {
    color: '#95A99E',
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  fullProfileBtn: {
    backgroundColor: '#2D6A4F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 6,
  },
  fullProfileBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
