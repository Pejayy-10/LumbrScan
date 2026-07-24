// LumbrScan Detailed Species Classification & Legal Regulatory View Screen

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SPECIES_DICTIONARY, FPRDI_RATINGS, DENR_BADGES } from '../../constants/domain';
import { FprdiBadge } from '../../components/ui/FprdiBadge';
import { DenrBadge } from '../../components/ui/DenrBadge';

export default function SpeciesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const species = (id && SPECIES_DICTIONARY[id as string]) || SPECIES_DICTIONARY.apitong;
  const fprdi = FPRDI_RATINGS[species.fprdiGroup];
  const denr = DENR_BADGES[species.denrStatus];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. Species Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {species.category === 'NATIVE_REGULATED_HARDWOOD'
              ? 'NATIVE REGULATED HARDWOOD'
              : 'PLANTATION / PALM / FRUIT WOOD'}
          </Text>
        </View>

        <Text style={styles.commonName}>{species.commonName}</Text>
        <Text style={styles.botanicalName}>{species.botanicalName}</Text>
        <Text style={styles.localName}>Local Name: {species.localName}</Text>
      </View>

      {/* 2. DENR DAO 2026-20 Legal Regulatory Shield */}
      <Text style={styles.sectionHeader}>DENR Legal Regulatory Status</Text>
      <DenrBadge statusCode={species.denrStatus} showNotice={true} />

      {/* 3. FPRDI Structural Engineering Properties */}
      <Text style={styles.sectionHeader}>FPRDI Structural Rating</Text>
      <View style={styles.fprdiCard}>
        <FprdiBadge groupCode={species.fprdiGroup} size="lg" />

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
      </View>

      {/* 4. Grain & Texture Characteristics */}
      <Text style={styles.sectionHeader}>Grain & Visual Texture</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>{species.grainCharacteristics}</Text>
      </View>

      {/* 5. Permissible Construction Applications */}
      <Text style={styles.sectionHeader}>Primary Construction Uses</Text>
      <View style={styles.usesCard}>
        {species.primaryUses.map((use, index) => (
          <View key={index} style={styles.useRow}>
            <Ionicons name="checkmark-circle" size={18} color="#059669" />
            <Text style={styles.useText}>{use}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.recommenderCta}
        onPress={() => router.push('/recommend')}
        activeOpacity={0.85}
      >
        <Ionicons name="swap-horizontal" size={20} color="#0F172A" />
        <Text style={styles.recommenderCtaText}>Test in Two-Way Recommender</Text>
      </TouchableOpacity>
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
    paddingBottom: 36,
  },
  headerCard: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#D9770622',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryBadgeText: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  commonName: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
  },
  botanicalName: {
    color: '#94A3B8',
    fontSize: 15,
    fontStyle: 'italic',
    marginTop: 2,
  },
  localName: {
    color: '#CBD5E1',
    fontSize: 13,
    marginTop: 6,
  },
  sectionHeader: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 8,
  },
  fprdiCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  fprdiDesc: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 10,
    marginBottom: 14,
  },
  propsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  propItem: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  propLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  propValue: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 19,
  },
  usesCard: {
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  useRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  useText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  recommenderCta: {
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  recommenderCtaText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
  },
});
