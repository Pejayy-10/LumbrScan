// LumbrScan Exportable Field Inspection & Decision Support Report Modal
// Light Nature Theme

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { TimberSpecies, FprdiRating, DenrBadge } from '../../../types';
import { FprdiBadge } from '../../ui/FprdiBadge';
import { DenrBadge as DenrBadgeUI } from '../../ui/DenrBadge';

interface InspectionReportModalProps {
  visible: boolean;
  onClose: () => void;
  species: TimberSpecies;
  fprdi: FprdiRating;
  denr: DenrBadge;
  effectiveFprdiGroup: string;
  totalPenalty: number;
  confidenceScore: number;
}

export const InspectionReportModal: React.FC<InspectionReportModalProps> = ({
  visible,
  onClose,
  species,
  fprdi,
  denr,
  effectiveFprdiGroup,
  totalPenalty,
  confidenceScore,
}) => {
  const percentage = Math.round(confidenceScore * 100);

  const handleShareReport = async () => {
    try {
      const message = `
=================================================
LUMBRSCAN FIELD TIMBER INSPECTION REPORT
=================================================
Species Identified: ${species.commonName} (${species.botanicalName})
Local Name: ${species.localName}
AI Confidence Score: ${percentage}%

STRUCTURAL GRADING & COMPLIANCE:
- Nominal FPRDI Group: ${fprdi.title}
- Condition Defect Penalty: -${totalPenalty} Level(s)
- Effective Structural Group: ${effectiveFprdiGroup}
- Bending Stress (MPa): ${fprdi.bendingStressMpa}
- Elasticity (MOE GPa): ${fprdi.elasticityGpa}

DENR REGULATORY STATUS:
- Status: ${denr.title}
- Permit Notice: ${denr.legalNotice}

RECOMMENDED APPLICATIONS:
- Interior Light Wall Framing: SAFE
- Temporary Concrete Formwork: PERMISSIBLE WITH CAUTION
- Heavy Bridge Beams / Trusses: ${totalPenalty > 0 ? 'PROHIBITED (Defect Penalty)' : 'SAFE (Defect-Free)'}

Generated via LumbrScan Mobile Decision Support System
=================================================
      `.trim();

      await Share.share({
        message,
        title: `LumbrScan Inspection Report - ${species.commonName}`,
      });
    } catch (error) {
      Alert.alert('Share Failed', 'Unable to open system share dialog.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          {/* ── Drag Handle ── */}
          <View style={styles.handle} />

          {/* ── Header ── */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconWrap}>
                <MaterialCommunityIcons name="file-certificate-outline" size={20} color="#2D6A4F" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Field Decision Report</Text>
                <Text style={styles.headerSub}>Timber Inspection Certificate</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={20} color="#52796F" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollBody}
            showsVerticalScrollIndicator={false}
          >
            {/* ── Letterhead ── */}
            <View style={styles.letterhead}>
              <View style={styles.letterheadBadge}>
                <Text style={styles.letterheadBadgeText}>OFFICIAL DOCUMENT</Text>
              </View>
              <Text style={styles.letterheadTitle}>LumbrScan Mobile Decision Support System</Text>
              <Text style={styles.letterheadSub}>Timber Identification & Suitability Certificate</Text>
              <View style={styles.letterheadMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={13} color="#52796F" />
                  <Text style={styles.metaText}>{new Date().toLocaleDateString()}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="barcode-outline" size={13} color="#52796F" />
                  <Text style={styles.metaText}>LS-2026-{species.id.toUpperCase()}</Text>
                </View>
              </View>
            </View>

            {/* ── Section 1: AI Identification ── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeadRow}>
                <View style={styles.sectionNumBadge}>
                  <Text style={styles.sectionNum}>1</Text>
                </View>
                <Text style={styles.sectionTitle}>Timber Species AI Classification</Text>
              </View>

              <View style={styles.rowBetween}>
                <View style={styles.speciesInfo}>
                  <Text style={styles.speciesCommon}>{species.commonName}</Text>
                  <Text style={styles.speciesBotanical}>{species.botanicalName}</Text>
                  <Text style={styles.speciesLocal}>Local: {species.localName}</Text>
                </View>
                <View style={styles.scorePill}>
                  <Ionicons name="sparkles" size={12} color="#10B981" />
                  <Text style={styles.scoreText}>{percentage}%</Text>
                  <Text style={styles.scoreLabel}>Confidence</Text>
                </View>
              </View>

              <Text style={styles.grainDesc}>{species.grainCharacteristics}</Text>
            </View>

            {/* ── Section 2: Structural Integrity & Downgrade ── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeadRow}>
                <View style={styles.sectionNumBadge}>
                  <Text style={styles.sectionNum}>2</Text>
                </View>
                <Text style={styles.sectionTitle}>Condition Assessment & FPRDI Grade</Text>
              </View>

              <View style={styles.rowGap}>
                <Text style={styles.fieldLabel}>Nominal FPRDI Group</Text>
                <FprdiBadge groupCode={species.fprdiGroup} size="sm" />
              </View>

              {totalPenalty > 0 ? (
                <View style={styles.penaltyAlert}>
                  <Ionicons name="alert-circle" size={16} color="#DC2626" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.penaltyAlertTitle}>
                      Defect Downgrade: −{totalPenalty} Group(s)
                    </Text>
                    <Text style={styles.penaltyAlertSub}>
                      Effective Structural Rating:{' '}
                      <Text style={styles.highlightText}>{effectiveFprdiGroup}</Text>
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.soundAlert}>
                  <Ionicons name="shield-checkmark" size={16} color="#10B981" />
                  <Text style={styles.soundAlertText}>
                    Sound Condition — Full {fprdi.title} rating retained.
                  </Text>
                </View>
              )}

              <View style={styles.propsRow}>
                <View style={styles.propBox}>
                  <Text style={styles.propKey}>Bending Stress</Text>
                  <Text style={styles.propVal}>{fprdi.bendingStressMpa}</Text>
                </View>
                <View style={styles.propBox}>
                  <Text style={styles.propKey}>Elasticity (MOE)</Text>
                  <Text style={styles.propVal}>{fprdi.elasticityGpa}</Text>
                </View>
                <View style={styles.propBox}>
                  <Text style={styles.propKey}>Load Capacity</Text>
                  <Text style={styles.propVal}>{fprdi.loadCapacity}</Text>
                </View>
              </View>
            </View>

            {/* ── Section 3: DENR Legal Compliance ── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeadRow}>
                <View style={styles.sectionNumBadge}>
                  <Text style={styles.sectionNum}>3</Text>
                </View>
                <Text style={styles.sectionTitle}>DENR DAO 2026-20 Legal Compliance</Text>
              </View>
              <DenrBadgeUI statusCode={species.denrStatus} showNotice={true} />
            </View>

            {/* ── Section 4: Engineering Recommendations ── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeadRow}>
                <View style={styles.sectionNumBadge}>
                  <Text style={styles.sectionNum}>4</Text>
                </View>
                <Text style={styles.sectionTitle}>Bi-Directional Engineering Recommendation</Text>
              </View>

              <View style={styles.recRow}>
                <View style={[styles.recIcon, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="checkmark" size={14} color="#10B981" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recTitle}>Interior Studs & Panelling</Text>
                  <Text style={styles.recDesc}>
                    Fully permissible under {effectiveFprdiGroup} structural rating.
                  </Text>
                </View>
              </View>

              <View style={styles.recRow}>
                <View
                  style={[
                    styles.recIcon,
                    { backgroundColor: totalPenalty > 0 ? '#FEF2F2' : '#ECFDF5' },
                  ]}
                >
                  <Ionicons
                    name={totalPenalty > 0 ? 'close' : 'checkmark'}
                    size={14}
                    color={totalPenalty > 0 ? '#DC2626' : '#10B981'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recTitle}>Heavy Post & Roof Trusses</Text>
                  <Text style={styles.recDesc}>
                    {totalPenalty > 0
                      ? 'PROHIBITED — Active defects reduce structural bending resistance below safety limits.'
                      : 'SAFE — Defect-free structural grade capacity confirmed.'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* ── Action Row ── */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.shareBtn}
              onPress={handleShareReport}
              activeOpacity={0.85}
            >
              <Ionicons name="share-social-outline" size={18} color="#FFFFFF" />
              <Text style={styles.shareBtnText}>Export & Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.doneBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 67, 50, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#F4F8F5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#B7E4CC',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF9F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#1B4332',
    fontSize: 16,
    fontWeight: '800',
  },
  headerSub: {
    color: '#52796F',
    fontSize: 12,
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2EEE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingBottom: 12,
  },
  // Letterhead
  letterhead: {
    backgroundColor: '#1B4332',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  letterheadBadge: {
    backgroundColor: 'rgba(116,198,157,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(116,198,157,0.4)',
  },
  letterheadBadgeText: {
    color: '#74C69D',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  letterheadTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  letterheadSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 12,
  },
  letterheadMeta: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
  },
  // Section cards
  sectionCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionNumBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#EEF9F4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B7E4CC',
  },
  sectionNum: {
    color: '#2D6A4F',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionTitle: {
    color: '#1B4332',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  speciesInfo: {
    flex: 1,
    marginRight: 10,
  },
  speciesCommon: {
    color: '#1B4332',
    fontSize: 18,
    fontWeight: '800',
  },
  speciesBotanical: {
    color: '#52796F',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 2,
  },
  speciesLocal: {
    color: '#95A99E',
    fontSize: 12,
    marginTop: 3,
  },
  scorePill: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6EE7B7',
    minWidth: 70,
  },
  scoreText: {
    color: '#065F46',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  scoreLabel: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '600',
  },
  grainDesc: {
    color: '#52796F',
    fontSize: 12,
    lineHeight: 17,
    backgroundColor: '#F4F8F5',
    borderRadius: 8,
    padding: 10,
  },
  rowGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  fieldLabel: {
    color: '#52796F',
    fontSize: 12,
    fontWeight: '600',
  },
  penaltyAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 10,
  },
  penaltyAlertTitle: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  penaltyAlertSub: {
    color: '#7F1D1D',
    fontSize: 12,
  },
  highlightText: {
    color: '#DC2626',
    fontWeight: '800',
  },
  soundAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6EE7B7',
    marginBottom: 10,
  },
  soundAlertText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  propsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  propBox: {
    flex: 1,
    backgroundColor: '#F4F8F5',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2EEE9',
  },
  propKey: {
    color: '#95A99E',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  propVal: {
    color: '#1B4332',
    fontSize: 12,
    fontWeight: '700',
  },
  recRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  recIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  recTitle: {
    color: '#1B4332',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  recDesc: {
    color: '#52796F',
    fontSize: 12,
    lineHeight: 17,
  },
  // Actions
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  shareBtn: {
    flex: 2,
    backgroundColor: '#1B4332',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  doneBtn: {
    flex: 1,
    backgroundColor: '#E2EEE9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  doneBtnText: {
    color: '#2D6A4F',
    fontSize: 14,
    fontWeight: '700',
  },
});
