import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { Text, Button, Card, Title, Paragraph, Divider, useTheme, Avatar } from 'react-native-paper';
import { useFocusEffect, useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
import { getEntryById, deleteEntry, updateAIReport } from '../db/database';
import { formatDate, generateAIReport } from '../utils/utils'; // Assuming you have a utility function to get emoji by mood
import { ensureDailyCheckinReminder } from '../utils/notifications';

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
            deleteEntry(entry.id, () => {
              // Re-schedule notification considering this deletion
              ensureDailyCheckinReminder();
              navigation.goBack();
            });
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 32,
    },
    headerSection: {
      alignItems: 'center',
      marginBottom: 24,
    },
    dateText: {
      color: theme.colors.onSurfaceVariant,
      fontWeight: '600',
      textAlign: 'center',
    },
    sectionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      marginBottom: 16,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    sectionTitle: {
      color: theme.colors.onSurface,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    dataRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    dataIcon: {
      marginRight: 12,
    },
    dataLabel: {
      color: theme.colors.onSurfaceVariant,
      fontWeight: '600',
      marginRight: 8,
    },
    dataValue: {
      color: theme.colors.onSurface,
      flex: 1,
    },
    notesCard: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    actionButton: {
      borderRadius: 12,
      marginBottom: 12,
      elevation: 2,
    },
    deleteButton: {
      borderRadius: 12,
      backgroundColor: theme.colors.error,
      marginTop: 8,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text variant="bodyLarge" style={styles.dateText}>
            Entry created on {formatDate(entry.timestamp)}
          </Text>
        </View>

        {/* Health Metrics Section */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Health & Wellness
            </Text>
            
            <View style={styles.dataRow}>
              <Avatar.Icon 
                size={36} 
                icon="bed" 
                style={[styles.dataIcon, { backgroundColor: theme.colors.primary }]}
                color={theme.colors.onPrimary}
              />
              <Text style={styles.dataLabel}>Sleep:</Text>
              <Text style={styles.dataValue}>
                {entry.sleep_time.replace("-", " to ")} hours, felt {entry.sleep_quality.toLowerCase()}
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Avatar.Icon 
                size={36} 
                icon="battery-charging-high" 
                style={[styles.dataIcon, { backgroundColor: theme.colors.secondary }]}
                color={theme.colors.onSecondary}
              />
              <Text style={styles.dataLabel}>Energy:</Text>
              <Text style={styles.dataValue}>{entry.energy_level}</Text>
            </View>

            <View style={styles.dataRow}>
              <Avatar.Icon 
                size={36} 
                icon="dumbbell" 
                style={[styles.dataIcon, { backgroundColor: theme.colors.primary }]}
                color={theme.colors.onPrimary}
              />
              <Text style={styles.dataLabel}>Body Feel:</Text>
              <Text style={styles.dataValue}>
                {Array.isArray(entry.body_feel)
                  ? entry.body_feel.map((m: string) => m.toLowerCase()).join(', ')
                  : entry.body_feel || 'N/A'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Mental State Section */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Mental State
            </Text>
            
            <View style={styles.dataRow}>
              <Avatar.Icon 
                size={36} 
                icon="emoticon-happy" 
                style={[styles.dataIcon, { backgroundColor: theme.colors.tertiary }]}
                color={theme.colors.onTertiary}
              />
              <Text style={styles.dataLabel}>Mood:</Text>
              <Text style={styles.dataValue}>
                {Array.isArray(entry.moods)
                  ? entry.moods.map((m: string) => m.toLowerCase()).join(', ')
                  : entry.moods || 'N/A'}
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Avatar.Icon 
                size={36} 
                icon="emoticon-sad" 
                style={[styles.dataIcon, { backgroundColor: theme.colors.secondary }]}
                color={theme.colors.onSecondary}
              />
              <Text style={styles.dataLabel}>Stress:</Text>
              <Text style={styles.dataValue}>{entry.stress_level}</Text>
            </View>

            <View style={styles.dataRow}>
              <Avatar.Icon 
                size={36} 
                icon="emoticon-sad" 
                style={[styles.dataIcon, { backgroundColor: theme.colors.primary }]}
                color={theme.colors.onPrimary}
              />
              <Text style={styles.dataLabel}>Anxiety:</Text>
              <Text style={styles.dataValue}>{entry.anxiety}</Text>
            </View>

            <View style={styles.dataRow}>
              <Avatar.Icon 
                size={36} 
                icon="emoticon-happy" 
                style={[styles.dataIcon, { backgroundColor: theme.colors.secondary }]}
                color={theme.colors.onSecondary}
              />
              <Text style={styles.dataLabel}>Motivation:</Text>
              <Text style={styles.dataValue}>{entry.motivation}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Additional Metrics */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Additional Metrics
            </Text>
            
            <View style={styles.dataRow}>
              <Avatar.Icon 
                size={36} 
                icon="food" 
                style={[styles.dataIcon, { backgroundColor: theme.colors.tertiary }]}
                color={theme.colors.onTertiary}
              />
              <Text style={styles.dataLabel}>Appetite:</Text>
              <Text style={styles.dataValue}>{entry.appetite}</Text>
            </View>

            <View style={styles.dataRow}>
              <Avatar.Icon 
                size={36} 
                icon="brain" 
                style={[styles.dataIcon, { backgroundColor: theme.colors.primary }]}
                color={theme.colors.onPrimary}
              />
              <Text style={styles.dataLabel}>Focus:</Text>
              <Text style={styles.dataValue}>{entry.focus}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Notes Section */}
        {entry.others && (
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Notes
              </Text>
              <View style={styles.notesCard}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {entry.others}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* AI Report Section */}
        {entry.ai_report && (
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Pandiary AI Report
              </Text>
              <View style={styles.notesCard}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {entry.ai_report}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={{ marginTop: 8 }}>
          <Button 
            mode="contained" 
            style={[styles.actionButton, { 
              backgroundColor: !!entry.ai_report ? theme.colors.outline : theme.colors.primary 
            }]}
            disabled={!!entry.ai_report}
            onPress={() => navigation.navigate('entryForm', { mode: 'edit', entry })}
            icon="pencil"
            contentStyle={{ paddingVertical: 8 }}
            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
          >
            Edit this entry
          </Button>
          
          <Button 
            mode="contained" 
            style={[styles.actionButton, { 
              backgroundColor: !!entry.ai_report ? theme.colors.outline : theme.colors.tertiary 
            }]}
            disabled={!!entry.ai_report}
            onPress={() => handleGenerateAIReport(entry)}
            icon="file-document"
            contentStyle={{ paddingVertical: 8 }}
            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
          >
            {!!entry.ai_report ? "Report Already Generated" : "Generate AI Report"}
          </Button>
          
          <Button 
            mode="contained" 
            style={styles.deleteButton}
            onPress={handleDelete}
            icon="delete"
            contentStyle={{ paddingVertical: 8 }}
            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
          >
            Delete this entry
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
