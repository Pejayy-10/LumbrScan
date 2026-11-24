import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppScreen } from '../../components/ui/AppScreen';
import { radius, space, typeScale } from '../../constants/appTheme';
import { SUPPORTED_SPECIES, SUPPORTED_SPECIES_IDS } from '../../constants/supportedSpecies';
import { useAppTheme } from '../../hooks/useAppTheme';

function isSupportedId(id: string | undefined): id is (typeof SUPPORTED_SPECIES_IDS)[number] {
  return typeof id === 'string' && (SUPPORTED_SPECIES_IDS as readonly string[]).includes(id);
}

export default function SpeciesDetailScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const species = SUPPORTED_SPECIES.find((item) => item.id === id) ?? SUPPORTED_SPECIES[0];
  const requestedUnsupportedSpecies = id !== undefined && !isSupportedId(id);

  return (
    <AppScreen>
      {requestedUnsupportedSpecies && <View style={[styles.notice, { backgroundColor: theme.colors.warningSoft }]}><Ionicons name="information-circle-outline" size={18} color={theme.colors.warning} /><Text style={[styles.noticeText, { color: theme.colors.textMuted }]}>This prototype catalog currently includes Coconut, Gmelina, and Mango only.</Text></View>}

      <View style={[styles.hero, { backgroundColor: theme.colors.surfaceStrong }]}>
        <Text style={[styles.eyebrow, { color: theme.colors.accent }]}>SPECIES REFERENCE</Text>
        <Text style={[styles.name, { color: theme.colors.textOnStrong }]}>{species.commonName.replace(' (Coco Lumber)', '')}</Text>
        <Text style={styles.botanical}>{species.botanicalName}</Text>
        <View style={styles.heroRule} />
        <Text style={styles.localName}>Also known as {species.localName}.</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.cardHeading}><View style={[styles.icon, { backgroundColor: theme.colors.primarySoft }]}><Ionicons name="color-palette-outline" size={18} color={theme.colors.primary} /></View><Text style={[styles.cardTitle, { color: theme.colors.text }]}>Visual reference</Text></View>
        <Text style={[styles.body, { color: theme.colors.textMuted }]}>{species.grainCharacteristics}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.cardHeading}><View style={[styles.icon, { backgroundColor: theme.colors.primarySoft }]}><Ionicons name="cash-outline" size={18} color={theme.colors.primary} /></View><Text style={[styles.cardTitle, { color: theme.colors.text }]}>Project price reference</Text></View>
        <Text style={[styles.price, { color: theme.colors.text }]}>₱{species.pricePerBoardFootPhp.min}–₱{species.pricePerBoardFootPhp.max}<Text style={[styles.perBoardFoot, { color: theme.colors.textMuted }]}> / bd.ft</Text></Text>
        <Text style={[styles.body, { color: theme.colors.textMuted }]}>For early budgeting only. Confirm current price, quality, and available dimensions directly with a supplier.</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.cardHeading}><View style={[styles.icon, { backgroundColor: theme.colors.primarySoft }]}><Ionicons name="scan-outline" size={18} color={theme.colors.primary} /></View><Text style={[styles.cardTitle, { color: theme.colors.text }]}>How this prototype scans</Text></View>
        <Text style={[styles.body, { color: theme.colors.textMuted }]}>The offline model is trained for one clear, close cross-section or end-grain photo. It identifies only the three supported species and cannot grade a board, assess defects, or certify suitability.</Text>
      </View>

      <TouchableOpacity accessibilityRole="button" onPress={() => router.navigate('/estimator')} style={[styles.action, { backgroundColor: theme.colors.primary }]}><Ionicons name="calculator-outline" size={19} color={theme.colors.textOnStrong} /><Text style={[styles.actionText, { color: theme.colors.textOnStrong }]}>Use the price estimator</Text><Ionicons name="chevron-forward" size={18} color={theme.colors.textOnStrong} /></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" onPress={() => router.navigate('/(tabs)/scan')} style={[styles.secondaryAction, { borderColor: theme.colors.border }]}><Ionicons name="camera-outline" size={19} color={theme.colors.primary} /><Text style={[styles.secondaryActionText, { color: theme.colors.text }]}>Scan a clear end grain</Text></TouchableOpacity>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  notice: { alignItems: 'flex-start', borderRadius: radius.md, flexDirection: 'row', gap: 9, marginBottom: space.md, padding: 14 }, noticeText: { flex: 1, fontSize: 12, lineHeight: 18 },
  hero: { borderRadius: radius.lg, padding: space.lg }, eyebrow: { fontSize: typeScale.eyebrow, fontWeight: '900', letterSpacing: 1.2 }, name: { fontSize: 30, fontWeight: '900', letterSpacing: -1, marginTop: 8 }, botanical: { color: '#DCE8DE', fontSize: 14, fontStyle: 'italic', marginTop: 5 }, heroRule: { backgroundColor: 'rgba(255,255,255,0.18)', height: 1, marginTop: 18 }, localName: { color: '#DCE8DE', fontSize: 13, marginTop: 13 },
  card: { borderRadius: radius.lg, borderWidth: 1, marginTop: space.md, padding: space.md }, cardHeading: { alignItems: 'center', flexDirection: 'row', gap: 10 }, icon: { alignItems: 'center', borderRadius: radius.sm, height: 36, justifyContent: 'center', width: 36 }, cardTitle: { fontSize: 16, fontWeight: '900' }, body: { fontSize: 14, lineHeight: 21, marginTop: 13 }, price: { fontSize: 26, fontWeight: '900', letterSpacing: -0.6, marginTop: 13 }, perBoardFoot: { fontSize: 14, fontWeight: '700' },
  action: { alignItems: 'center', borderRadius: radius.md, flexDirection: 'row', gap: 10, marginTop: space.lg, minHeight: 58, paddingHorizontal: 16 }, actionText: { flex: 1, fontSize: 15, fontWeight: '900' }, secondaryAction: { alignItems: 'center', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 10, justifyContent: 'center', marginTop: space.sm, minHeight: 54 }, secondaryActionText: { fontSize: 14, fontWeight: '900' },
});
