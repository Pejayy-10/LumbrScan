// LumbrScan Module 1 & Module 5: Image Preprocessing & Physical Condition Assessment Screen

import React, { useState } from 'react';
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
import { useScanStore } from '../../stores/useScanStore';
import { useConditionStore } from '../../stores/useConditionStore';
import { ModalityType, SeverityLevel } from '../../types';

export default function ScanScreen() {
  const router = useRouter();

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
  // IMAGE PICKER HANDLERS (CAMERA & GALLERY)
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Strict 1:1 Aspect ratio for 224x224 RGB CNN tensor
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. MODULE 1: IMAGE CAPTURE & 224x224 PREPROCESSING VIEW */}
      <Text style={styles.sectionHeader}>Module 1: Preprocessing & Crop</Text>

      <View style={styles.previewCard}>
        {/* 224x224 Square Frame */}
        <View style={styles.cropOverlay}>
          {displayUri ? (
            <Image source={{ uri: displayUri }} style={styles.capturedImage} resizeMode="cover" />
          ) : (
            <View style={styles.emptyPlaceholder}>
              <MaterialCommunityIcons name="crop-free" size={36} color="#D97706" />
              <Text style={styles.cropGridText}>224 x 224 RGB Crop Target</Text>
              <Text style={styles.cropSubText}>Tap below to capture or select wood photo</Text>
            </View>
          )}
        </View>

        {/* Camera / Gallery Buttons */}
        <View style={styles.pickerButtonRow}>
          <TouchableOpacity
            style={styles.pickerBtnPrimary}
            onPress={handleTakePhoto}
            activeOpacity={0.8}
          >
            <Ionicons name="camera" size={18} color="#0F172A" />
            <Text style={styles.pickerBtnPrimaryText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pickerBtnSecondary}
            onPress={handlePickFromGallery}
            activeOpacity={0.8}
          >
            <Ionicons name="images" size={18} color="#F8FAFC" />
            <Text style={styles.pickerBtnSecondaryText}>Choose Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Modality Selector */}
        <Text style={styles.modalityHeader}>Target Timber Modality:</Text>
        <View style={styles.modalityRow}>
          {(
            [
              { type: 'TRANSVERSAL_CROSS_SECTION', label: 'Cross Section' },
              { type: 'WOOD_GRAIN', label: 'Wood Grain' },
              { type: 'LOG_BARK', label: 'Log Bark' },
            ] as const
          ).map((m) => (
            <TouchableOpacity
              key={m.type}
              style={[
                styles.modalityPill,
                modalityType === m.type && styles.modalityPillActive,
              ]}
              onPress={() => setModalityType(m.type as ModalityType)}
            >
              <Text
                style={[
                  styles.modalityText,
                  modalityType === m.type && styles.modalityTextActive,
                ]}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 2. MODULE 5: PHYSICAL CONDITION DEFECT CHECKLIST */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeader}>Module 5: Physical Condition Assessment</Text>
        <Text style={styles.sectionSubText}>Flag Visible Structural Defect Types</Text>
      </View>

      <View style={styles.checklistCard}>
        <TouchableOpacity
          style={[styles.defectRow, hasDecayOrRot && styles.defectRowActive]}
          onPress={toggleDecayOrRot}
        >
          <View style={styles.defectLeft}>
            <MaterialCommunityIcons
              name={hasDecayOrRot ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
              size={22}
              color={hasDecayOrRot ? '#DC2626' : '#64748B'}
            />
            <View>
              <Text style={styles.defectTitle}>Decay / Fungal Rot</Text>
              <Text style={styles.defectDesc}>Softened fibers (-2 FPRDI Group penalty)</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.defectRow, hasEndSplitting && styles.defectRowActive]}
          onPress={toggleEndSplitting}
        >
          <View style={styles.defectLeft}>
            <MaterialCommunityIcons
              name={hasEndSplitting ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
              size={22}
              color={hasEndSplitting ? '#D97706' : '#64748B'}
            />
            <View>
              <Text style={styles.defectTitle}>End Splitting / Cracks</Text>
              <Text style={styles.defectDesc}>Separation along grain ends</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.defectRow, hasWarping && styles.defectRowActive]}
          onPress={toggleWarping}
        >
          <View style={styles.defectLeft}>
            <MaterialCommunityIcons
              name={hasWarping ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
              size={22}
              color={hasWarping ? '#D97706' : '#64748B'}
            />
            <View>
              <Text style={styles.defectTitle}>Warping / Bowing</Text>
              <Text style={styles.defectDesc}>Dimensional curvature distortion</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.defectRow, hasUnsoundKnots && styles.defectRowActive]}
          onPress={toggleUnsoundKnots}
        >
          <View style={styles.defectLeft}>
            <MaterialCommunityIcons
              name={hasUnsoundKnots ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
              size={22}
              color={hasUnsoundKnots ? '#D97706' : '#64748B'}
            />
            <View>
              <Text style={styles.defectTitle}>Unsound Loose Knots</Text>
              <Text style={styles.defectDesc}>Decayed or loose knot holes</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.defectRow, hasInsectBoreholes && styles.defectRowActive]}
          onPress={toggleInsectBoreholes}
        >
          <View style={styles.defectLeft}>
            <MaterialCommunityIcons
              name={hasInsectBoreholes ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
              size={22}
              color={hasInsectBoreholes ? '#D97706' : '#64748B'}
            />
            <View>
              <Text style={styles.defectTitle}>Insect Boreholes</Text>
              <Text style={styles.defectDesc}>Termite or beetle damage galleries</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Severity Selector */}
        <Text style={styles.severityLabel}>Overall Defect Severity Rating:</Text>
        <View style={styles.severityRow}>
          {(['NONE', 'LOW', 'MODERATE', 'SEVERE'] as const).map((sev) => (
            <TouchableOpacity
              key={sev}
              style={[
                styles.severityPill,
                defectSeverity === sev && styles.severityPillActive,
              ]}
              onPress={() => setDefectSeverity(sev as SeverityLevel)}
            >
              <Text
                style={[
                  styles.severityText,
                  defectSeverity === sev && styles.severityTextActive,
                ]}
              >
                {sev}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Live Structural Defect Downgrade Banner */}
        {totalPenalty > 0 ? (
          <View style={styles.downgradeBanner}>
            <View style={styles.downgradeHeaderRow}>
              <MaterialCommunityIcons name="alert-decagram" size={20} color="#DC2626" />
              <Text style={styles.downgradeTitle}>
                Structural Penalty: -{totalPenalty} FPRDI Group(s)
              </Text>
            </View>
            <Text style={styles.downgradeDesc}>
              Active defects degrade bending capacity. Nominal Group II wood will be re-evaluated as Effective {sampleEffectiveGroup}.
            </Text>
          </View>
        ) : (
          <View style={styles.noDowngradeBanner}>
            <MaterialCommunityIcons name="shield-check-outline" size={18} color="#059669" />
            <Text style={styles.noDowngradeText}>
              No active defects flagged. Full FPRDI structural capacity retained.
            </Text>
          </View>
        )}
      </View>

      {/* 3. EXECUTE INFERENCE CTA */}
      <TouchableOpacity
        style={[styles.executeCta, isProcessing && styles.executeCtaDisabled]}
        onPress={handleRunInference}
        disabled={isProcessing}
        activeOpacity={0.85}
      >
        {isProcessing ? (
          <ActivityIndicator color="#0F172A" />
        ) : (
          <>
            <Ionicons name="sparkles" size={20} color="#0F172A" />
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
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  sectionHeader: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  sectionHeaderRow: {
    marginTop: 16,
    marginBottom: 10,
  },
  sectionSubText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  previewCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 16,
    alignItems: 'center',
  },
  cropOverlay: {
    width: 224,
    height: 224,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D97706',
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
    padding: 16,
  },
  cropGridText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  cropSubText: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
  pickerButtonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 14,
  },
  pickerBtnPrimary: {
    flex: 1,
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  pickerBtnPrimaryText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
  },
  pickerBtnSecondary: {
    flex: 1,
    backgroundColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  pickerBtnSecondaryText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  modalityHeader: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  modalityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modalityPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalityPillActive: {
    backgroundColor: '#D9770622',
    borderColor: '#D97706',
  },
  modalityText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  modalityTextActive: {
    color: '#D97706',
    fontWeight: '700',
  },
  checklistCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 16,
  },
  defectRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  defectRowActive: {
    backgroundColor: '#0F172A44',
  },
  defectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  defectTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  defectDesc: {
    color: '#94A3B8',
    fontSize: 12,
  },
  severityLabel: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 8,
  },
  severityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  severityPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  severityPillActive: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  severityText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  severityTextActive: {
    color: '#0F172A',
  },
  downgradeBanner: {
    marginTop: 14,
    padding: 12,
    backgroundColor: '#DC26261A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  downgradeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  downgradeTitle: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  downgradeDesc: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 17,
  },
  noDowngradeBanner: {
    marginTop: 14,
    padding: 10,
    backgroundColor: '#0596691A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noDowngradeText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },
  executeCta: {
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  executeCtaDisabled: {
    opacity: 0.6,
  },
  executeCtaText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
  },
});
