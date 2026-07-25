// LumbrScan Main Dashboard — Light Nature Theme

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPECIES_DICTIONARY } from '../../constants/domain';
import { FprdiBadge } from '../../components/ui/FprdiBadge';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const speciesList = Object.values(SPECIES_DICTIONARY);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: 120 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Greeting Header ── */}
      <View style={styles.greetingRow}>
        <View>
          <Text style={styles.greeting}>Good day! 🌿</Text>
          <Text style={styles.appTitle}>LumbrScan</Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="leaf" size={22} color="#2D6A4F" />
        </View>
      </View>
      <Text style={styles.appSubtitle}>
        Philippine Timber Identification & Decision Support
      </Text>

      {/* ── Hero Card ── */}
      <View style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>FPRDI · DENR DAO 2026-20</Text>
        </View>
        <Text style={styles.heroTitle}>Start Your Timber Scan</Text>
        <Text style={styles.heroSubtitle}>
          AI-powered identification of 11 Philippine timber species with structural
          condition assessment.
        </Text>
        <TouchableOpacity
          style={styles.heroCta}
          onPress={() => router.push('/scan')}
          activeOpacity={0.85}
        >
          <Ionicons name="camera" size={18} color="#1B4332" />
          <Text style={styles.heroCtaText}>Open Camera & Scan</Text>
        </TouchableOpacity>
      </View>

      {/* ── Quick Actions ── */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickGrid}>
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => router.push('/knowledge')}
          activeOpacity={0.85}
        >
          <View style={[styles.quickIcon, { backgroundColor: '#EEF9F4' }]}>
            <Ionicons name="library" size={22} color="#2D6A4F" />
          </View>
          <Text style={styles.quickTitle}>Species Catalog</Text>
          <Text style={styles.quickSub}>11 Target Species</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => router.push('/recommend')}
          activeOpacity={0.85}
        >
          <View style={[styles.quickIcon, { backgroundColor: '#FEF6E4' }]}>
            <Ionicons name="bulb" size={22} color="#D97706" />
          </View>
          <Text style={styles.quickTitle}>Recommender</Text>
          <Text style={styles.quickSub}>Task & Material Engine</Text>
        </TouchableOpacity>
      </View>

      {/* ── 4-Phase Pipeline ── */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderIcon}>
            <Ionicons name="git-network-outline" size={18} color="#2D6A4F" />
          </View>
          <Text style={styles.cardTitle}>4-Phase Decision Pipeline</Text>
        </View>

        {[
          {
            num: '01',
            title: 'Input & Condition Assessment',
            desc: '224×224 RGB image capture + defect checklist (rot, cracks, warping).',
          },
          {
            num: '02',
            title: 'Dual-Backbone AI Engine',
            desc: 'ResNet-50 + EfficientNet-B4 feature fusion species prediction.',
          },
          {
            num: '03',
            title: 'Knowledge Base Evaluation',
            desc: 'FPRDI Groups I–IV rating & DENR DAO 2026-20 permit badges.',
          },
          {
            num: '04',
            title: 'Two-Way Recommendation',
            desc: 'Task-to-Material & Material-to-Task engineering advice cards.',
          },
        ].map((step) => (
          <View key={step.num} style={styles.pipelineRow}>
            <View style={styles.stepNumBox}>
              <Text style={styles.stepNum}>{step.num}</Text>
            </View>
            <View style={styles.stepBody}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ── Species Preview ── */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Target Species</Text>
        <TouchableOpacity onPress={() => router.push('/knowledge')}>
          <Text style={styles.seeAll}>View All →</Text>
        </TouchableOpacity>
      </View>

      {speciesList.slice(0, 4).map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.speciesRow}
          onPress={() => router.push(`/species/${item.id}`)}
          activeOpacity={0.85}
        >
          <View style={styles.speciesLeft}>
            <View style={styles.speciesDot} />
            <View>
              <Text style={styles.speciesName}>{item.commonName}</Text>
              <Text style={styles.speciesBotanical}>{item.botanicalName}</Text>
            </View>
          </View>
          <View style={styles.speciesRight}>
            <FprdiBadge groupCode={item.fprdiGroup} size="sm" />
            <Ionicons name="chevron-forward" size={16} color="#95A99E" />
          </View>
        </TouchableOpacity>
      ))}
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
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  greeting: {
    fontSize: 15,
    color: '#52796F',
    fontWeight: '500',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1B4332',
    letterSpacing: -0.5,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF9F4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1EEE3',
  },
  appSubtitle: {
    fontSize: 13,
    color: '#52796F',
    marginBottom: 20,
    lineHeight: 18,
  },
  heroCard: {
    backgroundColor: '#1B4332',
    borderRadius: 20,
    padding: 22,
    marginBottom: 24,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  heroBadge: {
    backgroundColor: 'rgba(116,198,157,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(116,198,157,0.35)',
  },
  heroBadgeText: {
    color: '#74C69D',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 18,
  },
  heroCta: {
    backgroundColor: '#74C69D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    gap: 8,
  },
  heroCtaText: {
    color: '#1B4332',
    fontSize: 14,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B4332',
    marginBottom: 12,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: {
    color: '#2D6A4F',
    fontSize: 13,
    fontWeight: '700',
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B4332',
    marginBottom: 2,
  },
  quickSub: {
    fontSize: 11,
    color: '#52796F',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    marginBottom: 24,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  cardHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EEF9F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B4332',
  },
  pipelineRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  stepNumBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EEF9F4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1EEE3',
  },
  stepNum: {
    color: '#2D6A4F',
    fontSize: 11,
    fontWeight: '800',
  },
  stepBody: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    color: '#1B4332',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  stepDesc: {
    color: '#52796F',
    fontSize: 12,
    lineHeight: 16,
  },
  speciesRow: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 8,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  speciesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  speciesDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#40916C',
  },
  speciesName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B4332',
  },
  speciesBotanical: {
    fontSize: 12,
    color: '#52796F',
    fontStyle: 'italic',
  },
  speciesRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
