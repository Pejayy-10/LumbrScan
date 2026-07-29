// LumbrScan Main Dashboard — Dribbble Glassmorphism & Forest Emerald Theme

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
          <Text style={styles.greeting}>LumbrScan Mobile</Text>
          <Text style={styles.appTitle}>Decision Support</Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="leaf" size={24} color="#74C69D" />
        </View>
      </View>
      <Text style={styles.appSubtitle}>
        Philippine Timber Identification, Structural Grading & Legal Compliance
      </Text>

      {/* ── Hero Glass Card ── */}
      <View style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>FPRDI GROUPS I–IV · DENR DAO 2026-20</Text>
        </View>
        <Text style={styles.heroTitle}>AI Timber Vision Scan</Text>
        <Text style={styles.heroSubtitle}>
          Instant identification of 11 Philippine timber species with automated defect vision assessment.
        </Text>
        <TouchableOpacity
          style={styles.heroCta}
          onPress={() => router.push('/scan')}
          activeOpacity={0.85}
        >
          <Ionicons name="camera" size={19} color="#0B1D15" />
          <Text style={styles.heroCtaText}>Open Camera & Scan Wood</Text>
        </TouchableOpacity>
      </View>

      {/* ── Quick Action Glass Cards ── */}
      <Text style={styles.sectionTitle}>Quick Access Tools</Text>
      <View style={styles.quickGrid}>
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => router.push('/estimator')}
          activeOpacity={0.85}
        >
          <View style={[styles.quickIcon, { backgroundColor: 'rgba(217, 119, 6, 0.15)' }]}>
            <Ionicons name="calculator-outline" size={22} color="#F59E0B" />
          </View>
          <Text style={styles.quickTitle}>Timber Estimator</Text>
          <Text style={styles.quickSub}>Budget & Board Feet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => router.push('/history')}
          activeOpacity={0.85}
        >
          <View style={[styles.quickIcon, { backgroundColor: 'rgba(116, 198, 157, 0.15)' }]}>
            <Ionicons name="time-outline" size={22} color="#74C69D" />
          </View>
          <Text style={styles.quickTitle}>Scan History</Text>
          <Text style={styles.quickSub}>Saved Inspections</Text>
        </TouchableOpacity>
      </View>

      {/* ── 4-Phase System Pipeline ── */}
      <View style={styles.glassCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderIcon}>
            <Ionicons name="git-network-outline" size={18} color="#74C69D" />
          </View>
          <Text style={styles.cardTitle}>4-Phase Decision Pipeline</Text>
        </View>

        {[
          {
            num: '01',
            title: 'Vision Capture & Preprocessing',
            desc: '224×224 RGB image input + automated surface/internal defect detection.',
          },
          {
            num: '02',
            title: 'Dual-Backbone AI Engine',
            desc: 'ResNet-50 + EfficientNet-B4 feature fusion species prediction.',
          },
          {
            num: '03',
            title: 'Knowledge Base Evaluation',
            desc: 'FPRDI strength rating (Groups I–IV) & DENR DAO 2026-20 permit badges.',
          },
          {
            num: '04',
            title: 'Two-Way Recommendation',
            desc: 'Task-to-Material & Material-to-Task engineering advice + budget estimation.',
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

      {/* ── Target Species Preview ── */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Target Timber Species</Text>
        <TouchableOpacity onPress={() => router.push('/knowledge')}>
          <Text style={styles.seeAll}>View Catalog →</Text>
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
            <Ionicons name="chevron-forward" size={16} color="#74C69D" />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1D15',
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
    fontSize: 14,
    color: '#74C69D',
    fontWeight: '600',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(116, 198, 157, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.25)',
  },
  appSubtitle: {
    fontSize: 13,
    color: '#95A99E',
    marginBottom: 20,
    lineHeight: 18,
  },
  heroCard: {
    backgroundColor: 'rgba(20, 46, 34, 0.85)',
    borderRadius: 22,
    padding: 22,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.3)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 8,
  },
  heroBadge: {
    backgroundColor: 'rgba(217, 119, 6, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.4)',
  },
  heroBadgeText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    color: '#95A99E',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 20,
  },
  heroCta: {
    backgroundColor: '#74C69D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#74C69D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  heroCtaText: {
    color: '#0B1D15',
    fontSize: 14,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: {
    color: '#74C69D',
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
    backgroundColor: 'rgba(20, 46, 34, 0.7)',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.2)',
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  quickSub: {
    fontSize: 11,
    color: '#95A99E',
  },
  glassCard: {
    backgroundColor: 'rgba(20, 46, 34, 0.7)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  cardHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(116, 198, 157, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pipelineRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  stepNumBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(116, 198, 157, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.3)',
  },
  stepNum: {
    color: '#74C69D',
    fontSize: 11,
    fontWeight: '800',
  },
  stepBody: {
    flex: 1,
    paddingTop: 3,
  },
  stepTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  stepDesc: {
    color: '#95A99E',
    fontSize: 12,
    lineHeight: 16,
  },
  speciesRow: {
    backgroundColor: 'rgba(20, 46, 34, 0.7)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(116, 198, 157, 0.18)',
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
    backgroundColor: '#74C69D',
  },
  speciesName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  speciesBotanical: {
    fontSize: 12,
    color: '#95A99E',
    fontStyle: 'italic',
  },
  speciesRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
