// LumbrScan Module 3: Knowledge Base & Legal Regulatory Lookup Screen

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
import { SPECIES_DICTIONARY, TimberSpecies } from '../../constants/domain';
import { FprdiBadge } from '../../components/ui/FprdiBadge';
import { DenrBadge } from '../../components/ui/DenrBadge';

export default function KnowledgeScreen() {
  const router = useRouter();
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. Search Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search 11 species by common or botanical name..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* 2. Category Filter Tabs */}
      <View style={styles.tabRow}>
        {(
          [
            { id: 'ALL', label: 'All 11 Species' },
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
              style={[
                styles.tabText,
                activeCategory === tab.id && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 3. Species List Cards */}
      {filteredSpecies.map((species: TimberSpecies) => (
        <TouchableOpacity
          key={species.id}
          style={styles.card}
          onPress={() => router.push(`/species/${species.id}`)}
          activeOpacity={0.85}
        >
          <View style={styles.cardHeader}>
            <View>
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
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  searchBox: {
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
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
    borderRadius: 8,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  tabPillActive: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#0F172A',
  },
  card: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  commonName: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '800',
  },
  botanicalName: {
    color: '#94A3B8',
    fontSize: 13,
    fontStyle: 'italic',
  },
  grainText: {
    color: '#CBD5E1',
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
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  usePillText: {
    color: '#94A3B8',
    fontSize: 11,
  },
});
