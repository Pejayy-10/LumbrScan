import React, { ReactNode } from 'react';
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../hooks/useAppTheme';

type AppScreenProps = ScrollViewProps & { children: ReactNode };

export function AppScreen({ children, contentContainerStyle, ...props }: AppScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  return (
    <ScrollView
      {...props}
      style={[styles.screen, { backgroundColor: theme.colors.canvas }, props.style]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 18, paddingBottom: Math.max(insets.bottom, 18) + 100 },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20 },
});
