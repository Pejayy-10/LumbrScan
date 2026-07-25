// LumbrScan Module 1 & Module 5: Image Preprocessing & Physical Condition Assessment Screen
// Light Nature Theme

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
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScanStore } from '../../stores/useScanStore';
import { useConditionStore } from '../../stores/useConditionStore';
import { ModalityType, SeverityLevel } from '../../types';

export default function ScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    imageUri,
    setImageUri,
    croppedUri,
    setCroppedUri,
    modalityType,
    setModalityType,
    isProcessing,
    runInference,
  } = useScanStore();

  const {
    hasDecayOrRot,
    hasEndSplitting,
    hasWarping,
    hasUnsoundKnots,
    hasInsectBoreholes,
    defectSeverity,
    toggleDecayOrRot,
    toggleEndSplitting,
    toggleWarping,
    toggleUnsoundKnots,
    toggleInsectBoreholes,
    setDefectSeverity,
    getTotalPenalty,
    getEffectiveFprdiGroup,
    getConditionFlags,
  } = useConditionStore();

  const totalPenalty = getTotalPenalty();
  const sampleEffectiveGroup = getEffectiveFprdiGroup('GROUP_II');

  // ---------------------------------------------------------------------------
  // IMAGE PICKER HANDLERS (SDK 54 API — MediaType array)
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
      const conditionFlags = getConditionFlags();
      const result = await runInference(conditionFlags);
      if (result && result.prediction?.primaryMatch) {
        router.push(`/species/${result.prediction.primaryMatch.id}`);
      }
    } catch (err) {
      console.error('Prediction failed:', err);
    }
  };

  const displayUri = croppedUri || imageUri;

  const defects = [
    {
      label: 'Decay / Fungal Rot',
      desc: 'Softened fibers (−2 FPRDI Group)',
      value: hasDecayOrRot,
      toggle: toggleDecayOrRot,
      danger: true,
    },
    {
      label: 'End Splitting / Cracks',
      desc: 'Separation along grain ends',
      value: hasEndSplitting,
      toggle: toggleEndSplitting,
      danger: false,
    },
    {
      label: 'Warping / Bowing',
      desc: 'Dimensional curvature distortion',
      value: hasWarping,
      toggle: toggleWarping,
      danger: false,
    },
    {
      label: 'Unsound Loose Knots',
      desc: 'Decayed or loose knot holes',
      value: hasUnsoundKnots,
      toggle: toggleUnsoundKnots,
      danger: false,
    },
    {
      label: 'Insect Boreholes',
      desc: 'Termite or beetle damage galleries',
      value: hasInsectBoreholes,
      toggle: toggleInsectBoreholes,
      danger: false,
    },
  ];

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
      <Text style={styles.pageTitle}>Timber Scan</Text>
      <Text style={styles.pageSubtitle}>
        Capture or select a timber image to classify and assess.
      </Text>

      {/* ── Module 1: Image Capture ── */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardBadge, { backgroundColor: '#EEF9F4' }]}>
            <Text style={[styles.cardBadgeText, { color: '#2D6A4F' }]}>MODULE 1</Text>
          </View>
          <Text style={styles.cardTitle}>Image Preprocessing & Crop</Text>
        </View>

        {/* 224×224 Square Frame */}
        <View style={styles.cropFrame}>
          {displayUri ? (
            <Image source={{ uri: displayUri }} style={styles.capturedImage} resizeMode="cover" />
          ) : (
            <View style={styles.emptyPlaceholder}>
              <View style={styles.cameraIconWrap}>
                <Ionicons name="camera-outline" size={32} color="#40916C" />
              </View>
              <Text style={styles.cropLabel}>224 × 224 RGB Crop Target</Text>
              <Text style={styles.cropHint}>Tap below to capture or select a timber photo</Text>
            </View>
          )}
        </View>

        {/* Camera / Gallery Buttons */}
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
            <Ionicons name="images-outline" size={17} color="#2D6A4F" />
            <Text style={styles.btnSecondaryText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Modality Selector */}
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

      {/* ── Module 5: Condition Assessment ── */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardBadge, { backgroundColor: '#FEF6E4' }]}>
            <Text style={[styles.cardBadgeText, { color: '#D97706' }]}>MODULE 5</Text>
          </View>
          <Text style={styles.cardTitle}>Physical Condition Assessment</Text>
        </View>
        <Text style={styles.cardSubtitle}>Flag all visible structural defect types</Text>

        {defects.map((defect, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.defectRow, defect.value && styles.defectRowActive]}
            onPress={defect.toggle}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.defectCheck,
                defect.value && (defect.danger ? styles.defectCheckDanger : styles.defectCheckActive),
              ]}
            >
              {defect.value && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color="#FFFFFF"
                />
              )}
            </View>
            <View style={styles.defectContent}>
              <Text style={styles.defectLabel}>{defect.label}</Text>
              <Text style={styles.defectDesc}>{defect.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Severity Selector */}
        <Text style={styles.subLabel}>Overall Defect Severity Rating</Text>
        <View style={styles.pillRow}>
          {(['NONE', 'LOW', 'MODERATE', 'SEVERE'] as const).map((sev) => (
            <TouchableOpacity
              key={sev}
              style={[styles.pill, defectSeverity === sev && styles.pillActive]}
              onPress={() => setDefectSeverity(sev as SeverityLevel)}
            >
              <Text
                style={[styles.pillText, defectSeverity === sev && styles.pillTextActive]}
              >
                {sev}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Structural Downgrade Banner */}
        {totalPenalty > 0 ? (
          <View style={styles.downgradeBanner}>
            <Ionicons name="alert-circle" size={18} color="#DC2626" />
            <View style={styles.bannerContent}>
              <Text style={styles.downgradeTitle}>
                Structural Penalty: −{totalPenalty} FPRDI Group(s)
              </Text>
              <Text style={styles.downgradeDesc}>
                Nominal Group II will be re-evaluated as Effective {sampleEffectiveGroup}.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.safeBanner}>
            <Ionicons name="shield-checkmark" size={18} color="#2D6A4F" />
            <Text style={styles.safeText}>
              No active defects. Full FPRDI structural capacity retained.
            </Text>
          </View>
        )}
      </View>

      {/* ── Run AI Inference CTA ── */}
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
            <Text style={styles.executeCtaText}>Run AI Classification & Recommendation</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8F5',
  },
  content: {
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1B4332',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#52796F',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 14,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  cardBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B4332',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#52796F',
    marginBottom: 12,
    marginTop: -8,
  },
  cropFrame: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F4F8F5',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#40916C',
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
    backgroundColor: '#EEF9F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cropLabel: {
    color: '#2D6A4F',
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
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
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
    backgroundColor: '#EEF9F4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#B7E4CC',
    gap: 6,
  },
  btnSecondaryText: {
    color: '#2D6A4F',
    fontSize: 13,
    fontWeight: '700',
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#52796F',
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
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F4F8F5',
    borderWidth: 1.5,
    borderColor: '#D1EEE3',
  },
  pillActive: {
    backgroundColor: '#2D6A4F',
    borderColor: '#2D6A4F',
  },
  pillText: {
    color: '#52796F',
    fontSize: 12,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  defectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F2',
  },
  defectRowActive: {
    backgroundColor: 'rgba(45,106,79,0.04)',
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  defectCheck: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#D1EEE3',
    backgroundColor: '#F4F8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  defectCheckActive: {
    backgroundColor: '#2D6A4F',
    borderColor: '#2D6A4F',
  },
  defectCheckDanger: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  defectContent: {
    flex: 1,
  },
  defectLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B4332',
  },
  defectDesc: {
    fontSize: 12,
    color: '#52796F',
    marginTop: 1,
  },
  downgradeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 14,
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  bannerContent: {
    flex: 1,
  },
  downgradeTitle: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  downgradeDesc: {
    color: '#7F1D1D',
    fontSize: 12,
    lineHeight: 16,
  },
  safeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    padding: 12,
    backgroundColor: '#EEF9F4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B7E4CC',
  },
  safeText: {
    color: '#2D6A4F',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  executeCta: {
    backgroundColor: '#1B4332',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  executeCtaDisabled: {
    opacity: 0.6,
  },
  executeCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
