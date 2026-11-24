import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppScreen } from '../../components/ui/AppScreen';
import { radius, space, typeScale } from '../../constants/appTheme';
import { SUPPORTED_SPECIES } from '../../constants/supportedSpecies';
import { useAppTheme } from '../../hooks/useAppTheme';

const formatPeso = (value: number) => `₱${Math.round(value).toLocaleString('en-PH')}`;

export default function EstimatorScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const [boardFeetText, setBoardFeetText] = useState('100');
  const [selectedId, setSelectedId] = useState(SUPPORTED_SPECIES[0].id);
  const boardFeet = Math.max(0, Number(boardFeetText) || 0);
  const species = useMemo(() => SUPPORTED_SPECIES.find((item) => item.id === selectedId) ?? SUPPORTED_SPECIES[0], [selectedId]);
  const low = boardFeet * species.pricePerBoardFootPhp.min;
  const high = boardFeet * species.pricePerBoardFootPhp.max;

  return (
    <AppScreen>
      <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>PRICE REFERENCE</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>Plan a material budget.</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>A simple board-foot estimate using the project’s reference prices for the three supported species.</Text>

      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>SELECT A SPECIES</Text>
        <View style={styles.choices}>{SUPPORTED_SPECIES.map((item) => { const active = item.id === species.id; return <TouchableOpacity key={item.id} accessibilityRole="radio" accessibilityState={{ selected: active }} onPress={() => setSelectedId(item.id)} style={[styles.choice, { borderColor: active ? theme.colors.primary : theme.colors.border, backgroundColor: active ? theme.colors.primarySoft : theme.colors.surfaceMuted }]}><Text style={[styles.choiceText, { color: active ? theme.colors.primary : theme.colors.text }]}>{item.commonName.replace(' (Coco Lumber)', '')}</Text></TouchableOpacity>; })}</View>
        <Text style={[styles.label, { color: theme.colors.textMuted, marginTop: 22 }]}>QUANTITY IN BOARD FEET</Text>
        <View style={[styles.inputWrap, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}><Ionicons name="cube-outline" size={19} color={theme.colors.primary} /><TextInput accessibilityLabel="Board feet quantity" keyboardType="decimal-pad" selectionColor={theme.colors.primary} value={boardFeetText} onChangeText={setBoardFeetText} style={[styles.input, { color: theme.colors.text }]} /><Text style={[styles.unit, { color: theme.colors.textMuted }]}>bd.ft</Text></View>
      </View>

      <View style={[styles.result, { backgroundColor: theme.colors.surfaceStrong }]}>
        <Text style={[styles.resultEyebrow, { color: theme.colors.accent }]}>ESTIMATED MATERIAL COST</Text>
        <Text style={[styles.resultTitle, { color: theme.colors.textOnStrong }]}>{formatPeso(low)} – {formatPeso(high)}</Text>
        <Text style={[styles.resultText, { color: '#DCE8DE' }]}>{boardFeet.toLocaleString('en-PH')} bd.ft × {formatPeso(species.pricePerBoardFootPhp.min)}–{formatPeso(species.pricePerBoardFootPhp.max)} per bd.ft</Text>
      </View>

      <TouchableOpacity onPress={() => router.navigate(`/species/${species.id}`)} style={[styles.reference, { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.border }]} accessibilityRole="button"><Ionicons name="book-outline" size={19} color={theme.colors.primary} /><Text style={[styles.referenceText, { color: theme.colors.text }]}>View {species.commonName.replace(' (Coco Lumber)', '')} reference</Text><Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} /></TouchableOpacity>
      <View style={[styles.note, { backgroundColor: theme.colors.accentSoft }]}><Ionicons name="information-circle-outline" size={18} color={theme.colors.warning} /><Text style={[styles.noteText, { color: theme.colors.textMuted }]}>This is a project price reference, not a supplier quotation, live market price, or construction recommendation.</Text></View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: typeScale.eyebrow, fontWeight: '900', letterSpacing: 1.3 }, title: { fontSize: typeScale.display, fontWeight: '900', letterSpacing: -1.1, marginTop: 7 }, subtitle: { fontSize: 15, lineHeight: 21, marginTop: 8 },
  card: { borderRadius: radius.lg, borderWidth: 1, marginTop: space.lg, padding: space.md }, label: { fontSize: 11, fontWeight: '900', letterSpacing: 1 }, choices: { flexDirection: 'row', gap: 8, marginTop: 10 }, choice: { alignItems: 'center', borderRadius: 12, borderWidth: 1, flex: 1, minHeight: 46, justifyContent: 'center', paddingHorizontal: 5 }, choiceText: { fontSize: 12, fontWeight: '900' },
  inputWrap: { alignItems: 'center', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 9, marginTop: 10, minHeight: 54, paddingHorizontal: 14 }, input: { flex: 1, fontSize: 18, fontWeight: '900' }, unit: { fontSize: 13, fontWeight: '800' },
  result: { borderRadius: radius.lg, marginTop: space.lg, padding: space.lg }, resultEyebrow: { fontSize: 11, fontWeight: '900', letterSpacing: 1.1 }, resultTitle: { fontSize: 26, fontWeight: '900', letterSpacing: -0.6, marginTop: 9 }, resultText: { fontSize: 12, lineHeight: 18, marginTop: 9 },
  reference: { alignItems: 'center', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 10, marginTop: space.lg, minHeight: 60, paddingHorizontal: 14 }, referenceText: { flex: 1, fontSize: 14, fontWeight: '800' }, note: { alignItems: 'flex-start', borderRadius: radius.md, flexDirection: 'row', gap: 9, marginTop: space.lg, padding: 14 }, noteText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
