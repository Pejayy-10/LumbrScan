// LumbrScan Dedicated Scan History Logs Screen
// TripGlide Light & Dark Pill Aesthetic

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHistoryStore } from '../../stores/useHistoryStore';
import { FprdiBadge } from '../../components/ui/FprdiBadge';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { logs, deleteLog, clearAllLogs } = useHistoryStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(
    (log) =>
      log.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.botanicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.detectedDefectsSummary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClearAll = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all saved scan logs? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearAllLogs },
      ]
    );
  };

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
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.pageTitle}>Scan History</Text>
          <Text style={styles.pageSubtitle}>{logs.length} saved inspection logs</Text>
        </View>
        {logs.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={handleClearAll}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color="#DC2626" />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Search Bar ── */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search history by species or defect..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Logs List ── */}
      {filteredLogs.map((log) => {
        const dateStr = new Date(log.timestamp).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        return (
          <TouchableOpacity
            key={log.id}
            style={styles.logCard}
            onPress={() => router.push(`/species/${log.speciesId}`)}
            activeOpacity={0.85}
          >
            <View style={styles.logHeader}>
              <View style={styles.logHeaderLeft}>
                <Text style={styles.speciesName}>{log.commonName}</Text>
                <Text style={styles.botanicalName}>{log.botanicalName}</Text>
              </View>
              <FprdiBadge groupCode={log.effectiveFprdiGroup} size="sm" />
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaBadge}>
                <Ionicons name="sparkles" size={12} color="#10B981" />
                <Text style={styles.metaBadgeText}>
                  {Math.round(log.confidenceScore * 100)}% Match
                </Text>
              </View>

              <View style={styles.metaBadge}>
                <Ionicons name="calendar-outline" size={12} color="#6B7280" />
                <Text style={styles.metaText}>{dateStr}</Text>
              </View>

              <View
                style={[
                  styles.safetyPill,
                  {
                    backgroundColor:
                      log.safetyRating === 'SAFE' ? '#ECFDF5' : '#FEF2F2',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.safetyPillText,
                    {
                      color:
                        log.safetyRating === 'SAFE' ? '#065F46' : '#991B1B',
                    },
                  ]}
                >
                  {log.safetyRating}
                </Text>
              </View>
            </View>

            <Text style={styles.defectText} numberOfLines={2}>
              🔍 {log.detectedDefectsSummary}
            </Text>

            <View style={styles.cardFooter}>
              <Text style={styles.remedyText}>
                {log.remediationCount} Actionable Remediation Step(s)
              </Text>
              <TouchableOpacity
                onPress={() => deleteLog(log.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash-outline" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        );
      })}

      {filteredLogs.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No history logs found</Text>
          <Text style={styles.emptySub}>
            Past timber classification and condition scans will appear here.
          </Text>
        </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  },
  clearBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 10,
    marginBottom: 16,
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: '#1A1D1F',
    fontSize: 14,
  },
  logCard: {
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
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  logHeaderLeft: {
    flex: 1,
    marginRight: 10,
  },
  speciesName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1D1F',
  },
  botanicalName: {
    fontSize: 12,
    color: '#10B981',
    fontStyle: 'italic',
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaBadgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  metaText: {
    color: '#6B7280',
    fontSize: 11,
  },
  safetyPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  safetyPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  defectText: {
    color: '#4B5563',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  remedyText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1D1F',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
});
