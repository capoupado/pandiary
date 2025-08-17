import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme, Divider } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ThoughtLog } from '../../db/database';

type RootStackParamList = {
    thoughtLogEntry: { mode: 'create' | 'edit', logId?: number };
    thoughtLogView: { log: ThoughtLog };
};

type Navigation = StackNavigationProp<RootStackParamList, 'thoughtLogEntry' | 'thoughtLogView'>;
type RouteProps = RouteProp<RootStackParamList, 'thoughtLogView'>;

export default function ThoughtLogViewScreen() {
    const navigation = useNavigation<Navigation>();
    const route = useRoute<RouteProps>();
    const { log } = route.params;
    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        scrollContainer: {
            padding: 16,
        },
        header: {
            marginBottom: 24,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.primary,
            textAlign: 'center',
            marginBottom: 8,
        },
        timestamp: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center',
        },
        card: {
            marginBottom: 16,
            borderRadius: 12,
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
            borderWidth: 1,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.primary,
            marginBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.outlineVariant,
            paddingBottom: 8,
        },
        content: {
            fontSize: 16,
            color: theme.colors.onSurface,
            lineHeight: 24,
            backgroundColor: theme.colors.surface,
            padding: 16,
            borderRadius: 8,
            minHeight: 60,
        },
        emptyContent: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
            fontStyle: 'italic',
            textAlign: 'center',
        },
        buttonContainer: {
            marginTop: 32,
            gap: 12,
        },
        editButton: {
            marginBottom: 8,
        },
    });

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString();
    };

    const renderSection = (title: string, content: string | undefined, emptyText: string = 'Not specified') => (
        <Card style={styles.card}>
            <Card.Content>
                <Text style={styles.cardTitle}>{title}</Text>
                <View style={styles.content}>
                    <Text style={content ? { color: theme.colors.onSurface, fontWeight: '500' } : styles.emptyContent}>
                        {content || emptyText}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );

    const handleEdit = () => {
        navigation.navigate('thoughtLogEntry', { mode: 'edit', logId: log.id });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>Thought Log Entry</Text>
                <Text style={styles.timestamp}>{formatTimestamp(log.timestamp)}</Text>
            </View>

            {renderSection('Situation', log.situation, 'No situation described')}
            {renderSection('Emotions', log.emotions, 'No emotions recorded')}
            {renderSection('Automatic Thoughts', log.automatic_thoughts, 'No automatic thoughts recorded')}
            {renderSection('Evidence For', log.evidence_for, 'No supporting evidence')}
            {renderSection('Evidence Against', log.evidence_against, 'No counter-evidence')}
            {renderSection('Alternative Thoughts', log.alternative_thought, 'No alternative thoughts')}
            {renderSection('Outcome', log.outcome, 'No outcome recorded')}

            <View style={styles.buttonContainer}>
                <Button 
                    mode="contained" 
                    onPress={handleEdit} 
                    style={styles.editButton}
                    icon="pencil"
                >
                    Edit Entry
                </Button>
                <Button 
                    mode="outlined" 
                    onPress={() => navigation.goBack()}
                    icon="arrow-left"
                >
                    Back to List
                </Button>
            </View>
        </ScrollView>
    );
}
