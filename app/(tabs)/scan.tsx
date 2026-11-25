import React from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { AppButton } from '../../components/ui/AppButton';
import { AppScreen } from '../../components/ui/AppScreen';
import { DenrStatusCard } from '../../components/ui/DenrStatusCard';
import { radius, space, typeScale } from '../../constants/appTheme';
import { SPECIES_DICTIONARY } from '../../constants/domain';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useScanStore } from '../../stores/useScanStore';
import { useHistoryStore } from '../../stores/useHistoryStore';

export default function ScanScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { imageUri, croppedUri, woodGrainUri, setImageUri, setCroppedUri, setWoodGrainUri, isProcessing, activeResult, runInference, resetScan } = useScanStore();
  const addLog = useHistoryStore((state) => state.addLog);
  const displayUri = croppedUri || imageUri;
  const browserPreview = Platform.OS === 'web';

  const chooseImage = async (source: 'camera' | 'library', view: 'end' | 'grain') => {
    const permission = source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to select timber images.');
      return;
    }
    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 1 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 1 });
    const uri = result.canceled ? null : result.assets[0]?.uri;
    if (uri) {
      if (view === 'end') {
        setImageUri(uri);
        setCroppedUri(uri);
      } else {
        setWoodGrainUri(uri);
      }
    }
  };

  const handleScan = async () => {
    if (browserPreview) {
      Alert.alert('Browser preview', 'The browser is for reviewing the interface. The offline model runs in an Android build.');
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
  const acceptedResult = activeResult?.status === 'accepted';

  return (
    <AppScreen>
      <View>
        <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>GUIDED CAPTURE</Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>Scan one board.</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Choose two clear photos of the same board: its cut end and its long wood-grain surface.</Text>
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
          <AppButton label="Camera" icon="camera-outline" onPress={() => void chooseImage('camera', 'end')} variant="secondary" style={styles.halfButton} disabled={isProcessing} />
          <AppButton label="Gallery" icon="images-outline" onPress={() => void chooseImage('library', 'end')} variant="secondary" style={styles.halfButton} disabled={isProcessing} />
        </View>
      </View>

      <View style={[styles.captureCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.captureHeader}>
          <View style={[styles.stepBadge, { backgroundColor: theme.colors.primarySoft }]}><Text style={[styles.stepText, { color: theme.colors.primary }]}>02</Text></View>
          <View style={{ flex: 1 }}><Text style={[styles.cardTitle, { color: theme.colors.text }]}>Choose a wood-grain photo</Text><Text style={[styles.cardSub, { color: theme.colors.textMuted }]}>Photograph the long surface of the same board.</Text></View>
        </View>
        <View style={[styles.imageFrame, { backgroundColor: theme.colors.surfaceMuted, borderColor: woodGrainUri ? theme.colors.primary : theme.colors.border }]}>
          {woodGrainUri ? <Image source={{ uri: woodGrainUri }} style={styles.image} resizeMode="cover" /> : <View style={styles.placeholder}><Ionicons name="image-outline" size={42} color={theme.colors.primary} /><Text style={[styles.placeholderTitle, { color: theme.colors.text }]}>Wood grain goes here</Text><Text style={[styles.placeholderText, { color: theme.colors.textMuted }]}>Same board as the end-grain photo</Text></View>}
        </View>
        <View style={styles.captureActions}>
          <AppButton label="Camera" icon="camera-outline" onPress={() => void chooseImage('camera', 'grain')} variant="secondary" style={styles.halfButton} disabled={isProcessing} />
          <AppButton label="Gallery" icon="images-outline" onPress={() => void chooseImage('library', 'grain')} variant="secondary" style={styles.halfButton} disabled={isProcessing} />
        </View>
      </View>
      {displayUri || woodGrainUri ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Remove both selected photos" accessibilityState={{ disabled: isProcessing }} disabled={isProcessing} onPress={resetScan} style={styles.resetButton}><Text style={[styles.resetText, { color: theme.colors.textMuted, opacity: isProcessing ? 0.5 : 1 }]}>Remove both photos</Text></TouchableOpacity> : null}

      <View style={{ marginTop: space.lg }}>
        <AppButton label={browserPreview ? 'Offline scan unavailable in browser' : 'Identify species offline'} icon={browserPreview ? 'eye-outline' : 'flash-outline'} onPress={() => void handleScan()} disabled={!displayUri || !woodGrainUri || isProcessing} loading={isProcessing} />
      </View>

      {activeResult && species ? (
        <View style={acceptedResult ? [styles.resultCard, { backgroundColor: theme.colors.surfaceStrong }] : [styles.retakeCard, { backgroundColor: theme.colors.warningSoft, borderColor: theme.colors.warning }]}>
          {acceptedResult ? <><View style={styles.resultHeader}><View style={styles.resultIcon}><Ionicons name="scan-outline" size={22} color={theme.colors.textOnStrong} /></View><View style={styles.resultHeaderText}><Text style={[styles.resultEyebrow, { color: theme.colors.accent }]}>SCAN RESULT</Text><Text style={styles.resultHeaderLabel}>Species identification</Text></View></View><Text style={[styles.resultTitle, { color: theme.colors.textOnStrong }]}>{species.commonName}</Text><Text style={[styles.botanical, { color: theme.isDark ? '#C9D7CD' : '#DCE8DE' }]}>{species.botanicalName}</Text><View style={styles.resultDivider} /><View style={styles.resultMeta}><Ionicons name="checkmark-circle-outline" size={18} color={theme.colors.textOnStrong} /><Text style={[styles.confidence, { color: theme.colors.textOnStrong }]}>{Math.round(activeResult.confidence * 100)}% confidence</Text></View></> : <><Ionicons name="refresh-circle-outline" size={28} color={theme.colors.warning} /><Text style={[styles.retakeTitle, { color: theme.colors.text }]}>Please retake the photo</Text><Text style={[styles.retakeText, { color: theme.colors.textMuted }]}>The highest candidate was below the 90% prototype threshold. Try clearer photos of both views of the same board.</Text></>}
        </View>
      ) : null}

      {acceptedResult ? <DenrStatusCard speciesId={species?.id} /> : null}

      {acceptedResult ? (
        <View style={[styles.generalUsesCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.usesHeader}><View style={[styles.usesIcon, { backgroundColor: theme.colors.primarySoft }]}><Ionicons name="grid-outline" size={21} color={theme.colors.primary} /></View><View style={styles.resultHeaderText}><Text style={[styles.usesEyebrow, { color: theme.colors.primary }]}>EXPLORE</Text><Text style={[styles.cardTitle, { color: theme.colors.text }]}>General lumber uses</Text></View></View>
          <Text style={[styles.retakeText, { color: theme.colors.textMuted }]}>
            Common applications include:
          </Text>
          <View style={styles.useTags}>{(['Furniture', 'Cabinetry', 'Flooring', 'Construction'] as const).map((label) => <View key={label} style={[styles.useTag, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}><Text style={[styles.useTagText, { color: theme.colors.text }]}>{label}</Text></View>)}</View>
          <View style={[styles.usesNote, { borderColor: theme.colors.border }]}><Ionicons name="information-circle-outline" size={18} color={theme.colors.textMuted} /><Text style={[styles.usesNoteText, { color: theme.colors.textMuted }]}>General examples only. The photographed board has not been assessed for these uses.</Text></View>
          {species && <><AppButton label="Explore species references" icon="book-outline" variant="secondary" onPress={() => router.push({ pathname: '/recommend', params: { species: species.id } })} style={{ marginTop: 12 }} /><AppButton label="Estimate material cost" icon="calculator-outline" variant="secondary" onPress={() => router.push({ pathname: '/estimator', params: { species: species.id } })} style={{ marginTop: 12 }} /></>}
          <AppButton label="Browse lumber references" icon="library-outline" variant="secondary" onPress={() => router.navigate('/(tabs)/knowledge')} style={{ marginTop: 12 }} />
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
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resultHeaderText: { flex: 1 },
  resultIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.12)' },
  resultHeaderLabel: { color: '#E4EDE5', fontSize: 12, marginTop: 3 },
  resultDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.18)', marginTop: 20, marginBottom: 14 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resultEyebrow: { fontSize: typeScale.eyebrow, fontWeight: '900', letterSpacing: 1.1 },
  resultTitle: { fontSize: 28, fontWeight: '900', letterSpacing: -0.8, marginTop: 9 },
  botanical: { fontSize: 14, fontStyle: 'italic', marginTop: 3 },
  confidence: { flex: 1, fontSize: 13, lineHeight: 19, fontWeight: '700' },
  retakeCard: { borderRadius: radius.lg, borderWidth: 1, gap: 7, marginTop: space.lg, padding: space.lg },
  retakeTitle: { fontSize: 18, fontWeight: '900' },
  retakeText: { fontSize: 13, lineHeight: 19 },
  generalUsesCard: { borderRadius: radius.lg, borderWidth: 1, gap: 7, marginTop: space.lg, padding: space.lg },
  usesHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  usesIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  usesEyebrow: { fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 3 },
  useTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  useTag: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7 },
  useTagText: { fontSize: 12, fontWeight: '700' },
  usesNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, borderTopWidth: 1, paddingTop: 14, marginTop: 10 },
  usesNoteText: { flex: 1, fontSize: 12, lineHeight: 18 },
  limitCard: { alignItems: 'flex-start', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 10, marginTop: space.lg, padding: 14 },
  limitText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
