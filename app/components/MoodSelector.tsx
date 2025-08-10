import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

const moods = [
  { label: '😞', value: 1 },
  { label: '😐', value: 2 },
  { label: '🙂', value: 3 },
  { label: '😊', value: 4 },
  { label: '😄', value: 5 }
];

export default function MoodSelector({
  selected,
  onSelect
}: {
  selected: number | null;
  onSelect: (mood: number) => void;
}) {
  return (
    <View style={styles.container}>
      {moods.map(mood => (
        <TouchableOpacity
          key={mood.value}
          onPress={() => onSelect(mood.value)}
          style={[
            styles.mood,
            selected === mood.value && styles.selected
          ]}
        >
          <Text style={styles.emoji}>{mood.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  mood: {
    padding: 10,
    borderRadius: 50
  },
  selected: {
    backgroundColor: '#d0e6ff'
  },
  emoji: {
    fontSize: 32
  }
});
