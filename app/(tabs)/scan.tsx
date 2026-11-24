import React from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { AppButton } from '../../components/ui/AppButton';
import { AppScreen } from '../../components/ui/AppScreen';
import { radius, space, typeScale } from '../../constants/appTheme';
import { SPECIES_DICTIONARY } from '../../constants/domain';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useScanStore } from '../../stores/useScanStore';
import { useHistoryStore } from '../../stores/useHistoryStore';

export default function ScanScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { imageUri, croppedUri, setImageUri, setCroppedUri, isProcessing, activeResult, runInference, resetScan } = useScanStore();
  const addLog = useHistoryStore((state) => state.addLog);
  const displayUri = croppedUri || imageUri;
  const browserPreview = Platform.OS === 'web';

  const chooseImage = async (source: 'camera' | 'library') => {
    const permission = source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to select an end-grain image.');
      return;
    }
    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 1 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 1 });
    const uri = result.canceled ? null : result.assets[0]?.uri;
    if (uri) {
      setImageUri(uri);
      setCroppedUri(uri);
    }
  };

  const handleScan = async () => {
    if (browserPreview) {
      Alert.alert('Browser preview', 'The browser is for reviewing the interface. The offline ONNX model runs in the Android development build.');
      return;
    }
    try {
      const prediction = await runInference();
      if (prediction.status === 'accepted' && displayUri) addLog(prediction, displayUri);
    } catch (error) {
      Alert.alert('Scan unavailable', error instanceof Error ? error.message : 'The offline scan could not be completed.');
    }
  };

  const species = activeResult ? SPECIES_DICTIONARY[activeResult.predictedSpeciesId] : null;

  return (
    <AppScreen>
      <View>
        <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>GUIDED CAPTURE</Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>Scan one board end.</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Keep the cut end face-on, well lit, and isolated in the frame.</Text>
      </View>

      {browserPreview ? (
        <View style={[styles.previewNotice, { backgroundColor: theme.colors.accentSoft, borderColor: theme.colors.accent }]}>
          <Ionicons name="laptop-outline" size={19} color={theme.colors.warning} />
          <Text style={[styles.previewNoticeText, { color: theme.colors.text }]}>Browser preview mode: review the design here. Run the real offline scan in the Android development build.</Text>
        </View>
      ) : null}

      <View style={[styles.captureCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.captureHeader}>
          <View style={[styles.stepBadge, { backgroundColor: theme.colors.primarySoft }]}><Text style={[styles.stepText, { color: theme.colors.primary }]}>01</Text></View>
          <View style={{ flex: 1 }}><Text style={[styles.cardTitle, { color: theme.colors.text }]}>Choose an end-grain photo</Text><Text style={[styles.cardSub, { color: theme.colors.textMuted }]}>One clear board only—no stacks, labels, hands, or strong glare.</Text></View>
        </View>
        <View style={[styles.imageFrame, { backgroundColor: theme.colors.surfaceMuted, borderColor: displayUri ? theme.colors.primary : theme.colors.border }]}>
          {displayUri ? <Image source={{ uri: displayUri }} style={styles.image} resizeMode="cover" /> : <View style={styles.placeholder}><Ionicons name="scan-outline" size={42} color={theme.colors.primary} /><Text style={[styles.placeholderTitle, { color: theme.colors.text }]}>End grain goes here</Text><Text style={[styles.placeholderText, { color: theme.colors.textMuted }]}>Coconut, Gmelina, or Mango</Text></View>}
        </View>
        <View style={styles.captureActions}>
          <AppButton label="Camera" icon="camera-outline" onPress={() => void chooseImage('camera')} variant="secondary" style={styles.halfButton} />
          <AppButton label="Gallery" icon="images-outline" onPress={() => void chooseImage('library')} variant="secondary" style={styles.halfButton} />
        </View>
        {displayUri ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Remove selected photo" onPress={resetScan} style={styles.resetButton}><Text style={[styles.resetText, { color: theme.colors.textMuted }]}>Remove selected photo</Text></TouchableOpacity> : null}
      </View>

      <View style={{ marginTop: space.lg }}>
        <AppButton label={browserPreview ? 'Preview offline result behavior' : 'Identify species offline'} icon={browserPreview ? 'eye-outline' : 'flash-outline'} onPress={() => void handleScan()} disabled={!displayUri || isProcessing} loading={isProcessing} />
      </View>

      {activeResult && species ? (
        <View style={activeResult.status === 'accepted' ? [styles.resultCard, { backgroundColor: theme.colors.surfaceStrong }] : [styles.retakeCard, { backgroundColor: theme.colors.warningSoft, borderColor: theme.colors.warning }]}>
          {activeResult.status === 'accepted' ? <><Text style={[styles.resultEyebrow, { color: theme.colors.accent }]}>ON-DEVICE SPECIES RESULT</Text><Text style={[styles.resultTitle, { color: theme.colors.textOnStrong }]}>{species.commonName}</Text><Text style={[styles.botanical, { color: theme.isDark ? '#C9D7CD' : '#DCE8DE' }]}>{species.botanicalName}</Text><Text style={[styles.confidence, { color: theme.colors.textOnStrong }]}>{Math.round(activeResult.confidence * 100)}% confidence</Text><AppButton label="Open species reference" icon="arrow-forward" onPress={() => router.navigate(`/species/${species.id}`)} style={{ marginTop: 18, backgroundColor: theme.colors.accent, borderColor: theme.colors.accent }} /></> : <><Ionicons name="refresh-circle-outline" size={28} color={theme.colors.warning} /><Text style={[styles.retakeTitle, { color: theme.colors.text }]}>Please retake the photo</Text><Text style={[styles.retakeText, { color: theme.colors.textMuted }]}>The highest candidate was below the 90% prototype threshold. Try a clearer, face-on end-grain photo.</Text></>}
        </View>
      ) : null}

      <View style={[styles.limitCard, { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.border }]}>
        <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.primary} />
        <Text style={[styles.limitText, { color: theme.colors.textMuted }]}>This prototype identifies only the three listed species. It does not assess defects, grade a board, certify safety, or recognize arbitrary objects.</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: typeScale.eyebrow, fontWeight: '900', letterSpacing: 1.3 },
  title: { fontSize: typeScale.display, fontWeight: '900', letterSpacing: -1.1, marginTop: 7 },
  subtitle: { fontSize: 15, lineHeight: 21, marginTop: 8 },
  previewNotice: { alignItems: 'flex-start', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 10, marginTop: space.lg, padding: 13 },
  previewNoticeText: { flex: 1, fontSize: 12, lineHeight: 18 },
  captureCard: { borderRadius: radius.lg, borderWidth: 1, marginTop: space.lg, padding: space.md },
  captureHeader: { alignItems: 'flex-start', flexDirection: 'row', gap: 12 },
  stepBadge: { alignItems: 'center', borderRadius: radius.sm, height: 38, justifyContent: 'center', width: 38 },
  stepText: { fontSize: 12, fontWeight: '900' },
  cardTitle: { fontSize: 16, fontWeight: '900' },
  cardSub: { fontSize: 12, lineHeight: 17, marginTop: 4 },
  imageFrame: { aspectRatio: 1, borderRadius: radius.md, borderStyle: 'dashed', borderWidth: 1.5, marginTop: 16, overflow: 'hidden' },
  image: { height: '100%', width: '100%' },
  placeholder: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 24 },
  placeholderTitle: { fontSize: 15, fontWeight: '900', marginTop: 12 },
  placeholderText: { fontSize: 12, marginTop: 4 },
  captureActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  halfButton: { flex: 1, minHeight: 48 },
  resetButton: { alignItems: 'center', marginTop: 14, minHeight: 32, justifyContent: 'center' },
  resetText: { fontSize: 12, fontWeight: '800' },
  resultCard: { borderRadius: radius.lg, marginTop: space.lg, padding: space.lg },
  resultEyebrow: { fontSize: typeScale.eyebrow, fontWeight: '900', letterSpacing: 1.1 },
  resultTitle: { fontSize: 28, fontWeight: '900', letterSpacing: -0.8, marginTop: 9 },
  botanical: { fontSize: 14, fontStyle: 'italic', marginTop: 3 },
  confidence: { fontSize: 14, fontWeight: '800', marginTop: 16 },
  retakeCard: { borderRadius: radius.lg, borderWidth: 1, gap: 7, marginTop: space.lg, padding: space.lg },
  retakeTitle: { fontSize: 18, fontWeight: '900' },
  retakeText: { fontSize: 13, lineHeight: 19 },
  limitCard: { alignItems: 'flex-start', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 10, marginTop: space.lg, padding: 14 },
  limitText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
