import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, Text, TextInput, useTheme, Card } from 'react-native-paper';
import TagSelector from '../components/TagSelector';
import { saveEntry, updateEntry } from '../db/database';
import { useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Navigation = StackNavigationProp<any>;

export default function EntryScreenForm() {
    const navigation = useNavigation<Navigation>();
    const route = useRoute<any>();
    const editing = route.params?.mode === 'edit';
    const existingEntry = route.params?.entry;
    const selectedDate = route.params?.selectedDate; // For logging specific days
    const theme = useTheme();

    const styles = StyleSheet.create({
        scrollContainer: {
            flexGrow: 1,
            paddingBottom: 32,
            backgroundColor: theme.colors.background,
        },
        container: { 
            flex: 1, 
            padding: 20, 
            gap: 20, 
            backgroundColor: theme.colors.background 
        },
        headerSection: {
            alignItems: 'center',
            marginBottom: 8,
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
            marginBottom: 16,
        },
        questionSection: {
            marginBottom: 24,
        },
        questionContainer: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 16,
        },
        questionBubble: {
            flex: 1,
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 16,
            marginLeft: 12,
            elevation: 2,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            borderWidth: 1,
            borderColor: theme.colors.outline,
        },
        questionText: {
            color: theme.colors.onSurface,
            fontWeight: '600',
            fontSize: 16,
            textAlign: 'center',
        },
        avatarContainer: {
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: 20,
            padding: 8,
            elevation: 2,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        input: {
            minHeight: 120,
            textAlignVertical: 'top',
            color: theme.colors.onSurface,
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outline,
            borderRadius: 16,
            borderWidth: 1.5,
            padding: 16,
            width: '100%',
            elevation: 1,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
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
        tagSelectorContainer: {
            marginTop: 12,
        },
        notesSection: {
            marginTop: 8,
        },
        notesLabel: {
            color: theme.colors.onSurface,
            fontWeight: '600',
            fontSize: 16,
            marginBottom: 12,
            textAlign: 'center',
        },
    });

    if (editing && !existingEntry) {
        console.error('No existing entry found for editing');
        return null;
    }

    const [sleepAmount, setSleepAmount] = useState(editing ? existingEntry.sleep_time : '');
    const [sleepQuality, setSleepQuality] = useState(editing ? existingEntry.sleep_quality : '');
    const [moods, setMoods] = useState<string[]>(editing ? existingEntry.moods.split(", ") : []);
    const [energyLevel, setEnergyLevel] = useState(editing ? existingEntry.energy_level : '');
    const [stressLevel, setStressLevel] = useState(editing ? existingEntry.stress_level : '');
    const [bodyFeel, setBodyFeel] = useState<string[]>(editing ? existingEntry.body_feel.split(", ") : []);
    const [appetite, setAppetite] = useState(editing ? existingEntry.appetite : '');
    const [focus, setFocus] = useState(editing ? existingEntry.focus : '');
    const [motivation, setMotivation] = useState(editing ? existingEntry.motivation : '');
    const [anxiety, setAnxiety] = useState(editing ? existingEntry.anxiety : '');
    const [others, setOthers] = useState<string>(editing ? existingEntry.others : '');

    const handleSave = async () => {
        try {
            const getTimestamp = () => {
                if (editing) {
                    return undefined;
                }
                
                if (selectedDate) {
                    const date = new Date(selectedDate);
                    date.setHours(new Date().getHours());
                    date.setMinutes(new Date().getMinutes());
                    date.setSeconds(new Date().getSeconds());
                    return date.toISOString();
                }
                
                return new Date().toISOString();
            };

            let entryData: {
                id?: number;
                sleep_time: string;
                sleep_quality: string;
                moods: string;
                energy_level: string;
                stress_level: string;
                body_feel: string;
                appetite: string;
                focus: string;
                motivation: string;
                anxiety: string;
                others: string;
                timestamp?: string;
            } = {
                sleep_time: String(sleepAmount),
                sleep_quality: String(sleepQuality),
                moods: moods.join(', '),
                energy_level: String(energyLevel),
                stress_level: String(stressLevel),
                body_feel: bodyFeel.join(', '),
                appetite: String(appetite),
                focus: String(focus),
                motivation: String(motivation),
                anxiety: String(anxiety),
                others: others,
            };

            const timestamp = getTimestamp();
            if (timestamp) {
                entryData.timestamp = timestamp;
            }

            if (editing) {
                await updateEntry(
                    {
                        ...entryData,
                        id: Number(existingEntry.id),
                    },
                    () => navigation.goBack()
                );
            } else {
                const newId = await saveEntry(entryData as any);
                navigation.replace('entryDetail', { entryId: newId });
            }
        } catch (error) {
            console.error('Error saving entry:', error);
            return;
        }
        
        setSleepAmount('');
        setSleepQuality('');
        setMoods([]);
        setEnergyLevel('');
        setStressLevel('');
        setBodyFeel([]);
        setAppetite('');
        setFocus('');
        setMotivation('');
        setAnxiety('');
        setOthers('');
    };

    const Question = ({ text, children }: { text: string; children: React.ReactNode }) => (
        <View style={styles.questionSection}>
            <View style={styles.questionContainer}>
                <View style={styles.avatarContainer}>
                    <Avatar.Image
                        size={32}
                        source={require('../../assets/my-cherryspace.png')}
                        style={{ borderRadius: 16 }}
                    />
                </View>
                <View style={styles.questionBubble}>
                    <Text style={styles.questionText}>{text}</Text>
                </View>
            </View>
            <View style={styles.tagSelectorContainer}>
                {children}
            </View>
        </View>
    );

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
            enableOnAndroid={true}
            extraScrollHeight={200}
        >
            <View style={styles.container}>
                <View style={styles.headerSection}>
                    <Text variant="headlineMedium" style={styles.pageTitle}>
                        {editing ? 'Edit Your Mood Entry' : 'Create a New Mood Entry'}
                    </Text>
                    <Text variant="bodyMedium" style={styles.pageSubtitle}>
                        Please fill out the following questions to help you understand your mood today.
                    </Text>
                </View>

                <Question text="How long did you sleep for?">
                    <TagSelector
                        selected={sleepAmount}
                        onChange={setSleepAmount}
                        singleSelect={true}
                        tags={[
                            "😴 Didn't sleep",
                            "🌙 0-2",
                            "🌘 3-5",
                            "🌗 6-8",
                            "🌕 8+"
                        ]}
                    />
                </Question>

                <Question text="How was your sleep quality?">
                    <TagSelector
                        selected={sleepQuality}
                        onChange={setSleepQuality}
                        singleSelect={true}
                        tags={[
                            "😵 Very Poor",
                            "😕 Poor",
                            "😐 Fair",
                            "🙂 Good",
                            "😃 Very Good"
                        ]}
                    />
                </Question>

                <Question text="How are you feeling?">
                    <TagSelector
                        selected={moods}
                        onChange={(tags) => setMoods(Array.isArray(tags) ? tags : [tags])}
                        tags={[
                            '😊 Happy',
                            '😢 Sad',
                            '😡 Angry',
                            '😰 Anxious',
                            '😌 Relaxed',
                            '🤩 Excited',
                            '😐 Bored',
                            '😔 Disappointed',
                            '😤 Frustrated',
                            '😱 Stressed',
                            '😇 Grateful',
                            '🥱 Tired',
                            '😕 Confused',
                            '😳 Embarrassed',
                            '😎 Confident',
                            '🥳 Proud',
                            '😭 Overwhelmed',
                            '😶 Numb',
                            '😅 Relieved',
                            '🤗 Loved',
                            '😬 Nervous',
                            '😒 Annoyed',
                            '😃 Content',
                            '😞 Lonely'
                        ]}
                        singleSelect={false}
                    />
                </Question>

                <Question text="How is your energy level?">
                    <TagSelector
                        selected={energyLevel}
                        onChange={setEnergyLevel}
                        singleSelect={true}
                        tags={[
                            "😴 Very Low",
                            "😪 Low",
                            "😐 Medium",
                            "🙂 High",
                            "⚡ Very High"
                        ]}
                    />
                </Question>

                <Question text="How is your stress level?">
                    <TagSelector
                        selected={stressLevel}
                        onChange={setStressLevel}
                        singleSelect={true}
                        tags={[
                            "😌 Very Low",
                            "🙂 Low",
                            "😐 Medium",
                            "😣 High",
                            "😱 Very High"
                        ]}
                    />
                </Question>

                <Question text="How does your body feel?">
                    <TagSelector
                        selected={bodyFeel}
                        onChange={(tags) => setBodyFeel(Array.isArray(tags) ? tags : [tags])}
                        tags={[
                            '🥱 Tired',
                            '😣 Sore',
                            '😌 Relaxed',
                            '⚡ Energetic',
                            '😵 Restless',
                            '🤒 Sick',
                            '🤕 In Pain',
                            '😃 Refreshed',
                            '😫 Achy',
                            '🤢 Nauseous',
                            '😤 Bloated',
                            '😰 Tense',
                            '🦵 Heavy',
                            '🦋 Light',
                            '🧊 Cold',
                            '🔥 Warm',
                            '🦠 Weak',
                            '💪 Strong',
                            '😶 Numb',
                            '😮 Out of Breath'
                        ]}
                        singleSelect={false}
                    />
                </Question>

                <Question text="How is your appetite?">
                    <TagSelector
                        selected={appetite}
                        onChange={setAppetite}
                        singleSelect={true}
                        tags={[
                            "😶 No Appetite",
                            "😕 Low",
                            "😐 Medium",
                            "🙂 High",
                            "🤤 Very High"
                        ]}
                    />
                </Question>

                <Question text="How is your focus?">
                    <TagSelector
                        selected={focus}
                        onChange={setFocus}
                        singleSelect={true}
                        tags={[
                            "😵 Very Low",
                            "😕 Low",
                            "😐 Medium",
                            "🙂 High",
                            "🎯 Very High"
                        ]}
                    />
                </Question>

                <Question text="How is your motivation?">
                    <TagSelector
                        selected={motivation}
                        onChange={setMotivation}
                        singleSelect={true}
                        tags={[
                            "😩 Very Low",
                            "😕 Low",
                            "😐 Medium",
                            "🙂 High",
                            "💪 Very High"
                        ]}
                    />
                </Question>

                <Question text="How is your anxiety?">
                    <TagSelector
                        selected={anxiety}
                        onChange={setAnxiety}
                        singleSelect={true}
                        tags={[
                            "😌 Very Low",
                            "🙂 Low",
                            "😐 Medium",
                            "😰 High",
                            "😱 Very High"
                        ]}
                    />
                </Question>

                <View style={styles.notesSection}>
                    <Text style={styles.notesLabel}>Anything else you'd like to share?</Text>
                    <TextInput
                        multiline
                        placeholder="For example, any other feelings, thoughts, or events that affected your day."
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        textColor={theme.colors.onSurface}
                        style={styles.input}
                        value={others}
                        onChangeText={(text) => setOthers(text)}
                        mode="outlined"
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                    />
                </View>

                <Button 
                    mode="contained" 
                    onPress={handleSave} 
                    disabled={!sleepAmount || !sleepQuality || moods.length === 0 || !energyLevel || !stressLevel || bodyFeel.length === 0 || !appetite || !focus || !motivation || !anxiety}
                    style={styles.saveButton}
                    contentStyle={styles.saveButtonContent}
                    labelStyle={styles.saveButtonLabel}
                >
                    {editing ? 'Update Entry' : 'Save Entry'}
                </Button>
            </View>
        </KeyboardAwareScrollView>
    );
}
