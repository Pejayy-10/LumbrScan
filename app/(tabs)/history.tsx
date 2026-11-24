import React, { useMemo, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppScreen } from '../../components/ui/AppScreen';
import { radius, space, typeScale } from '../../constants/appTheme';
import { SPECIES_DICTIONARY } from '../../constants/domain';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useHistoryStore } from '../../stores/useHistoryStore';

function formatDate(timestamp: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(timestamp));
}

export default function HistoryScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const logs = useHistoryStore((state) => state.logs);
  const clearAllLogs = useHistoryStore((state) => state.clearAllLogs);
  const [query, setQuery] = useState('');

  const filteredLogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return logs;
    return logs.filter((log) => {
      const species = SPECIES_DICTIONARY[log.speciesId];
      return `${species.commonName} ${species.botanicalName}`.toLowerCase().includes(normalizedQuery);
    });
  }, [logs, query]);

  const confirmClear = () => Alert.alert('Clear local history?', 'This removes saved scan entries from this device. It does not remove any source images.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Clear history', style: 'destructive', onPress: clearAllLogs },
  ]);

  return (
    <AppScreen>
      <View style={styles.headingRow}>
        <View style={styles.headingCopy}>
          <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>ON THIS DEVICE</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>Scan history</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{logs.length} saved species-classification {logs.length === 1 ? 'record' : 'records'}.</Text>
        </View>
        {logs.length > 0 && <TouchableOpacity accessibilityRole="button" accessibilityLabel="Clear history" onPress={confirmClear} style={[styles.clearButton, { backgroundColor: theme.colors.warningSoft }]}><Ionicons name="trash-outline" size={19} color={theme.colors.danger} /></TouchableOpacity>}
      </View>

      <View style={[styles.search, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Ionicons name="search-outline" size={18} color={theme.colors.textMuted} />
        <TextInput accessibilityLabel="Search scan history" value={query} onChangeText={setQuery} placeholder="Search by species" placeholderTextColor={theme.colors.textMuted} style={[styles.searchInput, { color: theme.colors.text }]} />
        {query.length > 0 && <TouchableOpacity accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')}><Ionicons name="close-circle" size={18} color={theme.colors.textMuted} /></TouchableOpacity>}
      </View>

      {filteredLogs.length === 0 ? (
        <View style={[styles.empty, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.colors.primarySoft }]}><Ionicons name="time-outline" size={28} color={theme.colors.primary} /></View>
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>{logs.length === 0 ? 'No saved scans yet' : 'No matching scans'}</Text>
          <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>{logs.length === 0 ? 'Accepted offline species classifications will stay here on this device.' : 'Try a different species name.'}</Text>
          {logs.length === 0 && <TouchableOpacity accessibilityRole="button" onPress={() => router.navigate('/(tabs)/scan')} style={[styles.emptyAction, { backgroundColor: theme.colors.primary }]}><Text style={[styles.emptyActionText, { color: theme.colors.textOnStrong }]}>Go to scan</Text></TouchableOpacity>}
        </View>
      ) : filteredLogs.map((log) => {
        const species = SPECIES_DICTIONARY[log.speciesId];
        return <TouchableOpacity key={log.id} accessibilityRole="button" onPress={() => router.navigate(`/history/${log.id}`)} style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          {log.imageUri ? <Image source={{ uri: log.imageUri }} style={[styles.thumbnail, { backgroundColor: theme.colors.surfaceMuted }]} /> : <View style={[styles.thumbnail, { alignItems: 'center', backgroundColor: theme.colors.primarySoft, justifyContent: 'center' }]}><Ionicons name="image-outline" size={22} color={theme.colors.primary} /></View>}
          <View style={styles.cardCopy}>
            <Text style={[styles.speciesName, { color: theme.colors.text }]}>{species.commonName.replace(' (Coco Lumber)', '')}</Text>
            <Text style={[styles.botanical, { color: theme.colors.textMuted }]}>{species.botanicalName}</Text>
            <View style={styles.metaRow}><Text style={[styles.confidence, { color: theme.colors.primary }]}>{Math.round(log.confidence * 100)}% confidence</Text><Text style={[styles.meta, { color: theme.colors.textMuted }]}>{formatDate(log.timestamp)}</Text></View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </TouchableOpacity>;
      })}

      <Text style={[styles.disclaimer, { color: theme.colors.textMuted }]}>History records a species-classification result only. It is not an inspection, grading, or safety record.</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  headingRow: { alignItems: 'flex-start', flexDirection: 'row', gap: space.sm, justifyContent: 'space-between' }, headingCopy: { flex: 1 }, eyebrow: { fontSize: typeScale.eyebrow, fontWeight: '900', letterSpacing: 1.3 }, title: { fontSize: typeScale.display, fontWeight: '900', letterSpacing: -1.1, marginTop: 7 }, subtitle: { fontSize: 15, lineHeight: 21, marginTop: 8 }, clearButton: { alignItems: 'center', borderRadius: radius.pill, height: 42, justifyContent: 'center', width: 42 },
  search: { alignItems: 'center', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 9, marginTop: space.lg, minHeight: 54, paddingHorizontal: 14 }, searchInput: { flex: 1, fontSize: 14 },
  empty: { alignItems: 'center', borderRadius: radius.lg, borderWidth: 1, marginTop: space.lg, padding: space.xl }, emptyIcon: { alignItems: 'center', borderRadius: radius.pill, height: 58, justifyContent: 'center', width: 58 }, emptyTitle: { fontSize: 18, fontWeight: '900', marginTop: 14 }, emptyText: { fontSize: 14, lineHeight: 20, marginTop: 6, textAlign: 'center' }, emptyAction: { borderRadius: radius.md, marginTop: 18, paddingHorizontal: 20, paddingVertical: 12 }, emptyActionText: { fontSize: 14, fontWeight: '900' },
  card: { alignItems: 'center', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 12, marginTop: space.sm, minHeight: 94, padding: 10 }, thumbnail: { borderRadius: 12, height: 72, width: 72 }, cardCopy: { flex: 1 }, speciesName: { fontSize: 16, fontWeight: '900' }, botanical: { fontSize: 12, fontStyle: 'italic', marginTop: 3 }, metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }, confidence: { fontSize: 12, fontWeight: '900' }, meta: { fontSize: 12 }, disclaimer: { fontSize: 12, lineHeight: 18, marginTop: space.lg, textAlign: 'center' },
});
