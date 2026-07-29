// LumbrScan Dedicated Budgeting & Timber Estimator Page
// TripGlide Light & Dark Pill Aesthetic

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEstimatorStore } from '../../stores/useEstimatorStore';
import { CONSTRUCTION_APPLICATIONS } from '../../constants/domain';
import { FprdiBadge } from '../../components/ui/FprdiBadge';

export default function EstimatorScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    selectedTaskCode,
    estimatedBoardFeet,
    maxBudgetPhp,
    isCalculating,
    estimationResult,
    setSelectedTaskCode,
    setEstimatedBoardFeet,
    setMaxBudgetPhp,
    calculateEstimate,
  } = useEstimatorStore();

  useEffect(() => {
    calculateEstimate();
  }, [selectedTaskCode]);

  const activeApp =
    CONSTRUCTION_APPLICATIONS.find((a) => a.code === selectedTaskCode) ||
    CONSTRUCTION_APPLICATIONS[0];

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
      <Text style={styles.pageTitle}>Timber Budget Estimator</Text>
      <Text style={styles.pageSubtitle}>
        Evaluate FPRDI strength groups and board-foot pricing against your budget envelope
      </Text>

      {/* ── Form Card ── */}
      <View style={styles.card}>
        {/* Task Selector */}
        <Text style={styles.inputLabel}>1. Select Target Construction Application</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.taskScroll}
          contentContainerStyle={{ gap: 8 }}
        >
          {CONSTRUCTION_APPLICATIONS.map((app) => (
            <TouchableOpacity
              key={app.code}
              style={[
                styles.taskChip,
                selectedTaskCode === app.code && styles.taskChipActive,
              ]}
              onPress={() => setSelectedTaskCode(app.code)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.taskChipText,
                  selectedTaskCode === app.code && styles.taskChipTextActive,
                ]}
              >
                {app.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.reqBox}>
          <Ionicons name="information-circle" size={16} color="#10B981" />
          <Text style={styles.reqText}>
            Minimum Strength Required:{' '}
            <Text style={{ fontWeight: '800', color: '#1A1D1F' }}>
              {activeApp.minimumFprdiGroup}
            </Text>
          </Text>
        </View>

        {/* Inputs Grid */}
        <View style={styles.inputsGrid}>
          {/* Board Feet Input */}
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>2. Quantity (bd. ft.)</Text>
            <View style={styles.inputBox}>
              <Ionicons name="cube-outline" size={18} color="#6B7280" />
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={String(estimatedBoardFeet)}
                onChangeText={(val) => {
                  const num = parseInt(val, 10);
                  setEstimatedBoardFeet(isNaN(num) ? 0 : num);
                }}
              />
              <Text style={styles.unitText}>bd.ft</Text>
            </View>
          </View>

          {/* Max Budget Input */}
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>3. Max Budget (PHP)</Text>
            <View style={styles.inputBox}>
              <Text style={styles.currencySymbol}>₱</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={String(maxBudgetPhp)}
                onChangeText={(val) => {
                  const num = parseInt(val, 10);
                  setMaxBudgetPhp(isNaN(num) ? 0 : num);
                }}
              />
            </View>
          </View>
        </View>

        {/* Calculate Button */}
        <TouchableOpacity
          style={styles.calcBtn}
          onPress={calculateEstimate}
          disabled={isCalculating}
          activeOpacity={0.85}
        >
          {isCalculating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="calculator-outline" size={18} color="#FFFFFF" />
              <Text style={styles.calcBtnText}>Calculate & Rank Suitable Timber</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Results Section ── */}
      <View style={styles.resultHeaderRow}>
        <Text style={styles.sectionTitle}>Ranked Timber Options</Text>
        {estimationResult && (
          <Text style={styles.resultCount}>
            {estimationResult.suitableSpeciesOptions.length} Species Evaluated
          </Text>
        )}
      </View>

      {isCalculating ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1A1D1F" />
          <Text style={styles.loadingText}>Ranking species against budget & FPRDI rating…</Text>
        </View>
      ) : (
        estimationResult?.suitableSpeciesOptions.map((opt, index) => (
          <View key={opt.speciesId} style={styles.optionCard}>
            <View style={styles.optionHeader}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
              <View style={styles.speciesNames}>
                <Text style={styles.commonName}>{opt.commonName}</Text>
                <Text style={styles.botanicalName}>{opt.botanicalName}</Text>
              </View>
              <FprdiBadge groupCode={opt.fprdiGroup} size="sm" />
            </View>

            <View style={styles.priceRow}>
              <View style={styles.priceMetric}>
                <Text style={styles.metricLabel}>Avg Price / bd.ft.</Text>
                <Text style={styles.metricVal}>₱{opt.pricePerBoardFootPhp}</Text>
              </View>

              <View style={styles.priceMetric}>
                <Text style={styles.metricLabel}>Total Estimated Cost</Text>
                <Text
                  style={[
                    styles.metricVal,
                    { color: opt.withinBudget ? '#10B981' : '#DC2626' },
                  ]}
                >
                  ₱{opt.totalEstimatedCostPhp.toLocaleString()}
                </Text>
              </View>

              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor: opt.withinBudget ? '#ECFDF5' : '#FEF2F2',
                  },
                ]}
              >
                <Ionicons
                  name={opt.withinBudget ? 'checkmark-circle' : 'close-circle'}
                  size={14}
                  color={opt.withinBudget ? '#10B981' : '#DC2626'}
                />
                <Text
                  style={[
                    styles.statusPillText,
                    { color: opt.withinBudget ? '#065F46' : '#991B1B' },
                  ]}
                >
                  {opt.withinBudget ? 'WITHIN BUDGET' : 'EXCEEDS'}
                </Text>
              </View>
            </View>

            <Text style={styles.reasonText}>{opt.recommendationReason}</Text>

            <TouchableOpacity
              style={styles.profileLink}
              onPress={() => router.push(`/species/${opt.speciesId}`)}
              activeOpacity={0.8}
            >
              <Text style={styles.profileLinkText}>View Full Profile & Products</Text>
              <Ionicons name="chevron-forward" size={14} color="#1A1D1F" />
            </TouchableOpacity>
          </View>
        ))
      )}
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
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1D1F',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  taskScroll: {
    marginBottom: 14,
  },
  taskChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  taskChipActive: {
    backgroundColor: '#1A1D1F',
    borderColor: '#1A1D1F',
  },
  taskChipText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
  taskChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  reqBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  reqText: {
    color: '#065F46',
    fontSize: 12,
    flex: 1,
  },
  inputsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputCol: {
    flex: 1,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  textInput: {
    flex: 1,
    color: '#1A1D1F',
    fontSize: 15,
    fontWeight: '700',
  },
  currencySymbol: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '800',
  },
  unitText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
  calcBtn: {
    backgroundColor: '#1A1D1F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 20,
    gap: 8,
  },
  calcBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  resultHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1D1F',
  },
  resultCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 10,
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 13,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    color: '#1A1D1F',
    fontSize: 13,
    fontWeight: '800',
  },
  speciesNames: {
    flex: 1,
  },
  commonName: {
    color: '#1A1D1F',
    fontSize: 16,
    fontWeight: '800',
  },
  botanicalName: {
    color: '#10B981',
    fontSize: 12,
    fontStyle: 'italic',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 14,
    marginBottom: 10,
  },
  priceMetric: {
    flex: 1,
  },
  metricLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metricVal: {
    color: '#1A1D1F',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  reasonText: {
    color: '#4B5563',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  profileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  profileLinkText: {
    color: '#1A1D1F',
    fontSize: 12,
    fontWeight: '700',
  },
});
