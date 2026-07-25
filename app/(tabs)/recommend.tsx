// LumbrScan Module 4: Two-Way Decision Support Recommendation Engine Screen
// Light Nature Theme

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecommenderStore } from '../../stores/useRecommenderStore';
import { CONSTRUCTION_APPLICATIONS, SPECIES_DICTIONARY } from '../../constants/domain';
import { SafetyCard } from '../../components/ui/SafetyCard';
import { FprdiBadge } from '../../components/ui/FprdiBadge';

export default function RecommendScreen() {
  const insets = useSafeAreaInsets();

  const {
    mode,
    setMode,
    selectedApplicationCode,
    setApplicationCode,
    isSearching,
    taskResult,
    fetchTaskRecommendations,
  } = useRecommenderStore();

  const [activeSpeciesKey, setActiveSpeciesKey] = useState<string>('apitong');

  useEffect(() => {
    if (mode === 'TASK_TO_MATERIAL') {
      fetchTaskRecommendations();
    }
  }, [mode, selectedApplicationCode]);

  const selectedSpecies = SPECIES_DICTIONARY[activeSpeciesKey] || SPECIES_DICTIONARY.apitong;

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
      <Text style={styles.pageTitle}>Recommender</Text>
      <Text style={styles.pageSubtitle}>
        Two-way timber suitability decision engine
      </Text>

      {/* ── Path Mode Switcher ── */}
      <View style={styles.modeSwitcher}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'TASK_TO_MATERIAL' && styles.modeBtnActive]}
          onPress={() => setMode('TASK_TO_MATERIAL')}
          activeOpacity={0.85}
        >
          <Ionicons
            name="construct-outline"
            size={16}
            color={mode === 'TASK_TO_MATERIAL' ? '#FFFFFF' : '#52796F'}
          />
          <Text
            style={[styles.modeBtnText, mode === 'TASK_TO_MATERIAL' && styles.modeBtnTextActive]}
          >
            Task → Material
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeBtn, mode === 'MATERIAL_TO_TASK' && styles.modeBtnActive]}
          onPress={() => setMode('MATERIAL_TO_TASK')}
          activeOpacity={0.85}
        >
          <Ionicons
            name="leaf-outline"
            size={16}
            color={mode === 'MATERIAL_TO_TASK' ? '#FFFFFF' : '#52796F'}
          />
          <Text
            style={[styles.modeBtnText, mode === 'MATERIAL_TO_TASK' && styles.modeBtnTextActive]}
          >
            Material → Task
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── PATH A: TASK-TO-MATERIAL ENGINE ── */}
      {mode === 'TASK_TO_MATERIAL' ? (
        <View>
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle-outline" size={18} color="#2D6A4F" />
            <Text style={styles.infoBannerText}>
              Select a construction application to find the best-suited Philippine timber species.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Construction Application</Text>

          <View style={styles.appGrid}>
            {CONSTRUCTION_APPLICATIONS.map((app) => (
              <TouchableOpacity
                key={app.code}
                style={[
                  styles.appCard,
                  selectedApplicationCode === app.code && styles.appCardActive,
                ]}
                onPress={() => setApplicationCode(app.code)}
                activeOpacity={0.85}
              >
                <View style={styles.appCardHeader}>
                  <View
                    style={[
                      styles.appCardDot,
                      selectedApplicationCode === app.code && styles.appCardDotActive,
                    ]}
                  />
                  <Text
                    style={[
                      styles.appCardTitle,
                      selectedApplicationCode === app.code && styles.appCardTitleActive,
                    ]}
                  >
                    {app.title}
                  </Text>
                </View>
                <Text style={styles.appCardSub}>Min. Required: {app.minimumFprdiGroup}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Recommended Timber Species</Text>

          {isSearching ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color="#2D6A4F" size="large" />
              <Text style={styles.loadingText}>Querying mock decision engine…</Text>
            </View>
          ) : (
            taskResult?.recommendedSpeciesList.map((item) => (
              <View key={item.id} style={styles.recommendCard}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankNum}>#{item.rank}</Text>
                </View>
                <View style={styles.recommendContent}>
                  <View style={styles.recommendHeader}>
                    <Text style={styles.speciesName}>{item.commonName}</Text>
                    <FprdiBadge groupCode={item.fprdiGroup} size="sm" />
                  </View>
                  <Text style={styles.advantagesText}>{item.keyAdvantages}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      ) : (
        /* ── PATH B: MATERIAL-TO-TASK ENGINE ── */
        <View>
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle-outline" size={18} color="#2D6A4F" />
            <Text style={styles.infoBannerText}>
              Select a timber species to see its permissible and prohibited construction applications.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Select Timber Species</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.speciesScroll}
            contentContainerStyle={{ gap: 8 }}
          >
            {Object.values(SPECIES_DICTIONARY).map((sp) => (
              <TouchableOpacity
                key={sp.id}
                style={[
                  styles.speciesChip,
                  activeSpeciesKey === sp.id && styles.speciesChipActive,
                ]}
                onPress={() => setActiveSpeciesKey(sp.id)}
              >
                <Text
                  style={[
                    styles.speciesChipText,
                    activeSpeciesKey === sp.id && styles.speciesChipTextActive,
                  ]}
                >
                  {sp.commonName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Selected species header */}
          <View style={styles.materialCard}>
            <View style={styles.materialCardHeader}>
              <View>
                <Text style={styles.matTitle}>{selectedSpecies.commonName}</Text>
                <Text style={styles.matBotanical}>{selectedSpecies.botanicalName}</Text>
              </View>
              <FprdiBadge groupCode={selectedSpecies.fprdiGroup} />
            </View>
            <Text style={styles.matGrain} numberOfLines={2}>
              {selectedSpecies.grainCharacteristics}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Permissible Applications</Text>
          <SafetyCard
            title="Interior Light Wall Framing & Drywall Studs"
            safetyRating="SAFE"
            rationale={`Sufficient bending strength under ${selectedSpecies.fprdiGroup} structural rating.`}
          />
          <SafetyCard
            title="Concrete Formwork & Temporary Scaffolding"
            safetyRating="PERMISSIBLE_WITH_CAUTION"
            rationale="Permissible for temporary shuttering; inspect localized defect zones prior to load."
          />

          <Text style={styles.sectionTitle}>Prohibited / High-Risk Applications</Text>
          <SafetyCard
            title="Heavy Foundation Beams & Bridge Posts"
            safetyRating={selectedSpecies.fprdiGroup === 'GROUP_I' ? 'SAFE' : 'PROHIBITED_UNSAFE'}
            rationale={
              selectedSpecies.fprdiGroup === 'GROUP_I'
                ? 'High compression load capacity suitable for foundation piles.'
                : 'UNSAFE: High compression loads require Group I structural timber.'
            }
          />
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
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
    gap: 4,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 10,
    gap: 6,
  },
  modeBtnActive: {
    backgroundColor: '#2D6A4F',
  },
  modeBtnText: {
    color: '#52796F',
    fontSize: 13,
    fontWeight: '600',
  },
  modeBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EEF9F4',
    padding: 12,
    borderRadius: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#B7E4CC',
  },
  infoBannerText: {
    flex: 1,
    color: '#2D6A4F',
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B4332',
    marginBottom: 12,
  },
  appGrid: {
    gap: 8,
    marginBottom: 20,
  },
  appCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8F2ED',
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  appCardActive: {
    borderColor: '#2D6A4F',
    backgroundColor: '#EEF9F4',
  },
  appCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  appCardDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#D1EEE3',
    backgroundColor: 'transparent',
  },
  appCardDotActive: {
    backgroundColor: '#2D6A4F',
    borderColor: '#2D6A4F',
  },
  appCardTitle: {
    color: '#1B4332',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  appCardTitleActive: {
    color: '#2D6A4F',
    fontWeight: '700',
  },
  appCardSub: {
    color: '#52796F',
    fontSize: 12,
    marginLeft: 20,
  },
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 10,
  },
  loadingText: {
    color: '#52796F',
    fontSize: 13,
  },
  recommendCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FEF6E4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  rankNum: {
    color: '#D97706',
    fontSize: 13,
    fontWeight: '800',
  },
  recommendContent: {
    flex: 1,
  },
  recommendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  speciesName: {
    color: '#1B4332',
    fontSize: 15,
    fontWeight: '700',
  },
  advantagesText: {
    color: '#52796F',
    fontSize: 12,
    lineHeight: 17,
  },
  speciesScroll: {
    marginBottom: 16,
  },
  speciesChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D1EEE3',
  },
  speciesChipActive: {
    backgroundColor: '#2D6A4F',
    borderColor: '#2D6A4F',
  },
  speciesChipText: {
    color: '#52796F',
    fontSize: 13,
    fontWeight: '600',
  },
  speciesChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  materialCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 18,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  materialCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  matTitle: {
    color: '#1B4332',
    fontSize: 20,
    fontWeight: '800',
  },
  matBotanical: {
    color: '#52796F',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 2,
  },
  matGrain: {
    color: '#52796F',
    fontSize: 13,
    lineHeight: 18,
  },
});
