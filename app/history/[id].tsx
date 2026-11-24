import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppScreen } from '../../components/ui/AppScreen';
import { radius, space, typeScale } from '../../constants/appTheme';
import { SPECIES_DICTIONARY } from '../../constants/domain';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useHistoryStore } from '../../stores/useHistoryStore';

export default function HistoryDetailScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const log = useHistoryStore((state) => state.logs.find((entry) => entry.id === id));
  const deleteLog = useHistoryStore((state) => state.deleteLog);

  if (!log) return <AppScreen contentContainerStyle={styles.missing}><View style={[styles.missingIcon, { backgroundColor: theme.colors.warningSoft }]}><Ionicons name="time-outline" size={28} color={theme.colors.warning} /></View><Text style={[styles.missingTitle, { color: theme.colors.text }]}>Scan not found</Text><Text style={[styles.missingText, { color: theme.colors.textMuted }]}>This local history record may have been cleared from this device.</Text><TouchableOpacity onPress={() => router.back()} style={[styles.back, { backgroundColor: theme.colors.primary }]}><Text style={[styles.backText, { color: theme.colors.textOnStrong }]}>Back to history</Text></TouchableOpacity></AppScreen>;

  const species = SPECIES_DICTIONARY[log.speciesId];
  const removeRecord = () => Alert.alert('Delete saved scan?', 'This only removes the local history record.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => { deleteLog(log.id); router.back(); } }]);

  return <AppScreen>
    <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>SAVED OFFLINE RESULT</Text>
    <Text style={[styles.title, { color: theme.colors.text }]}>{species.commonName.replace(' (Coco Lumber)', '')}</Text>
    <Text style={[styles.botanical, { color: theme.colors.textMuted }]}>{species.botanicalName}</Text>
    {log.imageUri && <Image source={{ uri: log.imageUri }} style={[styles.image, { backgroundColor: theme.colors.surfaceMuted }]} />}
    <View style={[styles.result, { backgroundColor: theme.colors.surfaceStrong }]}><Text style={[styles.resultLabel, { color: theme.colors.accent }]}>CLASSIFICATION CONFIDENCE</Text><Text style={[styles.resultValue, { color: theme.colors.textOnStrong }]}>{Math.round(log.confidence * 100)}%</Text><Text style={styles.resultText}>Saved {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(log.timestamp))}</Text></View>
    <View style={[styles.note, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}><Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} /><Text style={[styles.noteText, { color: theme.colors.textMuted }]}>This is a local species-classification record. It does not evaluate defects, wood grade, safety, or construction suitability.</Text></View>
    <TouchableOpacity accessibilityRole="button" onPress={() => router.navigate(`/species/${species.id}`)} style={[styles.reference, { backgroundColor: theme.colors.primarySoft }]}><Ionicons name="book-outline" size={19} color={theme.colors.primary} /><Text style={[styles.referenceText, { color: theme.colors.text }]}>Open species reference</Text><Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} /></TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" onPress={removeRecord} style={[styles.delete, { borderColor: theme.colors.border }]}><Ionicons name="trash-outline" size={18} color={theme.colors.danger} /><Text style={[styles.deleteText, { color: theme.colors.danger }]}>Delete saved scan</Text></TouchableOpacity>
  </AppScreen>;
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: typeScale.eyebrow, fontWeight: '900', letterSpacing: 1.3 }, title: { fontSize: typeScale.display, fontWeight: '900', letterSpacing: -1.1, marginTop: 7 }, botanical: { fontSize: 14, fontStyle: 'italic', marginTop: 5 }, image: { borderRadius: radius.lg, height: 240, marginTop: space.lg, width: '100%' }, result: { borderRadius: radius.lg, marginTop: space.md, padding: space.lg }, resultLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 1.1 }, resultValue: { fontSize: 42, fontWeight: '900', letterSpacing: -1.6, marginTop: 5 }, resultText: { color: '#DCE8DE', fontSize: 12, lineHeight: 18, marginTop: 4 }, note: { alignItems: 'flex-start', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 10, marginTop: space.md, padding: 14 }, noteText: { flex: 1, fontSize: 12, lineHeight: 18 }, reference: { alignItems: 'center', borderRadius: radius.md, flexDirection: 'row', gap: 10, marginTop: space.lg, minHeight: 56, paddingHorizontal: 15 }, referenceText: { flex: 1, fontSize: 14, fontWeight: '900' }, delete: { alignItems: 'center', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: space.sm, minHeight: 54 }, deleteText: { fontSize: 14, fontWeight: '900' },
  missing: { alignItems: 'center', flexGrow: 1, justifyContent: 'center' }, missingIcon: { alignItems: 'center', borderRadius: radius.pill, height: 58, justifyContent: 'center', width: 58 }, missingTitle: { fontSize: 20, fontWeight: '900', marginTop: 14 }, missingText: { fontSize: 14, lineHeight: 20, marginTop: 6, textAlign: 'center' }, back: { borderRadius: radius.md, marginTop: 18, paddingHorizontal: 20, paddingVertical: 12 }, backText: { fontSize: 14, fontWeight: '900' },
});
