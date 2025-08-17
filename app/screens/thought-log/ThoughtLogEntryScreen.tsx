import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput, useTheme, Card, Avatar } from 'react-native-paper';
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
    scroll: { 
      flexGrow: 1, 
      paddingBottom: 32, 
      backgroundColor: theme.colors.background 
    },
    container: { 
      flex: 1, 
      padding: 20, 
      gap: 20 
    },
    headerSection: {
      alignItems: 'center',
      marginBottom: 24,
    },
    pageTitle: {
      color: theme.colors.onBackground,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8,
    },
    pageSubtitle: {
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 20,
    },
    formSection: {
      backgroundColor: theme.colors.surfaceVariant,
      padding: 20,
      borderRadius: 20,
      marginBottom: 20,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 16,
      textAlign: 'center',
    },
    formLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.onSurfaceVariant,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outline,
      borderWidth: 1.5,
      borderRadius: 16,
      padding: 16,
      marginTop: 8,
      marginBottom: 16,
      fontSize: 16,
      color: theme.colors.onSurface,
      minHeight: 100,
      textAlignVertical: 'top',
      elevation: 1,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    tagSelectorContainer: {
      marginTop: 8,
      marginBottom: 16,
    },
    saveButton: {
      borderRadius: 16,
      marginTop: 16,
      elevation: 3,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    saveButtonContent: {
      paddingVertical: 12,
      paddingHorizontal: 32,
    },
    saveButtonLabel: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    iconContainer: {
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: 20,
      padding: 8,
      marginBottom: 16,
      alignSelf: 'center',
    },
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

  const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scroll} enableOnAndroid extraScrollHeight={200}>
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <Avatar.Icon 
                size={48} 
                icon="loading" 
                color={theme.colors.primary}
              />
            </View>
            <Text variant="headlineMedium" style={styles.pageTitle}>
              Loading...
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.headerSection}>
              <View style={styles.iconContainer}>
                <Avatar.Icon 
                  size={48} 
                  icon="brain" 
                  color={theme.colors.primary}
                />
              </View>
              <Text variant="headlineMedium" style={styles.pageTitle}>
                {editing ? 'Edit Thought Record' : 'New Thought Record'}
              </Text>
              <Text variant="bodyMedium" style={styles.pageSubtitle}>
                {editing ? 'Update your cognitive restructuring exercise' : 'Practice cognitive behavioral therapy techniques'}
              </Text>
            </View>

            <FormSection title="Situation & Context">
              <Text style={styles.formLabel}>Describe the situation or trigger</Text>
              <TextInput
                multiline
                placeholder="What happened? Where were you? Who was involved?"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                textColor={theme.colors.onSurface}
                style={styles.input}
                value={situation}
                onChangeText={setSituation}
                mode="outlined"
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
              />
            </FormSection>

            <FormSection title="Emotional Response">
              <Text style={styles.formLabel}>What emotions did you experience?</Text>
              <View style={styles.tagSelectorContainer}>
                <TagSelector
                  selected={emotions}
                  onChange={(tags) => setEmotions(Array.isArray(tags) ? tags : [tags])}
                  singleSelect={false}
                  tags={[
                    '😢 Sad', '😡 Angry', '😰 Anxious', '😌 Calm', '😱 Scared', 
                    '😇 Grateful', '🥱 Tired', '😕 Confused', '😎 Confident', 
                    '😭 Overwhelmed', '😤 Frustrated', '😔 Disappointed', '🤗 Loved'
                  ]}
                />
              </View>
            </FormSection>

            <FormSection title="Automatic Thoughts">
              <Text style={styles.formLabel}>What went through your mind?</Text>
              <TextInput
                multiline
                placeholder="What thoughts automatically came to mind? What did you tell yourself?"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                textColor={theme.colors.onSurface}
                style={styles.input}
                value={automaticThoughts}
                onChangeText={setAutomaticThoughts}
                mode="outlined"
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
              />
            </FormSection>

            <FormSection title="Evidence Analysis">
              <Text style={styles.formLabel}>Evidence that supports the thought</Text>
              <TextInput
                multiline
                placeholder="What facts or evidence support this thought?"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                textColor={theme.colors.onSurface}
                style={styles.input}
                value={evidenceFor}
                onChangeText={setEvidenceFor}
                mode="outlined"
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
              />

              <Text style={styles.formLabel}>Evidence that doesn't support the thought</Text>
              <TextInput
                multiline
                placeholder="What facts or evidence contradict this thought?"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                textColor={theme.colors.onSurface}
                style={styles.input}
                value={evidenceAgainst}
                onChangeText={setEvidenceAgainst}
                mode="outlined"
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
              />
            </FormSection>

            <FormSection title="Cognitive Restructuring">
              <Text style={styles.formLabel}>Alternative, more balanced thought</Text>
              <TextInput
                multiline
                placeholder="What would be a more realistic and helpful way to think about this?"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                textColor={theme.colors.onSurface}
                style={styles.input}
                value={alternativeThought}
                onChangeText={setAlternativeThought}
                mode="outlined"
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
              />
            </FormSection>

            <FormSection title="Outcome & Action">
              <Text style={styles.formLabel}>How do you feel now? What will you do?</Text>
              <TextInput
                multiline
                placeholder="How has your mood changed? What actions will you take?"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                textColor={theme.colors.onSurface}
                style={styles.input}
                value={outcome}
                onChangeText={setOutcome}
                mode="outlined"
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
              />
            </FormSection>

            <Button 
              mode="contained" 
              onPress={handleSave} 
              disabled={!situation || emotions.length === 0}
              style={styles.saveButton}
              contentStyle={styles.saveButtonContent}
              labelStyle={styles.saveButtonLabel}
              icon="content-save"
            >
              {editing ? 'Update Record' : 'Save Record'}
            </Button>
          </>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}


