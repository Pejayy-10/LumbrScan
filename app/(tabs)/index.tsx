// LumbrScan Main Dashboard — TripGlide Sample UI Aesthetic
// Soft light canvas (#F4F6F8), charcoal pill chips (#1A1D1F), 24px-32px rounded cards

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPECIES_DICTIONARY } from '../../constants/domain';
import { FprdiBadge } from '../../components/ui/FprdiBadge';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'NATIVE' | 'PLANTATION'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Declarative redirect — only fires after the navigator tree is fully mounted
  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  const speciesList = Object.values(SPECIES_DICTIONARY);

  const filteredSpecies = speciesList.filter((item) => {
    const matches =
      item.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.botanicalName.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeCategory === 'NATIVE') return matches && item.category === 'NATIVE_REGULATED_HARDWOOD';
    if (activeCategory === 'PLANTATION') return matches && item.category === 'PLANTATION_PALM_FRUIT_WOOD';
    return matches;
  });

  const heroSpecies = SPECIES_DICTIONARY.narra;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: 120 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header Row (Greeting & Avatar) ── */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greetingTitle}>Hello, Inspector</Text>
          <Text style={styles.greetingSub}>Welcome to LumbrScan AI</Text>
        </View>
        <View style={styles.avatarCircle}>
          <MaterialCommunityIcons name="leaf" size={22} color="#10B981" />
        </View>
      </View>

      {/* ── Search Bar with Filter Button ── */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search timber species or uses..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => router.push('/knowledge')}
          activeOpacity={0.8}
        >
          <Ionicons name="options-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── Horizontal Category Scroll Pills ── */}
      <Text style={styles.sectionHeading}>Select Species Category</Text>
      <View style={styles.categoryRow}>
        {(
          [
            { id: 'ALL', label: 'All Timber' },
            { id: 'NATIVE', label: 'Native Regulated' },
            { id: 'PLANTATION', label: 'Plantation / Palms' },
          ] as const
        ).map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryChip,
              activeCategory === cat.id && styles.categoryChipActive,
            ]}
            onPress={() => setActiveCategory(cat.id)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.categoryChipText,
                activeCategory === cat.id && styles.categoryChipTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── TripGlide Hero Featured Species Card ── */}
      <TouchableOpacity
        style={styles.heroCard}
        onPress={() => router.push(`/species/${heroSpecies.id}`)}
        activeOpacity={0.9}
      >
        <Image
          source={require('../../assets/onboarding_hero.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Rating Badge Overlay */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={styles.ratingText}>5.0</Text>
          <Text style={styles.ratingSub}>• FPRDI Group II</Text>
        </View>

        {/* Card Overlay Info */}
        <View style={styles.heroOverlay}>
          <Text style={styles.heroCategoryText}>FEATURED HARDWOOD</Text>
          <Text style={styles.heroSpeciesTitle}>{heroSpecies.commonName}</Text>
          <Text style={styles.heroBotanical}>{heroSpecies.botanicalName}</Text>

          {/* Dark Action Pill Button */}
          <View style={styles.heroActionPill}>
            <Text style={styles.heroActionText}>See full specs</Text>
            <View style={styles.actionArrowCircle}>
              <Ionicons name="chevron-forward" size={14} color="#1A1D1F" />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* ── Quick Access Tools ── */}
      <Text style={styles.sectionHeading}>Quick Access Tools</Text>
      <View style={styles.toolsGrid}>
        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => router.push('/estimator')}
          activeOpacity={0.85}
        >
          <View style={[styles.toolIconCircle, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="calculator" size={20} color="#D97706" />
          </View>
          <Text style={styles.toolTitle}>Timber Estimator</Text>
          <Text style={styles.toolSub}>Board Feet & Budget</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => router.push('/history')}
          activeOpacity={0.85}
        >
          <View style={[styles.toolIconCircle, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="time" size={20} color="#10B981" />
          </View>
          <Text style={styles.toolTitle}>Scan History</Text>
          <Text style={styles.toolSub}>Saved Reports</Text>
        </TouchableOpacity>
      </View>

      {/* ── Species List Cards ── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>Filtered Species ({filteredSpecies.length})</Text>
        <TouchableOpacity onPress={() => router.push('/knowledge')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      {filteredSpecies.map((species) => (
        <TouchableOpacity
          key={species.id}
          style={styles.speciesCard}
          onPress={() => router.push(`/species/${species.id}`)}
          activeOpacity={0.85}
        >
          <View style={styles.speciesHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.speciesName}>{species.commonName}</Text>
              <Text style={styles.botanicalName}>{species.botanicalName}</Text>
            </View>
            <FprdiBadge groupCode={species.fprdiGroup} size="sm" />
          </View>

          <Text style={styles.grainText} numberOfLines={2}>
            {species.grainCharacteristics}
          </Text>

          <View style={styles.speciesFooter}>
            <Text style={styles.priceText}>
              ₱{species.pricePerBoardFootPhp.min}–₱{species.pricePerBoardFootPhp.max} / bd.ft
            </Text>
            <View style={styles.arrowCircle}>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </View>
          </View>
        </TouchableOpacity>
      ))}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1D1F',
    letterSpacing: -0.5,
  },
  greetingSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 1,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 10,
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
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#1A1D1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1D1F',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: '#1A1D1F',
    borderColor: '#1A1D1F',
  },
  categoryChipText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  heroCard: {
    height: 280,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 24,
    backgroundColor: '#1A1D1F',
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  ratingText: {
    color: '#1A1D1F',
    fontSize: 12,
    fontWeight: '800',
  },
  ratingSub: {
    color: '#6B7280',
    fontSize: 11,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(26, 29, 31, 0.75)',
  },
  heroCategoryText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  heroSpeciesTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  heroBotanical: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 14,
  },
  heroActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  heroActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  actionArrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  toolCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 24,
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  toolIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  toolTitle: {
    color: '#1A1D1F',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  toolSub: {
    color: '#6B7280',
    fontSize: 11,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
  speciesCard: {
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
  speciesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  speciesName: {
    color: '#1A1D1F',
    fontSize: 17,
    fontWeight: '800',
  },
  botanicalName: {
    color: '#6B7280',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 1,
  },
  grainText: {
    color: '#4B5563',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  speciesFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  priceText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '700',
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1A1D1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
