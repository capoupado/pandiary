import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TagSelector from '../../components/TagSelector';
import { saveThoughtLog, updateThoughtLog, ThoughtLog } from '../../db/database';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type Navigation = StackNavigationProp<any>;

export default function ThoughtLogEntryScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Navigation>();
  const route = useRoute<any>();
  const editing = route.params?.mode === 'edit';
  const existing: ThoughtLog | undefined = route.params?.log;

  const [situation, setSituation] = useState(editing ? existing?.situation ?? '' : '');
  const [emotions, setEmotions] = useState<string[]>(editing ? (existing?.emotions?.split(', ') ?? []) : []);
  const [automaticThoughts, setAutomaticThoughts] = useState(editing ? existing?.automatic_thoughts ?? '' : '');
  const [evidenceFor, setEvidenceFor] = useState(editing ? existing?.evidence_for ?? '' : '');
  const [evidenceAgainst, setEvidenceAgainst] = useState(editing ? existing?.evidence_against ?? '' : '');
  const [alternativeThought, setAlternativeThought] = useState(editing ? existing?.alternative_thought ?? '' : '');
  const [outcome, setOutcome] = useState(editing ? existing?.outcome ?? '' : '');

  const styles = StyleSheet.create({
    scroll: { flexGrow: 1, paddingBottom: 64, backgroundColor: theme.colors.background },
    container: { flex: 1, padding: 16, gap: 12 },
    input: {
      backgroundColor: theme.colors.onSurface,
      borderColor: theme.colors.outline,
      borderWidth: 1,
      borderRadius: 8,
      padding: 6,
    },
    label: { color: theme.colors.onSurface, backgroundColor: theme.colors.surface, padding: 6, borderRadius: 8 },
  });

  const handleSave = async () => {
    const timestamp = new Date().toISOString();
    const payload: ThoughtLog = {
      situation: situation.trim(),
      emotions: emotions.join(', '),
      automatic_thoughts: automaticThoughts.trim(),
      evidence_for: evidenceFor.trim(),
      evidence_against: evidenceAgainst.trim(),
      alternative_thought: alternativeThought.trim(),
      outcome: outcome.trim(),
      timestamp,
      ...(editing && existing?.id ? { id: existing.id } : {}),
    };

    if (editing && existing?.id) {
      await updateThoughtLog(payload, () => navigation.goBack());
    } else {
      const id = await saveThoughtLog(payload);
      navigation.goBack();
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scroll} enableOnAndroid extraScrollHeight={200}>
      <View style={styles.container}>
        <Text variant="headlineSmall" style={{ color: theme.colors.backdrop, fontWeight: 'bold', textAlign: 'center' }}>
          {editing ? 'Edit Thought Record' : 'New Thought Record'}
        </Text>

        <Text variant="labelLarge" style={styles.label}>Situation</Text>
        <TextInput
          multiline
          placeholder="Describe the situation or trigger"
          placeholderTextColor={theme.colors.backdrop}
          textColor="#000"
          style={styles.input}
          value={situation}
          onChangeText={setSituation}
          mode="flat"
        />

        <Text variant="labelLarge" style={styles.label}>Emotions</Text>
        <TagSelector
          selected={emotions}
          onChange={(tags) => setEmotions(Array.isArray(tags) ? tags : [tags])}
          singleSelect={false}
          tags={[
            '😢 Sad', '😡 Angry', '😰 Anxious', '😌 Calm', '😱 Scared', '😇 Grateful', '🥱 Tired', '😕 Confused', '😎 Confident', '😭 Overwhelmed'
          ]}
        />

        <Text variant="labelLarge" style={styles.label}>Automatic Thoughts</Text>
        <TextInput
          multiline
          placeholder="What went through your mind?"
          placeholderTextColor={theme.colors.backdrop}
          textColor="#000"
          style={styles.input}
          value={automaticThoughts}
          onChangeText={setAutomaticThoughts}
          mode="flat"
        />

        <Text variant="labelLarge" style={styles.label}>Evidence For</Text>
        <TextInput
          multiline
          placeholder="What evidence supports the thought?"
          placeholderTextColor={theme.colors.backdrop}
          textColor="#000"
          style={styles.input}
          value={evidenceFor}
          onChangeText={setEvidenceFor}
          mode="flat"
        />

        <Text variant="labelLarge" style={styles.label}>Evidence Against</Text>
        <TextInput
          multiline
          placeholder="What evidence does not support the thought?"
          placeholderTextColor={theme.colors.backdrop}
          textColor="#000"
          style={styles.input}
          value={evidenceAgainst}
          onChangeText={setEvidenceAgainst}
          mode="flat"
        />

        <Text variant="labelLarge" style={styles.label}>Alternative Thought</Text>
        <TextInput
          multiline
          placeholder="A more balanced thought"
          placeholderTextColor={theme.colors.backdrop}
          textColor="#000"
          style={styles.input}
          value={alternativeThought}
          onChangeText={setAlternativeThought}
          mode="flat"
        />

        <Text variant="labelLarge" style={styles.label}>Outcome</Text>
        <TextInput
          multiline
          placeholder="How do you feel now? What will you do?"
          placeholderTextColor={theme.colors.backdrop}
          textColor="#000"
          style={styles.input}
          value={outcome}
          onChangeText={setOutcome}
          mode="flat"
        />

        <Button mode="contained" onPress={handleSave} disabled={!situation || emotions.length === 0}>
          {editing ? 'Update' : 'Save'}
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}


