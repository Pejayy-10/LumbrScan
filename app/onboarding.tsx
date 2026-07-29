// LumbrScan Multi-Slide First-Time User Onboarding Screen
// TripGlide Sample Aesthetic — Soft light canvas, dark pills, generous rounded corners

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../stores/useOnboardingStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    id: 'slide_1',
    title: 'AI Timber Identification',
    subtitle: 'Identify 11 Philippine timber species instantly using dual-backbone neural vision.',
    badge: 'SPECIES VISION PIPELINE',
    image: require('../assets/onboarding_hero.png'),
    icon: 'leaf-outline' as const,
  },
  {
    id: 'slide_2',
    title: 'Defect & FPRDI Grading',
    subtitle: 'Automated defect detection with minor remediation steps and severe structural fallbacks.',
    badge: 'FPRDI STRENGTH GROUPS I-IV',
    image: require('../assets/onboarding_scan.png'),
    icon: 'shield-checkmark-outline' as const,
  },
  {
    id: 'slide_3',
    title: 'Legal Compliance & Budgeting',
    subtitle: 'DENR DAO 2026-20 permit guides, Certificate of Timber Origin, and board-foot price estimator.',
    badge: 'PHILIPPINE FORESTRY & ESTIMATOR',
    image: require('../assets/onboarding_hero.png'),
    icon: 'calculator-outline' as const,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (activeIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}>
      {/* ── Top Bar / Skip ── */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <MaterialCommunityIcons name="leaf" size={22} color="#10B981" />
          <Text style={styles.brandTitle}>LumbrScan</Text>
        </View>
        {activeIndex < SLIDES.length - 1 && (
          <TouchableOpacity onPress={handleFinish} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Slides ScrollView ── */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={styles.slideWidth}>
            <View style={styles.cardContainer}>
              {/* Image Frame */}
              <View style={styles.imageCard}>
                <Image source={slide.image} style={styles.slideImage} resizeMode="cover" />
                <View style={styles.badgePill}>
                  <Text style={styles.badgeText}>{slide.badge}</Text>
                </View>
              </View>

              {/* Text Info */}
              <View style={styles.textWrap}>
                <View style={styles.iconCircle}>
                  <Ionicons name={slide.icon} size={22} color="#10B981" />
                </View>
                <Text style={styles.slideTitle}>{slide.title}</Text>
                <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ── Footer / Controls ── */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.paginationRow}>
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                activeIndex === idx ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* CTA Button */}
        <TouchableOpacity style={styles.ctaButton} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.ctaButtonText}>
            {activeIndex === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1D1F',
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  slideWidth: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 20,
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  imageCard: {
    width: '100%',
    height: 240,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  badgePill: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#1A1D1F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  textWrap: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1D1F',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  slideSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
  },
  footer: {
    paddingHorizontal: 24,
    gap: 20,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#1A1D1F',
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#D1D5DB',
  },
  ctaButton: {
    backgroundColor: '#1A1D1F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 28,
    gap: 10,
    shadowColor: '#1A1D1F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
