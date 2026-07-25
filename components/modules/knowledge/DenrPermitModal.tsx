// LumbrScan DENR DAO 2026-20 Tree Cutting & Transport Permit Application Modal
// Light Nature Theme

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { DenrStatusCode, DENR_BADGES } from '../../../constants/domain';

interface DenrPermitModalProps {
  visible: boolean;
  onClose: () => void;
  statusCode: DenrStatusCode;
  speciesName: string;
}

const STEPS = [
  {
    num: '01',
    title: 'Land Ownership & LGU Clearances',
    desc: 'Obtain Barangay Clearance, Municipal LGU Resolution, and Title Certificate proving private property boundaries.',
    icon: 'home-city-outline' as const,
  },
  {
    num: '02',
    title: 'CENRO Field Inspection & Inventory',
    desc: 'Submit formal application to DENR Community Environment and Natural Resources Office (CENRO) for physical tree tagging & DBH measuring.',
    icon: 'magnify-scan' as const,
  },
  {
    num: '03',
    title: 'Tree Cutting Permit Issuance',
    desc: 'Secure official DENR Tree Cutting Permit specifying approved volume (cu.m) and required tree replacement ratio (1:50 seedlings).',
    icon: 'file-sign' as const,
  },
  {
    num: '04',
    title: 'Certificate of Timber Origin (CTO)',
    desc: 'Obtain authenticated CTO and Transport Permit before hauling logs or sawn lumber past DENR highway checkpoints.',
    icon: 'certificate-outline' as const,
  },
];

export const DenrPermitModal: React.FC<DenrPermitModalProps> = ({
  visible,
  onClose,
  statusCode,
  speciesName,
}) => {
  const badge = DENR_BADGES[statusCode] || DENR_BADGES.REGULATED_PERMIT_REQUIRED;

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
                <Ionicons name="document-text" size={20} color="#2D6A4F" />
              </View>
              <Text style={styles.headerTitle}>DENR Legal Compliance Guide</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={20} color="#52796F" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollBody}
            showsVerticalScrollIndicator={false}
          >
            {/* ── Status Box ── */}
            <View style={[styles.statusBox, { borderColor: badge.badgeColorHex }]}>
              <View style={styles.statusRow}>
                <MaterialCommunityIcons name="scale-balance" size={18} color={badge.badgeColorHex} />
                <Text style={[styles.statusTitle, { color: badge.badgeColorHex }]}>
                  {badge.title}
                </Text>
              </View>
              <Text style={styles.speciesSub}>
                Species: <Text style={{ fontWeight: '700', color: '#1B4332' }}>{speciesName}</Text>
              </Text>
            </View>

            {/* ── Legal Notice ── */}
            <View style={styles.noticeCard}>
              <Text style={styles.noticeLabel}>⚖️ Legal Notice — PD 705 & DAO 2026-20</Text>
              <Text style={styles.noticeText}>{badge.legalNotice}</Text>
            </View>

            {/* ── 4-Step Process ── */}
            <Text style={styles.sectionHeading}>Mandatory 4-Step DENR Permit Process</Text>

            {STEPS.map((step, index) => (
              <View key={step.num} style={styles.stepCard}>
                <View style={styles.stepLeft}>
                  <View style={styles.stepNumBox}>
                    <Text style={styles.stepNum}>{step.num}</Text>
                  </View>
                  {index < STEPS.length - 1 && <View style={styles.stepLine} />}
                </View>
                <View style={styles.stepRight}>
                  <View style={styles.stepHeader}>
                    <MaterialCommunityIcons name={step.icon} size={16} color="#40916C" />
                    <Text style={styles.stepTitle}>{step.title}</Text>
                  </View>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* ── Dismiss Button ── */}
          <TouchableOpacity style={styles.dismissBtn} onPress={onClose} activeOpacity={0.85}>
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            <Text style={styles.dismissBtnText}>I Understand Legal Requirements</Text>
          </TouchableOpacity>
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
    maxHeight: '88%',
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
    marginBottom: 18,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF9F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#1B4332',
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
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
  statusBox: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 12,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  speciesSub: {
    color: '#52796F',
    fontSize: 13,
  },
  noticeCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D1EEE3',
    marginBottom: 18,
  },
  noticeLabel: {
    color: '#1B4332',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  noticeText: {
    color: '#52796F',
    fontSize: 13,
    lineHeight: 19,
  },
  sectionHeading: {
    color: '#1B4332',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 14,
  },
  stepCard: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 14,
  },
  stepLeft: {
    alignItems: 'center',
    width: 36,
  },
  stepNumBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#B7E4CC',
    marginVertical: 4,
    minHeight: 16,
  },
  stepRight: {
    flex: 1,
    paddingBottom: 18,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  stepTitle: {
    color: '#1B4332',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  stepDesc: {
    color: '#52796F',
    fontSize: 13,
    lineHeight: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2EEE9',
  },
  dismissBtn: {
    backgroundColor: '#1B4332',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 16,
    gap: 8,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  dismissBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
