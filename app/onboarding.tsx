import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppButton } from '../components/ui/AppButton';
import { radius, space, typeScale } from '../constants/appTheme';
import { useAppTheme } from '../hooks/useAppTheme';
import { useOnboardingStore } from '../stores/useOnboardingStore';

export default function OnboardingScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  const continueToApp = () => { completeOnboarding(); router.replace('/(tabs)'); };

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.canvas }]}>
      <View style={styles.content}>
        <View style={[styles.brandMark, { backgroundColor: theme.colors.surfaceStrong }]}><Ionicons name="leaf-outline" size={36} color={theme.colors.accent} /></View>
        <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>LUMBRSCAN</Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>Identify timber with a clearer field workflow.</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>An offline prototype for Coconut, Gmelina, and Mango. Start with two clear views of the same board.</Text>
        <View style={styles.steps}>
          {[
            ['1', 'Capture two board views', 'Photograph the cut end and the long grain surface.'],
            ['2', 'Identify on-device', 'The prototype runs locally on Android.'],
            ['3', 'Review the reference', 'Browse the supported species and project price ranges.'],
          ].map(([number, title, detail]) => <View key={number} style={[styles.step, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}><View style={[styles.number, { backgroundColor: theme.colors.primarySoft }]}><Text style={[styles.numberText, { color: theme.colors.primary }]}>{number}</Text></View><View style={{ flex: 1 }}><Text style={[styles.stepTitle, { color: theme.colors.text }]}>{title}</Text><Text style={[styles.stepDetail, { color: theme.colors.textMuted }]}>{detail}</Text></View></View>)}
        </View>
        <View style={[styles.notice, { backgroundColor: theme.colors.accentSoft }]}><Ionicons name="information-circle-outline" size={18} color={theme.colors.warning} /><Text style={[styles.noticeText, { color: theme.colors.textMuted }]}>This is species identification only—not structural grading, defect detection, or safety certification.</Text></View>
      </View>
      <View style={styles.footer}><AppButton label="Continue to LumbrScan" icon="arrow-forward" onPress={continueToApp} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 40 }, content: { paddingTop: 42 },
  brandMark: { alignItems: 'center', borderRadius: 24, height: 72, justifyContent: 'center', width: 72 },
  eyebrow: { fontSize: typeScale.eyebrow, fontWeight: '900', letterSpacing: 1.4, marginTop: 28 },
  title: { fontSize: 34, fontWeight: '900', letterSpacing: -1.25, lineHeight: 40, marginTop: 10 },
  subtitle: { fontSize: 15, lineHeight: 22, marginTop: 13 },
  steps: { gap: 10, marginTop: 30 },
  step: { alignItems: 'center', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: 12, minHeight: 75, padding: 13 },
  number: { alignItems: 'center', borderRadius: 14, height: 36, justifyContent: 'center', width: 36 }, numberText: { fontSize: 13, fontWeight: '900' },
  stepTitle: { fontSize: 14, fontWeight: '900' }, stepDetail: { fontSize: 12, lineHeight: 17, marginTop: 3 },
  notice: { alignItems: 'flex-start', borderRadius: radius.md, flexDirection: 'row', gap: 9, marginTop: space.lg, padding: 13 }, noticeText: { flex: 1, fontSize: 12, lineHeight: 18 },
  footer: { paddingBottom: 6 },
});
