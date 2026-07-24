// LumbrScan Module 4: Two-Way Decision Support Recommendation Engine Screen

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRecommenderStore } from '../../stores/useRecommenderStore';
import { CONSTRUCTION_APPLICATIONS, SPECIES_DICTIONARY } from '../../constants/domain';
import { SafetyCard } from '../../components/ui/SafetyCard';
import { FprdiBadge } from '../../components/ui/FprdiBadge';

export default function RecommendScreen() {
  const {
    mode,
    setMode,
    selectedApplicationCode,
    setApplicationCode,
    selectedSpeciesId,
    setSpeciesId,
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. Path Switcher Header */}
      <View style={styles.modeSwitcher}>
        <TouchableOpacity
          style={[styles.modeTab, mode === 'TASK_TO_MATERIAL' && styles.modeTabActive]}
          onPress={() => setMode('TASK_TO_MATERIAL')}
        >
          <Text
            style={[
              styles.modeTabText,
              mode === 'TASK_TO_MATERIAL' && styles.modeTabTextActive,
            ]}
          >
            Path A: Task ➔ Material
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, mode === 'MATERIAL_TO_TASK' && styles.modeTabActive]}
          onPress={() => setMode('MATERIAL_TO_TASK')}
        >
          <Text
            style={[
              styles.modeTabText,
              mode === 'MATERIAL_TO_TASK' && styles.modeTabTextActive,
            ]}
          >
            Path B: Material ➔ Task
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. PATH A: TASK-TO-MATERIAL ENGINE */}
      {mode === 'TASK_TO_MATERIAL' ? (
        <View>
          <Text style={styles.sectionHeader}>Select Target Construction Application</Text>

          <View style={styles.appGrid}>
            {CONSTRUCTION_APPLICATIONS.map((app) => (
              <TouchableOpacity
                key={app.code}
                style={[
                  styles.appCard,
                  selectedApplicationCode === app.code && styles.appCardActive,
                ]}
                onPress={() => setApplicationCode(app.code)}
              >
                <Text
                  style={[
                    styles.appCardTitle,
                    selectedApplicationCode === app.code && styles.appCardTitleActive,
                  ]}
                >
                  {app.title}
                </Text>
                <Text style={styles.appCardSub}>Min. Required: {app.minimumFprdiGroup}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionHeader}>Recommended Timber Species</Text>

          {isSearching ? (
            <ActivityIndicator color="#D97706" style={{ marginVertical: 20 }} />
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
        /* 3. PATH B: MATERIAL-TO-TASK ENGINE */
        <View>
          <Text style={styles.sectionHeader}>Select Target Timber Species</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.speciesScroll}>
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

          <View style={styles.materialHeaderCard}>
            <Text style={styles.matTitle}>{selectedSpecies.commonName}</Text>
            <Text style={styles.matBotanical}>{selectedSpecies.botanicalName}</Text>
            <View style={{ marginTop: 8 }}>
              <FprdiBadge groupCode={selectedSpecies.fprdiGroup} />
            </View>
          </View>

          <Text style={styles.sectionHeader}>Permissible Applications</Text>
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

          <Text style={styles.sectionHeader}>Prohibited / High Risk Applications</Text>
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
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeTabActive: {
    backgroundColor: '#D97706',
  },
  modeTabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  modeTabTextActive: {
    color: '#0F172A',
  },
  sectionHeader: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 10,
  },
  appGrid: {
    gap: 8,
    marginBottom: 16,
  },
  appCard: {
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  appCardActive: {
    borderColor: '#D97706',
    backgroundColor: '#D9770615',
  },
  appCardTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  appCardTitleActive: {
    color: '#D97706',
  },
  appCardSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  recommendCard: {
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D9770622',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNum: {
    color: '#D97706',
    fontSize: 14,
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
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  advantagesText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 17,
  },
  speciesScroll: {
    marginBottom: 14,
  },
  speciesChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 8,
  },
  speciesChipActive: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  speciesChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  speciesChipTextActive: {
    color: '#0F172A',
  },
  materialHeaderCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 14,
  },
  matTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },
  matBotanical: {
    color: '#94A3B8',
    fontSize: 13,
    fontStyle: 'italic',
  },
});
