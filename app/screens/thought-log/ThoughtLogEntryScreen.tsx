import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TagSelector from '../../components/TagSelector';
import { saveThoughtLog, updateThoughtLog, getThoughtLogById, ThoughtLog } from '../../db/database';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    thoughtLogEntry: { mode: 'create' | 'edit', logId?: number };
};

type Navigation = StackNavigationProp<RootStackParamList, 'thoughtLogEntry'>;
type RouteProps = RouteProp<RootStackParamList, 'thoughtLogEntry'>;

export default function ThoughtLogEntryScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Navigation>();
  const route = useRoute<RouteProps>();
  const editing = route.params?.mode === 'edit';
  const logId = route.params?.logId;

  const [situation, setSituation] = useState('');
  const [emotions, setEmotions] = useState<string[]>([]);
  const [automaticThoughts, setAutomaticThoughts] = useState('');
  const [evidenceFor, setEvidenceFor] = useState('');
  const [evidenceAgainst, setEvidenceAgainst] = useState('');
  const [alternativeThought, setAlternativeThought] = useState('');
  const [outcome, setOutcome] = useState('');
  const [isLoading, setIsLoading] = useState(editing);

  // Load existing thought log data when editing
  useEffect(() => {
    const loadExistingLog = async () => {
      if (editing && logId) {
        try {
          const existingLog = await getThoughtLogById(logId);
          if (existingLog) {
            setSituation(existingLog.situation || '');
            setEmotions(existingLog.emotions ? existingLog.emotions.split(', ') : []);
            setAutomaticThoughts(existingLog.automatic_thoughts || '');
            setEvidenceFor(existingLog.evidence_for || '');
            setEvidenceAgainst(existingLog.evidence_against || '');
            setAlternativeThought(existingLog.alternative_thought || '');
            setOutcome(existingLog.outcome || '');
          }
        } catch (error) {
          console.error('Error loading existing thought log:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadExistingLog();
  }, [editing, logId]);

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
      ...(editing && logId ? { id: logId } : {}),
    };

    if (editing && logId) {
      await updateThoughtLog(payload, () => navigation.goBack());
    } else {
      const id = await saveThoughtLog(payload);
      navigation.goBack();
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scroll} enableOnAndroid extraScrollHeight={200}>
      <View style={styles.container}>
        {isLoading ? (
          <Text variant="headlineSmall" style={{ color: theme.colors.backdrop, fontWeight: 'bold', textAlign: 'center' }}>
            Loading...
          </Text>
        ) : (
          <>
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
          </>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}


