import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, type } from '../theme';

interface Props {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
  editable?: boolean;
  onChange?: (value: number) => void;
}

export function RatingStars({ rating, size = 14, showValue, reviewCount, editable, onChange }: Props) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.row}>
      <View style={styles.row}>
        {stars.map((s) => {
          const filled = editable ? s <= rating : s <= Math.round(rating);
          const StarWrap = editable ? Pressable : View;
          return (
            <StarWrap key={s} onPress={editable ? () => onChange?.(s) : undefined} hitSlop={6}>
              <Ionicons
                name={filled ? 'star' : 'star-outline'}
                size={editable ? size + 10 : size}
                color={colors.gold}
                style={{ marginRight: 2 }}
              />
            </StarWrap>
          );
        })}
      </View>
      {showValue && (
        <Text style={[type.caption, { color: colors.body, marginLeft: 5 }]}>
          {rating.toFixed(1)}
          {reviewCount !== undefined && <Text style={{ color: colors.muted }}> ({reviewCount})</Text>}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
