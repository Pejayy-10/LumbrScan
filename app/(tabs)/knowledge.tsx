// LumbrScan Module 3: Knowledge Base & Legal Regulatory Lookup Screen
// Light Nature Theme

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPECIES_DICTIONARY, TimberSpecies } from '../../constants/domain';
import { FprdiBadge } from '../../components/ui/FprdiBadge';
import { DenrBadge } from '../../components/ui/DenrBadge';

export default function KnowledgeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'NATIVE' | 'PLANTATION'>('ALL');

  const speciesList = Object.values(SPECIES_DICTIONARY);

  const filteredSpecies = speciesList.filter((item) => {
    const matchesSearch =
      item.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.botanicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.localName.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeCategory === 'NATIVE') {
      return matchesSearch && item.category === 'NATIVE_REGULATED_HARDWOOD';
    }
    if (activeCategory === 'PLANTATION') {
      return matchesSearch && item.category === 'PLANTATION_PALM_FRUIT_WOOD';
    }
    return matchesSearch;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: 120 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Page Header ── */}
      <Text style={styles.pageTitle}>Species Catalog</Text>
      <Text style={styles.pageSubtitle}>
        {filteredSpecies.length} of 11 Philippine timber species
      </Text>

      {/* ── Search Bar ── */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#40916C" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by common or botanical name..."
          placeholderTextColor="#95A99E"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#95A99E" />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Category Filter Tabs ── */}
      <View style={styles.tabRow}>
        {(
          [
            { id: 'ALL', label: 'All Species' },
            { id: 'NATIVE', label: 'Native Hardwoods' },
            { id: 'PLANTATION', label: 'Plantation & Palms' },
          ] as const
        ).map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabPill, activeCategory === tab.id && styles.tabPillActive]}
            onPress={() => setActiveCategory(tab.id)}
          >
            <Text
              style={[styles.tabText, activeCategory === tab.id && styles.tabTextActive]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Species Cards ── */}
      {filteredSpecies.map((species: TimberSpecies) => (
        <TouchableOpacity
          key={species.id}
          style={styles.card}
          onPress={() => router.push(`/species/${species.id}`)}
          activeOpacity={0.85}
        >
          {/* Left accent bar */}
          <View style={styles.accentBar} />

          <View style={styles.cardInner}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.commonName}>{species.commonName}</Text>
                <Text style={styles.botanicalName}>{species.botanicalName}</Text>
              </View>
              <FprdiBadge groupCode={species.fprdiGroup} size="sm" />
            </View>

            <Text style={styles.grainText} numberOfLines={2}>
              {species.grainCharacteristics}
            </Text>

            <DenrBadge statusCode={species.denrStatus} showNotice={false} />

            <View style={styles.usesRow}>
              {species.primaryUses.slice(0, 3).map((use, idx) => (
                <View key={idx} style={styles.usePill}>
                  <Text style={styles.usePillText}>{use}</Text>
                </View>
              ))}
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.localNameText}>
                Local: <Text style={{ fontStyle: 'italic' }}>{species.localName}</Text>
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#95A99E" />
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {filteredSpecies.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={40} color="#B7E4CC" />
          <Text style={styles.emptyTitle}>No species found</Text>
          <Text style={styles.emptyHint}>Try a different name or clear the filter.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8F5',
  },
  content: {
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1B4332',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#52796F',
    marginBottom: 18,
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 10,
    marginBottom: 14,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: '#1B4332',
    fontSize: 14,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1EEE3',
  },
  tabPillActive: {
    backgroundColor: '#2D6A4F',
    borderColor: '#2D6A4F',
  },
  tabText: {
    color: '#52796F',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  accentBar: {
    width: 4,
    backgroundColor: '#40916C',
  },
  cardInner: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 10,
  },
  commonName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1B4332',
  },
  botanicalName: {
    fontSize: 13,
    color: '#52796F',
    fontStyle: 'italic',
    marginTop: 2,
  },
  grainText: {
    color: '#52796F',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  usesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  usePill: {
    backgroundColor: '#EEF9F4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1EEE3',
  },
  usePillText: {
    color: '#2D6A4F',
    fontSize: 11,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  localNameText: {
    fontSize: 12,
    color: '#95A99E',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1B4332',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 13,
    color: '#52796F',
  },
});
