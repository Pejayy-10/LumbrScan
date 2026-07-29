// LumbrScan Module 3: Knowledge Base & Species Catalog Screen
// TripGlide Sample Aesthetic — Soft light canvas, dark charcoal pills

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
        {filteredSpecies.length} of 11 Philippine target timber species
      </Text>

      {/* ── Search Bar ── */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by common or botanical name..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Dark Pill Filter Bar ── */}
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
            activeOpacity={0.8}
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
            <Text style={styles.priceTag}>
              ₱{species.pricePerBoardFootPhp.min}–₱{species.pricePerBoardFootPhp.max} / bd.ft
            </Text>
            <View style={styles.arrowCircle}>
              <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {filteredSpecies.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={40} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No species found</Text>
          <Text style={styles.emptyHint}>Try a different search term or clear the filter.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  content: {
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1D1F',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 18,
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 10,
    marginBottom: 16,
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: '#1A1D1F',
    fontSize: 14,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabPillActive: {
    backgroundColor: '#1A1D1F',
    borderColor: '#1A1D1F',
  },
  tabText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
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
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1D1F',
  },
  botanicalName: {
    fontSize: 13,
    color: '#10B981',
    fontStyle: 'italic',
    marginTop: 2,
  },
  grainText: {
    color: '#4B5563',
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
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  usePillText: {
    color: '#1A1D1F',
    fontSize: 11,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  priceTag: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '700',
  },
  arrowCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1A1D1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1D1F',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 13,
    color: '#6B7280',
  },
});
