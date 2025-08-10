import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph, Divider, useTheme } from 'react-native-paper';
import { useFocusEffect, useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
import { getEntryById, deleteEntry, updateAIReport } from '../db/database';
import { formatDate, generateAIReport } from '../utils/utils'; // Assuming you have a utility function to get emoji by mood

// Define your stack param list
type RootStackParamList = {
  home: undefined;
  entry: undefined;
  entryForm: { mode: string; entry: any };
  entryDetail: { entryId: string };
  summary: undefined;
};

export default function EntryDetailScreen() {
  const [entry, setEntry] = useState<any | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'entryDetail'>>();
  const { entryId } = route.params;
  const theme = useTheme();

  useEffect(() => {
    // no-op fetch here; real loading happens on focus
  }, [entryId]);

  useFocusEffect(
    useCallback(() => {
      const fetchEntry = async () => {
        try {
          const fetchedEntry = await getEntryById(Number(entryId));
          setEntry(fetchedEntry);
        } catch (error) {
          console.error('Error fetching entry:', error);
        }
      };

      fetchEntry();
    }, [entryId])
  );

  const handleDelete = () => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteEntry(entry.id, () => navigation.goBack());
          }
        }
      ]
    );
  };

  const handleGenerateAIReport = async (entry: any) => {
    try {
      Alert.alert("Generating AI Report", "Please wait while the AI report is being generated...");
      const aiReport = await generateAIReport(entry);
      if (aiReport) {
        // Assuming you want to navigate to a summary screen with the AI report
        updateAIReport(entry.id, aiReport, () => {
          Alert.alert("AI Report Generated", "The AI report has been generated successfully.");
          setEntry((prevEntry: any) => ({
            ...prevEntry,
            ai_report: aiReport
          }));
        });

      } else {
        Alert.alert("Error", "Failed to generate AI report.");
      }
    } catch (error) {
      console.error('Error generating AI report:', error);
      Alert.alert("Error", "An error occurred while generating the AI report.");
    }
  }

  if (!entry) {
    return <Text style={{ padding: 16 }}>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} style={{ flexGrow: 1, paddingBottom: 20, backgroundColor: theme.colors.background }}>
      <Text variant="labelLarge" style={{ marginBottom: 10, color: theme.colors.backdrop, fontWeight: 'bold', textAlign: 'center' }}>
        This entry was created on {formatDate(entry.timestamp)}
      </Text>
      <Card style={{ marginBottom: 20, borderRadius: 12, backgroundColor: theme.colors.secondary }}>
        <Card.Content>
          <Text variant="labelLarge">Hey there,</Text>
          <Text style={{ marginTop: 8 }} variant="bodyMedium">
            <Text variant="bodyMedium">🙍🏻‍♂️ You feel </Text>
            {Array.isArray(entry.moods)
              ? entry.moods.map((m: string) => m.toLowerCase()).join(', ')
              : entry.moods
                ? entry.moods.toLowerCase()
                : 'N/A'}.
          </Text>
          <Text style={{ marginTop: 8 }} variant="bodyMedium">
            <Text variant="bodyMedium">🌙 You slept around </Text>
            {entry.sleep_time.replace("-", " to ") + " hours" || 'N/A'}
            <Text variant="bodyMedium"> and you feel it was </Text>
            {entry.sleep_quality.toLowerCase() || 'N/A'}.
          </Text>
          <Text style={{ marginTop: 8 }} variant="bodyMedium">
            <Text variant="bodyMedium">🔋 Your energy level is </Text>
            {entry.energy_level.toLowerCase() || 'N/A'}.
          </Text>
          <Text style={{ marginTop: 8 }} variant="bodyMedium">
            <Text variant="bodyMedium">😣 Your stress level is </Text>
            {entry.stress_level.toLowerCase() || 'N/A'}.
          </Text>
          <Text style={{ marginTop: 8 }} variant="bodyMedium">
            <Text variant="bodyMedium">💪🏻 Your body feels </Text>
            {Array.isArray(entry.body_feel)
              ? entry.body_feel.map((m: string) => m.toLowerCase()).join(', ')
              : entry.body_feel
                ? entry.body_feel.toLowerCase()
                : 'N/A'}.
          </Text>
          <Text style={{ marginTop: 8 }} variant="bodyMedium">
            <Text variant="bodyMedium">🍴 Your appetite is </Text>
            {entry.appetite.toLowerCase() || 'N/A'}.
          </Text>
          <Text style={{ marginTop: 8 }} variant="bodyMedium">
            <Text variant="bodyMedium">🧠 Your focus level is </Text>
            {entry.focus.toLowerCase() || 'N/A'}.
          </Text>
          <Text style={{ marginTop: 8 }} variant="bodyMedium">
            <Text variant="bodyMedium">🍃 Your motivation level is </Text>
            {entry.motivation.toLowerCase() || 'N/A'}.
          </Text>
          <Text style={{ marginTop: 8 }} variant="bodyMedium">
            <Text variant="bodyMedium">😰 Your anxiety level is </Text>
            {entry.anxiety.toLowerCase() || 'N/A'}.
          </Text>
          <Divider style={{ marginVertical: 16 }} />
          <Text variant="titleLarge">Notes</Text>
          <Text variant="bodyMedium">{entry.others || 'No notes provided.'}</Text>

          {entry.ai_report ? (
            <>
              <Divider style={{ marginVertical: 16 }} />
              <Text variant="titleLarge">Pandiary Report:</Text>
              <Text variant='bodyMedium'>{entry.ai_report}</Text>
            </>
          ) : (
            <></>
          )}
          <View style={{ marginTop: 20, marginBottom: 20, flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
            <Button style={{backgroundColor: !!entry.ai_report ?  theme.colors.surfaceDisabled : theme.colors.tertiary}} mode="contained" onPress={() => navigation.navigate('entryForm', { mode: 'edit', entry })} disabled={!!entry.ai_report}>
              ✏️ Edit this entry
            </Button>
            <Button style={{backgroundColor: !!entry.ai_report ?  theme.colors.surfaceDisabled : theme.colors.tertiary}} mode="contained" onPress={() => handleGenerateAIReport(entry)} disabled={!!entry.ai_report}>
              {!!entry.ai_report ? "📃 Already generated report" : "📃 Generate Report"}
            </Button>
            <Button style={{backgroundColor: theme.colors.tertiary}} mode="contained" onPress={handleDelete}>
              🗑️ Delete this entry
            </Button>
          </View>
        </Card.Content>

      </Card>


    </ScrollView>
  );
}
