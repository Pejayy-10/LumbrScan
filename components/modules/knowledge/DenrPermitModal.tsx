// LumbrScan DENR DAO 2026-20 Tree Cutting & Transport Permit Application Modal

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
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <MaterialCommunityIcons name="scale-balance" size={24} color="#DC2626" />
              <Text style={styles.modalTitle}>DENR Legal Compliance Guide</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollBody}>
            <View style={[styles.statusBox, { borderColor: badge.badgeColorHex }]}>
              <Text style={[styles.statusTitle, { color: badge.badgeColorHex }]}>
                {badge.title}
              </Text>
              <Text style={styles.speciesSub}>Target Species: {speciesName}</Text>
            </View>

            <Text style={styles.legalNoticeHeader}>Legal Notice under PD 705 & DAO 2026-20:</Text>
            <Text style={styles.legalNoticeText}>{badge.legalNotice}</Text>

            {/* 4-Step DENR Application Workflow */}
            <Text style={styles.sectionHeading}>Mandatory 4-Step DENR Permit Process</Text>

            <View style={styles.stepCard}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>STEP 1</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>Land Ownership & LGU Clearances</Text>
                <Text style={styles.stepDesc}>
                  Obtain Barangay Clearance, Municipal LGU Resolution, and Title Certificate proving private property boundaries.
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>STEP 2</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>CENRO Field Inspection & Inventory</Text>
                <Text style={styles.stepDesc}>
                  Submit formal application to DENR Community Environment and Natural Resources Office (CENRO) for physical tree tagging & DBH measuring.
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>STEP 3</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>Tree Cutting Permit Issuance</Text>
                <Text style={styles.stepDesc}>
                  Secure official DENR Tree Cutting Permit specifying approved volume (cu.m) and required tree replacement ratio (1:50 seedlings).
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>STEP 4</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>Certificate of Timber Origin (CTO)</Text>
                <Text style={styles.stepDesc}>
                  Obtain authenticated CTO and Transport Permit before hauling logs or sawn lumber past DENR highway checkpoints.
                </Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.dismissBtn} onPress={onClose}>
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
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  scrollBody: {
    paddingBottom: 20,
  },
  statusBox: {
    backgroundColor: '#0F172A',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  speciesSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  legalNoticeHeader: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  legalNoticeText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  sectionHeading: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
    gap: 12,
  },
  stepBadge: {
    backgroundColor: '#D9770622',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  stepBadgeText: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: '800',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  stepDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  dismissBtn: {
    backgroundColor: '#D97706',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  dismissBtnText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
  },
});
