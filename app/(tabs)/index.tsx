import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { AppButton } from '../../components/ui/AppButton';
import { AppScreen } from '../../components/ui/AppScreen';
import { radius, space, typeScale } from '../../constants/appTheme';
import { SUPPORTED_SPECIES } from '../../constants/supportedSpecies';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>LUMBRSCAN</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>Timber, clearly identified.</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>A focused offline prototype for three timber species.</Text>
        </View>
        <View style={[styles.mark, { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.border }]}>
          <Ionicons name="leaf-outline" size={23} color={theme.colors.primary} />
        </View>
      </View>

      <View style={[styles.scanCard, { backgroundColor: theme.colors.surfaceStrong }]}>
        <View style={styles.scanCardTop}>
          <View style={[styles.scanIcon, { backgroundColor: theme.isDark ? '#314B3A' : '#2F6D52' }]}>
            <Ionicons name="scan-outline" size={27} color="#FFFFFF" />
          </View>
          <View style={styles.scanCopy}>
            <Text style={[styles.scanEyebrow, { color: theme.colors.accent }]}>OFFLINE SCAN</Text>
            <Text style={[styles.scanTitle, { color: theme.colors.textOnStrong }]}>Identify one clear end grain</Text>
          </View>
        </View>
        <Text style={[styles.scanText, { color: theme.isDark ? '#C9D7CD' : '#DCE8DE' }]}>Capture one isolated, face-on board end. The on-device model supports Coconut, Gmelina, and Mango.</Text>
        <AppButton label="Start a scan" icon="camera-outline" onPress={() => router.navigate('/(tabs)/scan')} style={{ marginTop: 18, backgroundColor: theme.colors.accent, borderColor: theme.colors.accent }} />
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Available species</Text>
          <Text style={[styles.sectionSub, { color: theme.colors.textMuted }]}>Current model and local reference catalog</Text>
        </View>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open species catalog" onPress={() => router.navigate('/knowledge')}>
          <Text style={[styles.link, { color: theme.colors.primary }]}>View catalog</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.speciesGrid}>
        {SUPPORTED_SPECIES.map((species) => (
          <TouchableOpacity
            key={species.id}
            accessibilityRole="button"
            accessibilityLabel={`View ${species.commonName} reference`}
            activeOpacity={0.82}
            onPress={() => router.navigate(`/species/${species.id}`)}
            style={[styles.speciesCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          >
            <View style={[styles.swatch, { backgroundColor: species.colorHex }]} />
            <Text numberOfLines={1} style={[styles.speciesName, { color: theme.colors.text }]}>{species.commonName.replace(' (Coco Lumber)', '')}</Text>
            <Text numberOfLines={1} style={[styles.speciesBotanical, { color: theme.colors.textMuted }]}>{species.botanicalName}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.utilityGrid}>
        <TouchableOpacity onPress={() => router.navigate('/estimator')} style={[styles.utilityCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} activeOpacity={0.82} accessibilityRole="button" accessibilityLabel="Open price estimator">
          <Ionicons name="calculator-outline" size={21} color={theme.colors.primary} />
          <View style={styles.utilityCopy}><Text style={[styles.utilityTitle, { color: theme.colors.text }]}>Price estimator</Text><Text style={[styles.utilityText, { color: theme.colors.textMuted }]}>Reference prices for the three supported species</Text></View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.navigate('/history')} style={[styles.utilityCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} activeOpacity={0.82} accessibilityRole="button" accessibilityLabel="Open scan history">
          <Ionicons name="time-outline" size={21} color={theme.colors.primary} />
          <View style={styles.utilityCopy}><Text style={[styles.utilityTitle, { color: theme.colors.text }]}>Scan history</Text><Text style={[styles.utilityText, { color: theme.colors.textMuted }]}>Your local scan record</Text></View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={[styles.note, { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.border }]}>
        <Ionicons name="information-circle-outline" size={19} color={theme.colors.primary} />
        <Text style={[styles.noteText, { color: theme.colors.textMuted }]}>Species identification is not a structural-grade, defect, or construction-suitability assessment.</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'flex-start', flexDirection: 'row', gap: 12, justifyContent: 'space-between', marginBottom: space.xl },
  headerCopy: { flex: 1, flexShrink: 1 },
  eyebrow: { fontSize: typeScale.eyebrow, fontWeight: '900', letterSpacing: 1.4 },
  title: { fontSize: 30, fontWeight: '900', letterSpacing: -1.05, lineHeight: 36, marginTop: 7 },
  subtitle: { fontSize: typeScale.body, lineHeight: 21, marginTop: 8 },
  mark: { alignItems: 'center', borderRadius: radius.md, borderWidth: 1, height: 48, justifyContent: 'center', width: 48 },
  scanCard: { borderRadius: radius.lg, padding: space.lg },
  scanCardTop: { alignItems: 'center', flexDirection: 'row', gap: 14 },
  scanIcon: { alignItems: 'center', borderRadius: 18, height: 52, justifyContent: 'center', width: 52 },
  scanCopy: { flex: 1 },
  scanEyebrow: { fontSize: typeScale.eyebrow, fontWeight: '900', letterSpacing: 1.1 },
  scanTitle: { fontSize: 20, fontWeight: '900', letterSpacing: -0.35, marginTop: 3 },
  scanText: { fontSize: 14, lineHeight: 20, marginTop: 16 },
  sectionHeader: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginBottom: space.md, marginTop: space.xxl },
  sectionTitle: { fontSize: typeScale.title, fontWeight: '900', letterSpacing: -0.4 },
  sectionSub: { fontSize: 13, marginTop: 3 },
  link: { fontSize: 13, fontWeight: '800' },
  speciesGrid: { flexDirection: 'row', gap: 10 },
  speciesCard: { borderRadius: radius.md, borderWidth: 1, flex: 1, minHeight: 124, padding: 13 },
  swatch: { borderRadius: 6, height: 8, marginBottom: 16, width: 32 },
  speciesName: { fontSize: 15, fontWeight: '900' },
  speciesBotanical: { fontSize: 11, fontStyle: 'italic', marginTop: 4 },
  utilityGrid: { gap: 10, marginTop: space.lg },
  utilityCard: { alignItems: 'center', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 12, minHeight: 76, paddingHorizontal: 16 },
  utilityCopy: { flex: 1 },
  utilityTitle: { fontSize: 15, fontWeight: '900' },
  utilityText: { fontSize: 12, lineHeight: 17, marginTop: 3 },
  note: { alignItems: 'flex-start', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 10, marginTop: space.lg, padding: 14 },
  noteText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
