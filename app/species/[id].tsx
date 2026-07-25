// LumbrScan Detailed Species Classification & Legal Regulatory View Screen
// Light Nature Theme

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SPECIES_DICTIONARY, FPRDI_RATINGS, DENR_BADGES } from '../../constants/domain';
import { FprdiBadge } from '../../components/ui/FprdiBadge';
import { DenrBadge } from '../../components/ui/DenrBadge';
import { ConfidenceGauge } from '../../components/ui/ConfidenceGauge';
import { DenrPermitModal } from '../../components/modules/knowledge/DenrPermitModal';
import { InspectionReportModal } from '../../components/modules/recommendation/InspectionReportModal';
import { useScanStore } from '../../stores/useScanStore';
import { useConditionStore } from '../../stores/useConditionStore';

export default function SpeciesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isPermitModalOpen, setIsPermitModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const activeResult = useScanStore((state) => state.activeResult);
  const getTotalPenalty = useConditionStore((state) => state.getTotalPenalty);
  const getEffectiveFprdiGroup = useConditionStore((state) => state.getEffectiveFprdiGroup);

  const species = (id && SPECIES_DICTIONARY[id as string]) || SPECIES_DICTIONARY.apitong;
  const fprdi = FPRDI_RATINGS[species.fprdiGroup];
  const denr = DENR_BADGES[species.denrStatus];

  const confidenceScore =
    activeResult?.prediction?.primaryMatch?.id === species.id
      ? activeResult.prediction.primaryMatch.confidenceScore
      : 0.942;

  const totalPenalty = getTotalPenalty();
  const effectiveFprdiGroup = getEffectiveFprdiGroup(species.fprdiGroup);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Species Hero Header ── */}
      <View style={styles.heroCard}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {species.category === 'NATIVE_REGULATED_HARDWOOD'
              ? 'NATIVE REGULATED HARDWOOD'
              : 'PLANTATION / PALM / FRUIT WOOD'}
          </Text>
        </View>
        <Text style={styles.heroCommonName}>{species.commonName}</Text>
        <Text style={styles.heroBotanical}>{species.botanicalName}</Text>
        <Text style={styles.heroLocal}>
          <Text style={{ color: 'rgba(255,255,255,0.6)' }}>Local Name: </Text>
          {species.localName}
        </Text>

        <View style={styles.heroFooter}>
          <FprdiBadge groupCode={species.fprdiGroup} size="lg" />
        </View>
      </View>

      {/* ── Confidence Gauge ── */}
      <ConfidenceGauge confidenceScore={confidenceScore} speciesName={species.commonName} />

      {/* ── Generate Report CTA ── */}
      <TouchableOpacity
        style={styles.exportBtn}
        onPress={() => setIsReportModalOpen(true)}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="file-certificate" size={20} color="#FFFFFF" />
        <Text style={styles.exportBtnText}>Generate Field Inspection & Decision Report</Text>
      </TouchableOpacity>

      {/* ── DENR Regulatory Status ── */}
      <Text style={styles.sectionTitle}>DENR Legal Regulatory Status</Text>
      <View style={styles.card}>
        <DenrBadge statusCode={species.denrStatus} showNotice={true} />
        <TouchableOpacity
          style={styles.permitBtn}
          onPress={() => setIsPermitModalOpen(true)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="file-document-outline" size={17} color="#2D6A4F" />
          <Text style={styles.permitBtnText}>View DENR Permit & CTO Application Workflow</Text>
        </TouchableOpacity>
      </View>

      {/* ── FPRDI Structural Rating ── */}
      <Text style={styles.sectionTitle}>FPRDI Structural Rating</Text>
      <View style={styles.card}>
        <Text style={styles.fprdiDesc}>{fprdi.description}</Text>

        <View style={styles.propsGrid}>
          <View style={styles.propItem}>
            <Text style={styles.propLabel}>Bending Stress</Text>
            <Text style={styles.propValue}>{fprdi.bendingStressMpa}</Text>
          </View>
          <View style={styles.propItem}>
            <Text style={styles.propLabel}>Elasticity (MOE)</Text>
            <Text style={styles.propValue}>{fprdi.elasticityGpa}</Text>
          </View>
          <View style={styles.propItem}>
            <Text style={styles.propLabel}>Load Capacity</Text>
            <Text style={styles.propValue}>{fprdi.loadCapacity}</Text>
          </View>
        </View>

        {totalPenalty > 0 && (
          <View style={styles.penaltyBanner}>
            <Ionicons name="alert-circle" size={16} color="#DC2626" />
            <Text style={styles.penaltyText}>
              Effective Group: {effectiveFprdiGroup} (−{totalPenalty} defect penalty applied)
            </Text>
          </View>
        )}
      </View>

      {/* ── Grain & Texture ── */}
      <Text style={styles.sectionTitle}>Grain & Visual Texture</Text>
      <View style={styles.card}>
        <Text style={styles.grainText}>{species.grainCharacteristics}</Text>
      </View>

      {/* ── Primary Construction Uses ── */}
      <Text style={styles.sectionTitle}>Primary Construction Uses</Text>
      <View style={styles.card}>
        {species.primaryUses.map((use, index) => (
          <View key={index} style={styles.useRow}>
            <View style={styles.useCheck}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.useText}>{use}</Text>
          </View>
        ))}
      </View>

      {/* ── Recommender CTA ── */}
      <TouchableOpacity
        style={styles.recommenderCta}
        onPress={() => router.push('/recommend')}
        activeOpacity={0.85}
      >
        <Ionicons name="swap-horizontal" size={18} color="#1B4332" />
        <Text style={styles.recommenderCtaText}>Test in Two-Way Recommender</Text>
      </TouchableOpacity>

      {/* ── Modals ── */}
      <DenrPermitModal
        visible={isPermitModalOpen}
        onClose={() => setIsPermitModalOpen(false)}
        statusCode={species.denrStatus}
        speciesName={species.commonName}
      />

      <InspectionReportModal
        visible={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        species={species}
        fprdi={fprdi}
        denr={denr}
        effectiveFprdiGroup={effectiveFprdiGroup}
        totalPenalty={totalPenalty}
        confidenceScore={confidenceScore}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8F5',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#1B4332',
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(116,198,157,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(116,198,157,0.35)',
  },
  categoryBadgeText: {
    color: '#74C69D',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroCommonName: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroBotanical: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    fontStyle: 'italic',
    marginTop: 4,
    marginBottom: 6,
  },
  heroLocal: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginBottom: 16,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B4332',
    marginTop: 6,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 6,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  exportBtn: {
    backgroundColor: '#2D6A4F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    marginBottom: 18,
    gap: 8,
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  exportBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  permitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    marginTop: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#B7E4CC',
    backgroundColor: '#EEF9F4',
    gap: 6,
  },
  permitBtnText: {
    color: '#2D6A4F',
    fontSize: 13,
    fontWeight: '600',
  },
  fprdiDesc: {
    color: '#52796F',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  propsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  propItem: {
    flex: 1,
    backgroundColor: '#F4F8F5',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2EEEA',
  },
  propLabel: {
    color: '#95A99E',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  propValue: {
    color: '#1B4332',
    fontSize: 12,
    fontWeight: '700',
  },
  penaltyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 10,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  penaltyText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  grainText: {
    color: '#52796F',
    fontSize: 13,
    lineHeight: 19,
  },
  useRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  useCheck: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#40916C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  useText: {
    color: '#1B4332',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  recommenderCta: {
    backgroundColor: '#74C69D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 14,
    gap: 8,
  },
  recommenderCtaText: {
    color: '#1B4332',
    fontSize: 15,
    fontWeight: '700',
  },
});
