// LumbrScan Exportable Field Inspection & Decision Support Report Modal

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
        <View style={styles.modalContent}>
          {/* Header Bar */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <MaterialCommunityIcons name="file-certificate-outline" size={24} color="#D97706" />
              <Text style={styles.headerTitle}>Field Decision Support Report</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollBody}>
            {/* Document Letterhead */}
            <View style={styles.letterhead}>
              <Text style={styles.institutionTitle}>LUMBRSCAN MOBILE DECISION SUPPORT SYSTEM</Text>
              <Text style={styles.documentSub}>Official Timber Identification & Suitability Certificate</Text>
              <Text style={styles.reportTimestamp}>
                Date: {new Date().toLocaleDateString()} • Ref ID: LS-2026-{species.id.toUpperCase()}
              </Text>
            </View>

            {/* Section 1: AI Identification */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>1. Timber Species AI Classification</Text>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.speciesCommon}>{species.commonName}</Text>
                  <Text style={styles.speciesBotanical}>{species.botanicalName}</Text>
                </View>
                <View style={styles.scorePill}>
                  <Text style={styles.scoreText}>{percentage}% Confidence</Text>
                </View>
              </View>
              <Text style={styles.grainDesc}>{species.grainCharacteristics}</Text>
            </View>

            {/* Section 2: Structural Integrity & Downgrade */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>2. Condition Assessment & FPRDI Downgrade</Text>
              <View style={styles.rowGap}>
                <Text style={styles.label}>Nominal FPRDI Grade:</Text>
                <FprdiBadge groupCode={species.fprdiGroup} size="sm" />
              </View>

              {totalPenalty > 0 ? (
                <View style={styles.penaltyAlert}>
                  <Text style={styles.penaltyAlertTitle}>
                    ⚠️ Defect Downgrade Penalty: -{totalPenalty} Group(s)
                  </Text>
                  <Text style={styles.penaltyAlertText}>
                    Effective Structural Rating: <Text style={styles.highlightText}>{effectiveFprdiGroup}</Text>
                  </Text>
                </View>
              ) : (
                <View style={styles.soundAlert}>
                  <Text style={styles.soundAlertText}>
                    ✅ Sound Condition: Full {fprdi.title} rating retained.
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
              </View>
            </View>

            {/* Section 3: Legal & Regulatory Status */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>3. DENR DAO 2026-20 Legal Compliance</Text>
              <DenrBadgeUI statusCode={species.denrStatus} showNotice={true} />
            </View>

            {/* Section 4: Bidirectional Decision Recommendations */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>4. Bi-Directional Engineering Recommendation</Text>
              <View style={styles.recRow}>
                <Ionicons name="checkmark-circle" size={18} color="#059669" />
                <Text style={styles.recText}>
                  <Text style={{ fontWeight: '700' }}>Interior Studs & Panelling:</Text> Fully Permissible under {effectiveFprdiGroup} rating.
                </Text>
              </View>
              <View style={styles.recRow}>
                <Ionicons
                  name={totalPenalty > 0 ? 'close-circle' : 'checkmark-circle'}
                  size={18}
                  color={totalPenalty > 0 ? '#DC2626' : '#059669'}
                />
                <Text style={styles.recText}>
                  <Text style={{ fontWeight: '700' }}>Heavy Post & Roof Trusses:</Text>{' '}
                  {totalPenalty > 0
                    ? 'PROHIBITED - Active defects reduce structural bending resistance below safety limits.'
                    : 'SAFE - Defect-free Group II structural grade capacity.'}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShareReport}>
              <Ionicons name="share-social-outline" size={18} color="#0F172A" />
              <Text style={styles.shareBtnText}>Export / Share Report</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
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
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  scrollBody: {
    paddingBottom: 16,
  },
  letterhead: {
    backgroundColor: '#0F172A',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9770655',
    marginBottom: 14,
  },
  institutionTitle: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  documentSub: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  reportTimestamp: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: '#0F172A',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#D97706',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  speciesCommon: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  speciesBotanical: {
    color: '#94A3B8',
    fontSize: 13,
    fontStyle: 'italic',
  },
  scorePill: {
    backgroundColor: '#05966922',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#059669',
  },
  scoreText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '800',
  },
  grainDesc: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
  },
  rowGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  penaltyAlert: {
    backgroundColor: '#DC26261A',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DC2626',
    marginBottom: 10,
  },
  penaltyAlertTitle: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '800',
  },
  penaltyAlertText: {
    color: '#F8FAFC',
    fontSize: 12,
    marginTop: 2,
  },
  highlightText: {
    color: '#D97706',
    fontWeight: '800',
  },
  soundAlert: {
    backgroundColor: '#0596691A',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#059669',
    marginBottom: 10,
  },
  soundAlertText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },
  propsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  propBox: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 8,
    borderRadius: 6,
  },
  propKey: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
  },
  propVal: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  recRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  recText: {
    flex: 1,
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 17,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  shareBtn: {
    flex: 2,
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  shareBtnText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
  },
  doneBtn: {
    flex: 1,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  doneBtnText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
});
