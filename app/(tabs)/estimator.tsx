import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppScreen } from '../../components/ui/AppScreen';
import { radius, space, typeScale } from '../../constants/appTheme';
import { SUPPORTED_SPECIES } from '../../constants/supportedSpecies';
import { useAppTheme } from '../../hooks/useAppTheme';

const formatPeso = (value: number) => `₱${value.toLocaleString('en-PH', { maximumFractionDigits: 2 })}`;
const parsePositive = (value: string) => {
  const trimmed = value.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export default function EstimatorScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ species?: string }>();
  const [boardFeetText, setBoardFeetText] = useState('100');
  const [budgetText, setBudgetText] = useState('');
  const [selectedId, setSelectedId] = useState(SUPPORTED_SPECIES[0].id);
  const [sortByPrice, setSortByPrice] = useState(false);
  useEffect(() => {
    const match = SUPPORTED_SPECIES.find((item) => item.id === params.species);
    if (match) setSelectedId(match.id);
  }, [params.species]);
  const boardFeet = parsePositive(boardFeetText);
  const budget = parsePositive(budgetText);
  const budgetInvalid = budgetText.trim() !== '' && budget === null;
  const species = useMemo(() => SUPPORTED_SPECIES.find((item) => item.id === selectedId) ?? SUPPORTED_SPECIES[0], [selectedId]);
  const comparisons = useMemo(() => {
    if (boardFeet === null) return [];
    const items = SUPPORTED_SPECIES.map((item) => ({
      species: item,
      low: boardFeet * item.pricePerBoardFootPhp.min,
      high: boardFeet * item.pricePerBoardFootPhp.max,
    }));
    return sortByPrice ? items.sort((a, b) => a.low - b.low) : items;
  }, [boardFeet, sortByPrice]);
  const selected = comparisons.find((item) => item.species.id === species.id);

  const budgetLabel = (low: number, high: number) => {
    if (budget === null) return null;
    if (high <= budget) return 'Entire estimate within budget';
    if (low <= budget) return 'Part of estimate within budget';
    return 'Estimate above budget';
  };

  return (
    <AppScreen>
      <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>PRICE REFERENCE</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>Plan a material budget.</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Compare estimated costs for the three supported species using the project’s reference prices.</Text>

      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>PREFERRED SPECIES</Text>
        <View style={styles.choices}>
          {SUPPORTED_SPECIES.map((item) => {
            const active = item.id === species.id;
            return <TouchableOpacity key={item.id} accessibilityRole="radio" accessibilityState={{ selected: active }} onPress={() => setSelectedId(item.id)} style={[styles.choice, { borderColor: active ? theme.colors.primary : theme.colors.border, backgroundColor: active ? theme.colors.primarySoft : theme.colors.surfaceMuted }]}><Text style={[styles.choiceText, { color: active ? theme.colors.primary : theme.colors.text }]}>{item.commonName.replace(' (Coco Lumber)', '')}</Text></TouchableOpacity>;
          })}
        </View>
        <Text style={[styles.label, { color: theme.colors.textMuted, marginTop: 22 }]}>QUANTITY IN BOARD FEET</Text>
        <View style={[styles.inputWrap, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}><Ionicons name="cube-outline" size={19} color={theme.colors.primary} /><TextInput accessibilityLabel="Board feet quantity" keyboardType="decimal-pad" selectionColor={theme.colors.primary} value={boardFeetText} onChangeText={setBoardFeetText} style={[styles.input, { color: theme.colors.text }]} /><Text style={[styles.unit, { color: theme.colors.textMuted }]}>bd.ft</Text></View>
        {boardFeet === null && <Text style={[styles.validation, { color: theme.colors.warning }]}>Enter a quantity greater than zero.</Text>}
        <Text style={[styles.label, { color: theme.colors.textMuted, marginTop: 22 }]}>MAXIMUM BUDGET · OPTIONAL</Text>
        <View style={[styles.inputWrap, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}><Text style={[styles.peso, { color: theme.colors.primary }]}>₱</Text><TextInput accessibilityLabel="Maximum budget in pesos" keyboardType="decimal-pad" placeholder="Add a budget" placeholderTextColor={theme.colors.textMuted} selectionColor={theme.colors.primary} value={budgetText} onChangeText={setBudgetText} style={[styles.input, { color: theme.colors.text }]} /></View>
        {budgetInvalid && <Text style={[styles.validation, { color: theme.colors.warning }]}>Enter a budget greater than zero, or leave it blank.</Text>}
      </View>

      {selected && <View style={[styles.result, { backgroundColor: theme.colors.surfaceStrong }]}>
        <Text style={[styles.resultEyebrow, { color: theme.colors.accent }]}>YOUR PREFERRED SPECIES</Text>
        <Text style={[styles.resultTitle, { color: theme.colors.textOnStrong }]}>{formatPeso(selected.low)} – {formatPeso(selected.high)}</Text>
        <Text style={[styles.resultText, { color: '#DCE8DE' }]}>{boardFeet?.toLocaleString('en-PH')} bd.ft × {formatPeso(species.pricePerBoardFootPhp.min)}–{formatPeso(species.pricePerBoardFootPhp.max)} per bd.ft</Text>
        {budget !== null && <Text style={[styles.resultText, { color: theme.colors.textOnStrong }]}>{budgetLabel(selected.low, selected.high)}</Text>}
      </View>}

      {comparisons.length > 0 && <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Compare species</Text>
        <Text style={[styles.helper, { color: theme.colors.textMuted }]}>Same quantity for each species. Tap one to make it your preference.</Text>
        <TouchableOpacity accessibilityRole="checkbox" accessibilityState={{ checked: sortByPrice }} onPress={() => setSortByPrice(!sortByPrice)} style={styles.sortControl}><Ionicons name={sortByPrice ? 'checkbox' : 'square-outline'} size={21} color={theme.colors.primary} /><Text style={[styles.sortText, { color: theme.colors.text }]}>Show lowest starting price first</Text></TouchableOpacity>
        {comparisons.map((item) => <TouchableOpacity key={item.species.id} accessibilityRole="button" onPress={() => setSelectedId(item.species.id)} style={[styles.comparison, { borderColor: theme.colors.border }]}>
          <View style={styles.comparisonHeader}><Text style={[styles.comparisonName, { color: theme.colors.text }]}>{item.species.commonName.replace(' (Coco Lumber)', '')}{item.species.id === selectedId ? ' · Preferred' : ''}</Text><Ionicons name="chevron-forward" size={17} color={theme.colors.textMuted} /></View>
          <Text style={[styles.comparisonPrice, { color: theme.colors.primary }]}>{formatPeso(item.low)} – {formatPeso(item.high)}</Text>
          {budget !== null && <Text style={[styles.helper, { color: theme.colors.textMuted }]}>{budgetLabel(item.low, item.high)}</Text>}
        </TouchableOpacity>)}
        {budget !== null && <Text style={[styles.helper, { color: theme.colors.textMuted }]}>A partial match means the lower estimate fits, but the upper estimate exceeds your budget.</Text>}
      </View>}

      <TouchableOpacity onPress={() => router.navigate(`/species/${species.id}`)} style={[styles.reference, { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.border }]} accessibilityRole="button"><Ionicons name="book-outline" size={19} color={theme.colors.primary} /><Text style={[styles.referenceText, { color: theme.colors.text }]}>View {species.commonName.replace(' (Coco Lumber)', '')} reference</Text><Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} /></TouchableOpacity>
      <View style={[styles.note, { backgroundColor: theme.colors.accentSoft }]}><Ionicons name="information-circle-outline" size={18} color={theme.colors.warning} /><Text style={[styles.noteText, { color: theme.colors.textMuted }]}>Material cost only. Prices are project references, not live supplier quotes; labour, delivery, and other costs are excluded. Budget fit does not establish construction suitability.</Text></View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: typeScale.eyebrow, fontWeight: '900', letterSpacing: 1.3 }, title: { fontSize: typeScale.display, fontWeight: '900', letterSpacing: -1.1, marginTop: 7 }, subtitle: { fontSize: 15, lineHeight: 21, marginTop: 8 },
  card: { borderRadius: radius.lg, borderWidth: 1, marginTop: space.lg, padding: space.md }, label: { fontSize: 11, fontWeight: '900', letterSpacing: 1 }, choices: { flexDirection: 'row', gap: 8, marginTop: 10 }, choice: { alignItems: 'center', borderRadius: 12, borderWidth: 1, flex: 1, minHeight: 46, justifyContent: 'center', paddingHorizontal: 5 }, choiceText: { fontSize: 12, fontWeight: '900' },
  inputWrap: { alignItems: 'center', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 9, marginTop: 10, minHeight: 54, paddingHorizontal: 14 }, input: { flex: 1, fontSize: 18, fontWeight: '900', minHeight: 48 }, unit: { fontSize: 13, fontWeight: '800' }, peso: { fontSize: 19, fontWeight: '900' }, validation: { fontSize: 12, marginTop: 6 },
  result: { borderRadius: radius.lg, marginTop: space.lg, padding: space.lg }, resultEyebrow: { fontSize: 11, fontWeight: '900', letterSpacing: 1.1 }, resultTitle: { fontSize: 26, fontWeight: '900', letterSpacing: -0.6, marginTop: 9 }, resultText: { fontSize: 12, lineHeight: 18, marginTop: 9 },
  sectionTitle: { fontSize: 17, fontWeight: '900' }, helper: { fontSize: 12, lineHeight: 18, marginTop: 6 }, sortControl: { alignItems: 'center', flexDirection: 'row', gap: 9, minHeight: 46 }, sortText: { fontSize: 13, fontWeight: '700' }, comparison: { borderTopWidth: 1, paddingVertical: 13 }, comparisonHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, comparisonName: { flex: 1, fontSize: 14, fontWeight: '800' }, comparisonPrice: { fontSize: 15, fontWeight: '900', marginTop: 5 },
  reference: { alignItems: 'center', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 10, marginTop: space.lg, minHeight: 60, paddingHorizontal: 14 }, referenceText: { flex: 1, fontSize: 14, fontWeight: '800' }, note: { alignItems: 'flex-start', borderRadius: radius.md, flexDirection: 'row', gap: 9, marginTop: space.lg, padding: 14 }, noteText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
