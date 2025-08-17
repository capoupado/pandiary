import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

const defaultTags = ['family', 'relationship', 'kids', 'stress', 'burnout', 'joy', 'peace', 'gratitude', 'happiness', 'sadness', 'anger', 'anxiety', 'depression', 'motivation', 'self-care', 'wellness', 'health', 'exercise', 'nutrition', 'sleep', 'work', 'career', 'finance', 'travel', 'hobby', 'learning', 'creativity'];

export default function TagSelector({
  selected,
  onChange,
  tags = defaultTags,
  singleSelect = false,
}: {
  selected: string | string[]; // Accept both string and array
  onChange: (tags: string | string[]) => void;
  tags?: string[];
  singleSelect?: boolean;
}) {
  const toggleTag = (tag: string) => {
    if (singleSelect) {
      // Handle single selection
      onChange(selected === tag ? '' : tag);
    } else {
      // Handle multiple selection
      if (Array.isArray(selected)) {
        if (selected.includes(tag)) {
          onChange(selected.filter((t) => t !== tag));
        } else {
          onChange([...selected, tag]);
        }
      }
    }
  };

  // Function to extract emojis from a string
  const extractEmojis = (text: string) => {
    return text.match(/[\p{Extended_Pictographic}]/gu) || [];
  };

  // Function to remove emojis from a string
  const removeEmojis = (text: string) => {
    return text.replace(/[\p{Extended_Pictographic}]/gu, ''); // Matches only emojis
  };

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginVertical: 10
    },
    tag: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.primary,
      borderWidth: 1,

    },
    selected: {
      borderColor: theme.colors.secondary,
      borderWidth: 1,
      backgroundColor: theme.colors.tertiary,
      elevation: 2,
    },
    text: {
      fontSize: 14,
      color: theme.colors.onSurface,
    },
    selectedText: {
      color: theme.colors.onTertiary,
    },
  });

  return (
    <View style={styles.container}>
      {tags.map(tag => {
        const emojis = extractEmojis(tag).join('');
        const label = removeEmojis(tag).trim();
        const active = singleSelect
          ? selected === label
          : Array.isArray(selected) && selected.includes(label);
        return (
          <TouchableOpacity
            key={label}
            onPress={() => toggleTag(label)}
            style={[styles.tag, active && styles.selected]}
          >
            <Text style={[styles.text, active && styles.selectedText]}>
              {emojis && <Text>{emojis} </Text>}
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
