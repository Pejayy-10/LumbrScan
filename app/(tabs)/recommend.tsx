import React, { useEffect, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppScreen } from '../../components/ui/AppScreen';
import { radius, space, typeScale } from '../../constants/appTheme';
import { REFERENCE_USES, ReferenceUseId, USE_REFERENCES } from '../../constants/suitabilityReferences';
import { SUPPORTED_SPECIES, SUPPORTED_SPECIES_IDS, SupportedSpeciesId } from '../../constants/supportedSpecies';
import { useAppTheme } from '../../hooks/useAppTheme';

export default function RecommendScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ species?: string }>();
  const [mode, setMode] = useState<'species' | 'use'>('use');
  const [selectedSpecies, setSelectedSpecies] = useState<SupportedSpeciesId>('coconut');
  const [selectedUse, setSelectedUse] = useState<ReferenceUseId>('furniture');

  useEffect(() => {
    if (typeof params.species === 'string' && (SUPPORTED_SPECIES_IDS as readonly string[]).includes(params.species)) {
      setSelectedSpecies(params.species as SupportedSpeciesId);
      setMode('species');
    }
  }, [params.species]);

  const openSource = async (url: string) => {
    try { await Linking.openURL(url); }
    catch { Alert.alert('Source unavailable', 'Connect to the internet to open this source. The reference summary remains available offline.'); }
  };
  const results = mode === 'species'
    ? REFERENCE_USES.map((use) => ({ key: use.id, title: use.label, reference: USE_REFERENCES.find((item) => item.speciesId === selectedSpecies && item.useId === use.id) }))
    : SUPPORTED_SPECIES.map((species) => ({ key: species.id, title: species.commonName.replace(' (Coco Lumber)', ''), reference: USE_REFERENCES.find((item) => item.speciesId === species.id && item.useId === selectedUse) }));

  return <AppScreen>
    <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>OFFLINE REFERENCE</Text>
    <Text style={[styles.title, { color: theme.colors.text }]}>Explore timber uses.</Text>
    <Text style={[styles.body, { color: theme.colors.textMuted }]}>Browse documented species-level uses in either direction. This does not assess the photographed board.</Text>
    <View style={styles.choices}>{([{ id: 'use', label: 'Use → species' }, { id: 'species', label: 'Species → uses' }] as const).map((item) => <TouchableOpacity key={item.id} accessibilityRole="radio" accessibilityState={{ selected: mode === item.id }} onPress={() => setMode(item.id)} style={[styles.choice, { borderColor: mode === item.id ? theme.colors.primary : theme.colors.border, backgroundColor: mode === item.id ? theme.colors.primarySoft : theme.colors.surface }]}><Text style={[styles.choiceText, { color: theme.colors.text }]}>{item.label}</Text></TouchableOpacity>)}</View>
    <Text style={[styles.label, { color: theme.colors.textMuted }]}>{mode === 'use' ? 'CHOOSE AN INTENDED USE' : 'CHOOSE A SPECIES'}</Text>
    <View style={styles.wrap}>{mode === 'use' ? REFERENCE_USES.map((item) => <TouchableOpacity key={item.id} accessibilityRole="radio" accessibilityState={{ selected: selectedUse === item.id }} onPress={() => setSelectedUse(item.id)} style={[styles.pill, { borderColor: selectedUse === item.id ? theme.colors.primary : theme.colors.border, backgroundColor: selectedUse === item.id ? theme.colors.primarySoft : theme.colors.surface }]}><Text style={[styles.choiceText, { color: theme.colors.text }]}>{item.label}</Text></TouchableOpacity>) : SUPPORTED_SPECIES.map((item) => <TouchableOpacity key={item.id} accessibilityRole="radio" accessibilityState={{ selected: selectedSpecies === item.id }} onPress={() => setSelectedSpecies(item.id as SupportedSpeciesId)} style={[styles.pill, { borderColor: selectedSpecies === item.id ? theme.colors.primary : theme.colors.border, backgroundColor: selectedSpecies === item.id ? theme.colors.primarySoft : theme.colors.surface }]}><Text style={[styles.choiceText, { color: theme.colors.text }]}>{item.commonName.replace(' (Coco Lumber)', '')}</Text></TouchableOpacity>)}</View>
    {results.map((item) => <View key={item.key} style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{item.title}</Text>
      <Text style={[styles.status, { color: item.reference ? theme.colors.primary : theme.colors.warning }]}>{item.reference ? 'DOCUMENTED USE' : 'INSUFFICIENT REFERENCE'}</Text>
      <Text style={[styles.body, { color: theme.colors.textMuted }]}>{item.reference?.detail ?? 'We have not verified a source for this combination. This does not mean the species cannot be used for it.'}</Text>
      {item.reference && <><Text style={[styles.source, { color: theme.colors.textMuted }]}>{item.reference.source}</Text><TouchableOpacity accessibilityRole="link" onPress={() => void openSource(item.reference!.url)} style={styles.action}><Ionicons name="open-outline" size={17} color={theme.colors.primary} /><Text style={[styles.link, { color: theme.colors.primary }]}>Open source (internet required)</Text></TouchableOpacity></>}
      {mode === 'use' && item.reference && <TouchableOpacity accessibilityRole="button" onPress={() => router.push({ pathname: '/estimator', params: { species: item.key } })} style={styles.action}><Ionicons name="calculator-outline" size={17} color={theme.colors.primary} /><Text style={[styles.link, { color: theme.colors.primary }]}>Compare estimated cost</Text></TouchableOpacity>}
    </View>)}
    <View style={[styles.note, { backgroundColor: theme.colors.warningSoft }]}><Ionicons name="information-circle-outline" size={19} color={theme.colors.warning} /><Text style={[styles.noteText, { color: theme.colors.text }]}>Documented use is not a structural grade, a safety certification, or proof of legal status. Condition, dimensions, treatment and local requirements must be checked separately. DENR status remains unverified; see the catalogue.</Text></View>
  </AppScreen>;
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: typeScale.eyebrow, fontWeight: '900', letterSpacing: 1.3 }, title: { fontSize: typeScale.display, fontWeight: '900', letterSpacing: -1, marginTop: 7 }, body: { fontSize: 14, lineHeight: 21, marginTop: 9 },
  choices: { flexDirection: 'row', gap: 8, marginTop: space.lg }, choice: { flex: 1, minHeight: 48, borderWidth: 1, borderRadius: radius.sm, justifyContent: 'center', alignItems: 'center', padding: 8 }, choiceText: { fontSize: 13, fontWeight: '800', textAlign: 'center' }, label: { fontSize: 11, fontWeight: '900', letterSpacing: 1, marginTop: space.lg }, wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }, pill: { minHeight: 44, borderWidth: 1, borderRadius: radius.sm, justifyContent: 'center', paddingHorizontal: 14 },
  card: { borderRadius: radius.md, borderWidth: 1, marginTop: space.md, padding: space.md }, cardTitle: { fontSize: 17, fontWeight: '900' }, status: { fontSize: 11, fontWeight: '900', letterSpacing: 0.5, marginTop: 10 }, source: { fontSize: 12, lineHeight: 18, marginTop: 10 }, action: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 }, link: { fontSize: 13, fontWeight: '800' }, note: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, borderRadius: radius.md, marginTop: space.lg, padding: 14 }, noteText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
