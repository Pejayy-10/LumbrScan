import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppScreen } from '../../components/ui/AppScreen';
import { radius, space, typeScale } from '../../constants/appTheme';
import { SUPPORTED_SPECIES } from '../../constants/supportedSpecies';
import { useAppTheme } from '../../hooks/useAppTheme';

export default function KnowledgeScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const [query, setQuery] = useState('');
  const species = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return SUPPORTED_SPECIES;
    return SUPPORTED_SPECIES.filter((item) => [item.commonName, item.botanicalName, item.localName].some((value) => value.toLowerCase().includes(normalized)));
  }, [query]);

  return (
    <AppScreen>
      <View>
        <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>REFERENCE CATALOG</Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>Three species, clearly scoped.</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Browse only the species currently supported by the offline prototype.</Text>
      </View>

      <View style={[styles.search, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Ionicons name="search-outline" size={19} color={theme.colors.textMuted} />
        <TextInput
          accessibilityLabel="Search the species catalog"
          placeholder="Search Coconut, Gmelina, or Mango"
          placeholderTextColor={theme.colors.textMuted}
          selectionColor={theme.colors.primary}
          style={[styles.input, { color: theme.colors.text }]}
          value={query}
          onChangeText={setQuery}
        />
        {query ? <TouchableOpacity accessibilityLabel="Clear catalog search" accessibilityRole="button" onPress={() => setQuery('')}><Ionicons name="close-circle" size={19} color={theme.colors.textMuted} /></TouchableOpacity> : null}
      </View>

      <Text style={[styles.count, { color: theme.colors.textMuted }]}>{species.length} supported species</Text>
      <View style={styles.list}>
        {species.map((item) => (
          <View key={item.id}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Open ${item.commonName} reference`}
              activeOpacity={0.82}
              onPress={() => router.navigate(`/species/${item.id}`)}
              style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            >
              <View style={[styles.woodMark, { backgroundColor: item.colorHex }]}><Ionicons name="leaf-outline" size={20} color="#FFFFFF" /></View>
              <View style={styles.cardCopy}>
                <Text style={[styles.name, { color: theme.colors.text }]}>{item.commonName}</Text>
                <Text style={[styles.botanical, { color: theme.colors.textMuted }]}>{item.botanicalName}</Text>
                <Text numberOfLines={2} style={[styles.grain, { color: theme.colors.textMuted }]}>{item.grainCharacteristics}</Text>
                <Text style={[styles.price, { color: theme.colors.primary }]}>Reference price: ₱{item.pricePerBoardFootPhp.min}–₱{item.pricePerBoardFootPhp.max} / bd.ft</Text>
              </View>
              <Ionicons name="chevron-forward" size={19} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {species.length === 0 ? <View style={[styles.empty, { backgroundColor: theme.colors.surfaceMuted }]}><Ionicons name="search-outline" size={26} color={theme.colors.textMuted} /><Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No species found</Text><Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>Try Coconut, Gmelina, or Mango.</Text></View> : null}
      <View style={[styles.note, { backgroundColor: theme.colors.accentSoft, borderColor: theme.colors.border }]}><Ionicons name="bookmark-outline" size={18} color={theme.colors.warning} /><Text style={[styles.noteText, { color: theme.colors.textMuted }]}>Price ranges are project reference values. Verify current local market pricing before purchase or construction decisions.</Text></View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: typeScale.eyebrow, fontWeight: '900', letterSpacing: 1.3 },
  title: { fontSize: typeScale.display, fontWeight: '900', letterSpacing: -1.1, marginTop: 7 },
  subtitle: { fontSize: 15, lineHeight: 21, marginTop: 8 },
  search: { alignItems: 'center', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 10, marginTop: space.lg, minHeight: 52, paddingHorizontal: 15 },
  input: { flex: 1, fontSize: 14, minHeight: 48 },
  count: { fontSize: 12, fontWeight: '800', marginBottom: 10, marginTop: space.lg },
  list: { gap: 10 },
  card: { alignItems: 'center', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 12, minHeight: 128, padding: 14 },
  woodMark: { alignItems: 'center', borderRadius: 14, height: 46, justifyContent: 'center', width: 46 },
  cardCopy: { flex: 1 },
  name: { fontSize: 17, fontWeight: '900' },
  botanical: { fontSize: 12, fontStyle: 'italic', marginTop: 2 },
  grain: { fontSize: 12, lineHeight: 17, marginTop: 9 },
  price: { fontSize: 12, fontWeight: '800', marginTop: 8 },
  empty: { alignItems: 'center', borderRadius: radius.md, marginTop: 10, padding: 28 },
  emptyTitle: { fontSize: 16, fontWeight: '900', marginTop: 10 },
  emptyText: { fontSize: 13, marginTop: 4 },
  note: { alignItems: 'flex-start', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 10, marginTop: space.lg, padding: 14 },
  noteText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
