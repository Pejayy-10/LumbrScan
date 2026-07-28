// LumbrScan History Inspection Log Detail Viewer
// Light Nature Theme

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useHistoryStore } from '../../stores/useHistoryStore';
import { FprdiBadge } from '../../components/ui/FprdiBadge';

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const getLogById = useHistoryStore((state) => state.getLogById);
  const deleteLog = useHistoryStore((state) => state.deleteLog);

  const log = getLogById(id || '');

  if (!log) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#DC2626" />
        <Text style={styles.errorTitle}>Log Record Not Found</Text>
        <Text style={styles.errorSub}>The requested inspection history log was deleted or moved.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Back to History</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Log Record',
      'Delete this saved inspection record permanently?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteLog(log.id);
            router.back();
          },
        },
      ]
    );
  };

  const dateStr = new Date(log.timestamp).toLocaleString();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header Card ── */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.speciesName}>{log.commonName}</Text>
            <Text style={styles.botanicalName}>{log.botanicalName}</Text>
          </View>
          <FprdiBadge groupCode={log.effectiveFprdiGroup} size="lg" />
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaBadge}>
            <Ionicons name="sparkles" size={14} color="#10B981" />
            <Text style={styles.metaBadgeText}>
              {Math.round(log.confidenceScore * 100)}% Confidence Match
            </Text>
          </View>

          <View style={styles.metaBadge}>
            <Ionicons name="time-outline" size={14} color="#52796F" />
            <Text style={styles.metaText}>{dateStr}</Text>
          </View>
        </View>

        <View style={styles.safetyBox}>
          <Ionicons
            name={log.safetyRating === 'SAFE' ? 'shield-checkmark' : 'alert-circle'}
            size={18}
            color={log.safetyRating === 'SAFE' ? '#10B981' : '#DC2626'}
          />
          <Text
            style={[
              styles.safetyText,
              { color: log.safetyRating === 'SAFE' ? '#065F46' : '#991B1B' },
            ]}
          >
            Safety Rating: {log.safetyRating}
          </Text>
        </View>
      </View>

      {/* ── Defect Findings ── */}
      <Text style={styles.sectionTitle}>Automated Defect Vision Findings</Text>
      <View style={styles.card}>
        <Text style={styles.defectSummaryText}>{log.detectedDefectsSummary}</Text>
        <Text style={styles.remedyCountText}>
          Actionable Remediation Count: {log.remediationCount} Step(s)
        </Text>
      </View>

      {/* ── Actions ── */}
      <TouchableOpacity
        style={styles.profileBtn}
        onPress={() => router.push(`/species/${log.speciesId}`)}
        activeOpacity={0.85}
      >
        <Ionicons name="book-outline" size={18} color="#FFFFFF" />
        <Text style={styles.profileBtnText}>View Full Species Profile & Products</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={handleDelete}
        activeOpacity={0.85}
      >
        <Ionicons name="trash-outline" size={18} color="#DC2626" />
        <Text style={styles.deleteBtnText}>Delete This Inspection Log</Text>
      </TouchableOpacity>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  speciesName: {
    color: '#1B4332',
    fontSize: 24,
    fontWeight: '800',
  },
  botanicalName: {
    color: '#52796F',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F4F8F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2EEE9',
  },
  metaBadgeText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '700',
  },
  metaText: {
    color: '#52796F',
    fontSize: 12,
  },
  safetyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF9F4',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B7E4CC',
  },
  safetyText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B4332',
    marginBottom: 10,
  },
  defectSummaryText: {
    color: '#1B4332',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  remedyCountText: {
    color: '#52796F',
    fontSize: 12,
  },
  profileBtn: {
    backgroundColor: '#1B4332',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    gap: 8,
    marginBottom: 10,
  },
  profileBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  deleteBtn: {
    backgroundColor: '#FEF2F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteBtnText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#F4F8F5',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B4332',
    marginTop: 12,
    marginBottom: 4,
  },
  errorSub: {
    color: '#52796F',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: '#2D6A4F',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
