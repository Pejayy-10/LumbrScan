// LumbrScan Main Dashboard (Home Screen)

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { SPECIES_DICTIONARY } from '../../constants/domain';
import { FprdiBadge } from '../../components/ui/FprdiBadge';

export default function HomeScreen() {
  const router = useRouter();

  const speciesList = Object.values(SPECIES_DICTIONARY);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. Academic Thesis Header Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeText}>PHILIPPINE TIMBER DECISION SUPPORT</Text>
        </View>
        <Text style={styles.bannerTitle}>LumbrScan Mobile</Text>
        <Text style={styles.bannerSubtitle}>
          AI Species Identification • Physical Condition Assessment • FPRDI & DENR Compliance
        </Text>

        <TouchableOpacity
          style={styles.primaryCta}
          onPress={() => router.push('/scan')}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="camera-iris" size={22} color="#0F172A" />
          <Text style={styles.primaryCtaText}>Start Timber Scan</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Quick Action Grid */}
      <Text style={styles.sectionHeader}>Quick Actions</Text>
      <View style={styles.quickGrid}>
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => router.push('/scan')}
        >
          <View style={[styles.quickIconBg, { backgroundColor: '#D9770622' }]}>
            <MaterialCommunityIcons name="scan-helper" size={24} color="#D97706" />
          </View>
          <Text style={styles.quickCardTitle}>Scan Wood Grain</Text>
          <Text style={styles.quickCardSub}>Image & Defect Entry</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => router.push('/recommend')}
        >
          <View style={[styles.quickIconBg, { backgroundColor: '#05966922' }]}>
            <MaterialCommunityIcons name="swap-horizontal-bold" size={24} color="#059669" />
          </View>
          <Text style={styles.quickCardTitle}>Recommender</Text>
          <Text style={styles.quickCardSub}>Task & Material Engine</Text>
        </TouchableOpacity>
      </View>

      {/* 3. 4-Phase System Pipeline Overview Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Ionicons name="git-network-outline" size={20} color="#D97706" />
          <Text style={styles.cardTitle}>4-Phase Decision Pipeline</Text>
        </View>

        <View style={styles.pipelineStep}>
          <Text style={styles.stepNum}>01</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Input & Condition Assessment</Text>
            <Text style={styles.stepDesc}>224x224 RGB image capture + defect checklist (rot, cracks, warping).</Text>
          </View>
        </View>

        <View style={styles.pipelineStep}>
          <Text style={styles.stepNum}>02</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Dual-Backbone AI Engine</Text>
            <Text style={styles.stepDesc}>ResNet-50 + EfficientNet-B4 feature fusion species prediction.</Text>
          </View>
        </View>

        <View style={styles.pipelineStep}>
          <Text style={styles.stepNum}>03</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Knowledge Base Evaluation</Text>
            <Text style={styles.stepDesc}>FPRDI Groups I-IV rating & DENR DAO 2026-20 permit badges.</Text>
          </View>
        </View>

        <View style={styles.pipelineStep}>
          <Text style={styles.stepNum}>04</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Two-Way Recommendation</Text>
            <Text style={styles.stepDesc}>Task-to-Material & Material-to-Task engineering advice cards.</Text>
          </View>
        </View>
      </View>

      {/* 4. Target Species Catalog Preview */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeader}>11 Target Philippine Species</Text>
        <TouchableOpacity onPress={() => router.push('/knowledge')}>
          <Text style={styles.seeAllText}>View Catalog →</Text>
        </TouchableOpacity>
      </View>

      {speciesList.slice(0, 4).map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.speciesCard}
          onPress={() => router.push(`/species/${item.id}`)}
        >
          <View style={styles.speciesCardLeft}>
            <Text style={styles.speciesName}>{item.commonName}</Text>
            <Text style={styles.botanicalName}>{item.botanicalName}</Text>
          </View>
          <FprdiBadge groupCode={item.fprdiGroup} size="sm" />
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
  banner: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  bannerBadge: {
    backgroundColor: '#D9770622',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  bannerBadgeText: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  primaryCta: {
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryCtaText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
  },
  sectionHeader: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  seeAllText: {
    color: '#D97706',
    fontSize: 13,
    fontWeight: '700',
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  quickIconBg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickCardTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  quickCardSub: {
    color: '#94A3B8',
    fontSize: 11,
  },
  card: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  pipelineStep: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  stepNum: {
    color: '#D97706',
    fontSize: 13,
    fontWeight: '800',
    width: 24,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  stepDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
  },
  speciesCard: {
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
  },
  speciesCardLeft: {
    flex: 1,
  },
  speciesName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  botanicalName: {
    color: '#94A3B8',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
