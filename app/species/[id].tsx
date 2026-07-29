// LumbrScan Detailed Species Profile & Regulatory View Screen
// TripGlide Light & Dark Pill Aesthetic

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
      {/* ── Species Hero Card ── */}
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
          <Text style={{ color: '#6B7280' }}>Local Name: </Text>
          {species.localName}
        </Text>

        <View style={styles.heroFooter}>
          <FprdiBadge groupCode={species.fprdiGroup} size="lg" />
          <View style={styles.pricePill}>
            <Text style={styles.pricePillText}>
              ₱{species.pricePerBoardFootPhp.min}–₱{species.pricePerBoardFootPhp.max} / bd.ft
            </Text>
          </View>
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

      {/* ── DENR Legal Regulatory Status ── */}
      <Text style={styles.sectionTitle}>DENR Legal Regulatory Status</Text>
      <View style={styles.card}>
        <DenrBadge statusCode={species.denrStatus} showNotice={true} />
        <TouchableOpacity
          style={styles.permitBtn}
          onPress={() => setIsPermitModalOpen(true)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="file-document-outline" size={17} color="#1A1D1F" />
          <Text style={styles.permitBtnText}>View DENR Permit & CTO Application Workflow</Text>
        </TouchableOpacity>
      </View>

      {/* ── FPRDI Mechanical & Physical Properties ── */}
      <Text style={styles.sectionTitle}>FPRDI Mechanical & Physical Properties</Text>
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
            <Text style={styles.propLabel}>Density (g/cm³)</Text>
            <Text style={styles.propValue}>{species.basicRelativeDensity}</Text>
          </View>
        </View>

        <View style={[styles.propsGrid, { marginTop: 8 }]}>
          <View style={styles.propItem}>
            <Text style={styles.propLabel}>Compression ||</Text>
            <Text style={styles.propValue}>
              {species.mechanicalProperties.compressionParallelMpa}
            </Text>
          </View>
          <View style={styles.propItem}>
            <Text style={styles.propLabel}>Janka Hardness</Text>
            <Text style={styles.propValue}>
              {species.mechanicalProperties.hardnessKn}
            </Text>
          </View>
          <View style={styles.propItem}>
            <Text style={styles.propLabel}>Price Tier</Text>
            <Text style={[styles.propValue, { color: '#D97706' }]}>
              {species.pricePerBoardFootPhp.priceTier}
            </Text>
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

      {/* ── Crafted Materials & Products Breakdown ── */}
      <Text style={styles.sectionTitle}>Permissible Crafted Materials & Products</Text>
      <View style={styles.card}>
        <Text style={styles.cardSubText}>
          Manufacturable products and high-value wooden items suited for this species:
        </Text>
        <View style={styles.productsGrid}>
          {species.permissibleCraftedProducts.map((prod, index) => (
            <View key={index} style={styles.productChip}>
              <Ionicons name="hammer-outline" size={14} color="#10B981" />
              <Text style={styles.productChipText}>{prod}</Text>
            </View>
          ))}
        </View>
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

      {/* ── Estimator CTA ── */}
      <TouchableOpacity
        style={styles.recommenderCta}
        onPress={() => router.push('/estimator')}
        activeOpacity={0.85}
      >
        <Ionicons name="calculator" size={18} color="#FFFFFF" />
        <Text style={styles.recommenderCtaText}>Calculate Budget in Estimator</Text>
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
    backgroundColor: '#F4F6F8',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  categoryBadge: {
    backgroundColor: '#1A1D1F',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroCommonName: {
    color: '#1A1D1F',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroBotanical: {
    color: '#10B981',
    fontSize: 15,
    fontStyle: 'italic',
    marginTop: 4,
    marginBottom: 6,
  },
  heroLocal: {
    color: '#1A1D1F',
    fontSize: 13,
    marginBottom: 16,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pricePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  pricePillText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1D1F',
    marginTop: 8,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardSubText: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 12,
  },
  productsGrid: {
    gap: 8,
  },
  productChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },
  productChipText: {
    color: '#1A1D1F',
    fontSize: 13,
    fontWeight: '600',
  },
  exportBtn: {
    backgroundColor: '#1A1D1F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 20,
    marginBottom: 18,
    gap: 8,
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  exportBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  permitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    gap: 6,
  },
  permitBtnText: {
    color: '#1A1D1F',
    fontSize: 13,
    fontWeight: '700',
  },
  fprdiDesc: {
    color: '#4B5563',
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
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  propLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  propValue: {
    color: '#1A1D1F',
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
    borderRadius: 12,
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
    color: '#4B5563',
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
    backgroundColor: '#1A1D1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  useText: {
    color: '#1A1D1F',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  recommenderCta: {
    backgroundColor: '#1A1D1F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 14,
    gap: 8,
  },
  recommenderCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
