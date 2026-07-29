// LumbrScan Module 1: Automated AI Defect Vision Classification & Preprocessing Screen
// TripGlide Light & Dark Pill Aesthetic

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

      {/* ── Preprocessing Viewport Card ── */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>MODULE 1</Text>
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
                <Ionicons name="camera-outline" size={32} color="#10B981" />
              </View>
              <Text style={styles.cropLabel}>224 × 224 RGB Target</Text>
              <Text style={styles.cropHint}>Capture wood grain, cross-section, or bark photo</Text>
            </View>
          )}
        </View>

        {/* Photo Picker Buttons */}
        <View style={styles.pickerRow}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleTakePhoto}
            activeOpacity={0.85}
          >
            <Ionicons name="camera" size={17} color="#FFFFFF" />
            <Text style={styles.btnPrimaryText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={handlePickFromGallery}
            activeOpacity={0.85}
          >
            <Ionicons name="images-outline" size={17} color="#1A1D1F" />
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

      {/* ── Run AI Button ── */}
      <TouchableOpacity
        style={[styles.executeCta, isProcessing && styles.executeCtaDisabled]}
        onPress={handleRunInference}
        disabled={isProcessing}
        activeOpacity={0.85}
      >
        {isProcessing ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="sparkles" size={20} color="#FFFFFF" />
            <Text style={styles.executeCtaText}>Run AI Species & Defect Classification</Text>
          </>
        )}
      </TouchableOpacity>

      {/* ── AI Vision Output Card ── */}
      {activeResult && (
        <View style={styles.resultsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>AI VISION OUTPUT</Text>
            </View>
            <Text style={styles.cardTitle}>Automated Defect Findings</Text>
          </View>

          {/* Primary Match Banner */}
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

          {/* Severe Warning or Sound Capacity Banner */}
          {severeFallback ? (
            <View style={styles.severeWarningCard}>
              <View style={styles.severeHeader}>
                <Ionicons name="alert-circle" size={22} color="#DC2626" />
                <Text style={styles.severeBadgeTitle}>UNSAFE FOR STRUCTURAL USE</Text>
              </View>
              <Text style={styles.severeMessage}>{severeFallback.warningMessage}</Text>

              <Text style={styles.fallbackTitle}>Suggested Sound Timber Alternatives:</Text>
              {severeFallback.suggestedAlternativeSpecies.map((alt) => (
                <View key={alt.id} style={styles.fallbackRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
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
              <Ionicons name="shield-checkmark" size={18} color="#10B981" />
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
                    <Ionicons name="warning-outline" size={16} color="#D97706" />
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

          {/* Remediation Steps Card */}
          {automatedDefects && automatedDefects.remediationRecommendations.length > 0 && (
            <View style={styles.remediationCard}>
              <View style={styles.remedyHeader}>
                <Ionicons name="build-outline" size={18} color="#059669" />
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
    backgroundColor: '#F4F6F8',
  },
  content: {
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1D1F',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 14,
  },
  badgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#1A1D1F',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1D1F',
  },
  cropFrame: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#10B981',
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
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cropLabel: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  cropHint: {
    color: '#9CA3AF',
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
    backgroundColor: '#1A1D1F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    gap: 6,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  btnSecondary: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  btnSecondaryText: {
    color: '#1A1D1F',
    fontSize: 13,
    fontWeight: '700',
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pillActive: {
    backgroundColor: '#1A1D1F',
    borderColor: '#1A1D1F',
  },
  pillText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  executeCta: {
    backgroundColor: '#1A1D1F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 24,
    gap: 10,
    marginBottom: 20,
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  executeCtaDisabled: {
    opacity: 0.6,
  },
  executeCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  resultsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  speciesBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1D1F',
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
  },
  speciesBannerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  speciesBannerSub: {
    color: '#10B981',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 2,
  },
  confidencePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  confidenceText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '800',
  },
  severeWarningCard: {
    backgroundColor: '#FEF2F2',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 14,
  },
  severeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  severeBadgeTitle: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  severeMessage: {
    color: '#7F1D1D',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  fallbackTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1D1F',
    marginBottom: 6,
  },
  fallbackRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 4,
  },
  fallbackName: {
    color: '#1A1D1F',
    fontSize: 12,
    fontWeight: '700',
  },
  fallbackReason: {
    color: '#6B7280',
    fontSize: 11,
  },
  safeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 14,
  },
  safeText: {
    color: '#065F46',
    fontSize: 12,
    flex: 1,
  },
  defectList: {
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1D1F',
    marginBottom: 8,
  },
  defectItem: {
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCD34D',
    marginBottom: 6,
  },
  defectHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  defectItemTitle: {
    color: '#92400E',
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
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  noDefectsText: {
    color: '#065F46',
    fontSize: 13,
    marginBottom: 14,
  },
  remediationCard: {
    backgroundColor: '#ECFDF5',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 14,
  },
  remedyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  remedyTitle: {
    color: '#065F46',
    fontSize: 13,
    fontWeight: '800',
  },
  remedyRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  remedyBullet: {
    color: '#10B981',
    fontWeight: '800',
  },
  remedyText: {
    color: '#065F46',
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  fullProfileBtn: {
    backgroundColor: '#1A1D1F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 20,
    gap: 6,
  },
  fullProfileBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
