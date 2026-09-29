import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, type } from '../theme';

interface Props {
  steps: string[];
  currentIndex: number;
}

export function ProgressSteps({ steps, currentIndex }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {steps.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <React.Fragment key={step}>
            <View style={styles.stepCol}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: done || active ? colors.primary : colors.surface,
                    borderColor: done || active ? colors.primary : colors.border,
                  },
                ]}
              >
                {done ? (
                  <Ionicons name="checkmark" size={13} color={colors.white} />
                ) : (
                  <Text style={[type.tiny, { color: active ? colors.white : colors.muted }]}>{i + 1}</Text>
                )}
              </View>
              <Text
                style={[type.tiny, { color: active ? colors.ink : colors.muted, marginTop: 4, textAlign: 'center' }]}
                numberOfLines={1}
              >
                {step}
              </Text>
            </View>
            {i < steps.length - 1 && (
              <View style={[styles.line, { backgroundColor: done ? colors.primary : colors.border }]} />
            )}
          </React.Fragment>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: spacing.sm },
  stepCol: { alignItems: 'center', width: 72 },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  line: { width: 24, height: 2, marginTop: 12, marginHorizontal: -4 },
});
