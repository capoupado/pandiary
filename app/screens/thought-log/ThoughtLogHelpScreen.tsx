import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Card, Divider, useTheme } from 'react-native-paper';

export default function ThoughtLogHelpScreen() {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: theme.colors.background },
    card: { marginVertical: 8, backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, borderWidth: 1, borderRadius: 12 },
    sectionTitle: { marginTop: 8, marginBottom: 4, fontWeight: 'bold', color: theme.colors.onSurface },
    body: { color: theme.colors.onSurface },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={{ color: theme.colors.backdrop, fontWeight: 'bold', textAlign: 'center' }}>
            How Thought Logging Works
          </Text>
          <Divider style={{ marginVertical: 12 }} />

          <Text variant="titleMedium" style={styles.sectionTitle}>What is a Thought Log?</Text>
          <Text variant="bodyMedium" style={styles.body}>
            A thought log helps you slow down and notice the link between situations, your thoughts, and how you feel. 
            By writing this down, you can see patterns and develop more balanced thoughts over time.
          </Text>

          <Text variant="titleMedium" style={styles.sectionTitle}>Steps</Text>
          <Text variant="bodyMedium" style={styles.body}>
            1) Situation: Briefly describe what happened or what you anticipated would happen.
          </Text>
          <Text variant="bodyMedium" style={styles.body}>
            2) Emotions: Pick the emotions you felt. Intensity is optional.
          </Text>
          <Text variant="bodyMedium" style={styles.body}>
            3) Automatic Thoughts: Write the first thoughts that came to mind.
          </Text>
          <Text variant="bodyMedium" style={styles.body}>
            4) Evidence For: What facts support this thought?
          </Text>
          <Text variant="bodyMedium" style={styles.body}>
            5) Evidence Against: What facts do not support it?
          </Text>
          <Text variant="bodyMedium" style={styles.body}>
            6) Alternative Thought: A more balanced way to view the situation.
          </Text>
          <Text variant="bodyMedium" style={styles.body}>
            7) Outcome: Notice how you feel after considering an alternative thought.
          </Text>

          <Divider style={{ marginVertical: 12 }} />
          <Text variant="titleMedium" style={styles.sectionTitle}>Tips</Text>
          <Text variant="bodyMedium" style={styles.body}>
            - Keep it short and simple. You can always refine later.
          </Text>
          <Text variant="bodyMedium" style={styles.body}>
            - Focus on facts, not assumptions.
          </Text>
          <Text variant="bodyMedium" style={styles.body}>
            - Be kind to yourself; this is a learning practice, not a test.
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}


