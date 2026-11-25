import React from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, space } from '../../constants/appTheme';
import { useAppTheme } from '../../hooks/useAppTheme';

const DENR_SOURCE = 'https://faolex.fao.org/docs/pdf/phi245187.pdf';
const REVIEWED_SPECIES: Record<string, string> = {
  coconut: 'Cocos nucifera',
  gmelina: 'Gmelina arborea',
  mango: 'Mangifera indica',
};

export function DenrStatusCard({ speciesId }: { speciesId?: string }) {
  const theme = useAppTheme();
  const scientificName = speciesId ? REVIEWED_SPECIES[speciesId] : undefined;
  const openSource = async () => {
    try {
      await Linking.openURL(DENR_SOURCE);
    } catch {
      Alert.alert('Source unavailable', 'Connect to the internet to open the DENR document.');
    }
  };
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.heading}>
        <View style={[styles.icon, { backgroundColor: theme.colors.warningSoft }]}><Ionicons name="shield-outline" size={20} color={theme.colors.warning} /></View>
        <View style={styles.copy}><Text style={[styles.eyebrow, { color: theme.colors.warning }]}>REGULATORY REFERENCE</Text><Text style={[styles.title, { color: theme.colors.text }]}>DENR status</Text></View>
      </View>
      <Text style={[styles.status, { color: theme.colors.text }]}>{scientificName ? 'Not identified in critically endangered list' : 'Requires verification'}</Text>
      <Text style={[styles.body, { color: theme.colors.textMuted }]}>{scientificName ? `Team review of DAO 2026-20 did not identify ${scientificName} in the critically endangered category. This is not confirmation of other categories or legal requirements. Other species with similar names may be listed.` : 'The conservation category has not been verified for this species.'} A photo prediction cannot establish species identity or legal status. Confirm current requirements with the relevant authority before acting.</Text>
      <TouchableOpacity accessibilityRole="link" accessibilityLabel="Open DENR Administrative Order 2026-20 source; internet required" onPress={() => void openSource()} style={styles.link}>
        <Ionicons name="document-text-outline" size={18} color={theme.colors.primary} />
        <Text style={[styles.linkText, { color: theme.colors.primary }]}>DENR DAO 2026-20 source (online)</Text>
        <Ionicons name="open-outline" size={16} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, borderWidth: 1, marginTop: space.md, padding: space.md },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 42, height: 42, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1 },
  eyebrow: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  title: { fontSize: 16, fontWeight: '900', marginTop: 3 },
  status: { fontSize: 14, fontWeight: '800', marginTop: 16 },
  body: { fontSize: 13, lineHeight: 20, marginTop: 6 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 48, marginTop: 8 },
  linkText: { flexShrink: 1, fontSize: 13, fontWeight: '700' },
});
