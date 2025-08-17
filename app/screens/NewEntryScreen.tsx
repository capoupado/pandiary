import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, Text, TextInput, useTheme } from 'react-native-paper';
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
            paddingBottom: 64, // Add padding to the bottom for better scroll experience
            backgroundColor: theme.colors.background, // Let Paper theme handle background color
        },
        container: { flex: 1, padding: 16, gap: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background },
        input: {
            minHeight: 100,
            textAlignVertical: 'top',
            color: "#000000", // Use Paper theme for text color
            backgroundColor: theme.colors.onSurface, // Let Paper theme handle surface color
            borderColor: theme.colors.primary, // Use Paper theme for border color
            borderRadius: 8,
            borderWidth: 2,
            padding: 8,
            width: '100%',
        },
        questions: {
            color: theme.colors.onSurface, // Use Paper theme for text color
            fontWeight: 'bold',
            textAlign: 'center',
        },
    });

    if (editing && !existingEntry) {
        console.error('No existing entry found for editing');
        return null; // or handle this case appropriately
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
        // Validate required fields as needed
        // Example: require at least one mood and sleepAmount
        // if (moods.length === 0) return;
        try {
            // For new entries: use selectedDate if provided, otherwise current time
            // For editing: don't include timestamp to preserve original
            const getTimestamp = () => {
                if (editing) {
                    return undefined; // Don't update timestamp when editing
                }
                
                if (selectedDate) {
                    // Use the selected date but keep current time
                    const date = new Date(selectedDate);
                    date.setHours(new Date().getHours());
                    date.setMinutes(new Date().getMinutes());
                    date.setSeconds(new Date().getSeconds());
                    return date.toISOString();
                }
                
                return new Date().toISOString(); // Default to current time
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
                moods: moods.join(', '), // Convert array to string
                energy_level: String(energyLevel),
                stress_level: String(stressLevel),
                body_feel: bodyFeel.join(', '), // Convert array to string
                appetite: String(appetite),
                focus: String(focus),
                motivation: String(motivation),
                anxiety: String(anxiety),
                others: others,
            };

            // Only add timestamp for new entries
            const timestamp = getTimestamp();
            if (timestamp) {
                entryData.timestamp = timestamp;
            }

            if (editing) {
                // Ensure id is present and of type number
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
        // Reset all fields
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

    const AvatarPanda = (<Avatar.Image
        size={32}
        source={require('../../assets/my-cherryspace.png')}
        style={{ backgroundColor: "rgba(255,255,255,0)", alignContent: 'center', justifyContent: 'center', borderRadius: 16, marginRight: 8 }}
    />);

    const Question = ({ text }: { text: string }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 4 }}>
            {AvatarPanda}
            <Text
                style={[styles.questions, { flexShrink: 1, flexWrap: 'wrap', backgroundColor: theme.colors.secondaryContainer, borderColor: "#4691ED", borderWidth: 1, borderRadius: 16, paddingHorizontal: 8, paddingVertical: 2 }]}
                variant="titleMedium"
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                {text}
            </Text>
        </View>
    );

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
            enableOnAndroid={true} // Ensures it works on Android
            extraScrollHeight={200} // Adjusts scroll height when the keyboard is open
        >
            <View style={styles.container}>
                <Text variant="headlineSmall" style={{ color: theme.colors.backdrop, fontWeight: 'bold', textAlign: 'center' }}>
                    {editing ? 'Edit Your Mood Entry' : 'Create a New Mood Entry'}
                </Text>
                <Text variant="labelSmall" style={{ color: theme.colors.backdrop, textAlign: 'center', marginBottom: 16 }}>
                    Please fill out the following questions to help you understand your mood today.
                </Text>

                {Question({ text: "How long did you sleep for?" })}
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
                {Question({ text: "How was your sleep quality?" })}
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
                {Question({ text: "How are you feeling?" })}
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
                {Question({ text: "How is your energy level?" })}
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
                {Question({ text: "How is your stress level?" })}
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
                {Question({ text: "How does your body feel?" })}
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
                {Question({ text: "How is your appetite?" })}
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
                {Question({ text: "How is your focus?" })}
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
                {Question({ text: "How is your motivation?" })}
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
                {Question({ text: "How is your anxiety?" })}
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
                {Question({ text: "Anything else you'd like to share?" })}
                <TextInput
                    multiline
                    placeholder="For example, any other feelings, thoughts, or events that affected your day."
                    placeholderTextColor={theme.colors.backdrop}
                    textColor='#000000'
                    style={styles.input}
                    value={others}
                    onChangeText={(text) => setOthers(text)}
                    mode="outlined" />
                <Button mode="contained" onPress={handleSave} disabled={!sleepAmount}>
                    {editing ? 'Update Entry' : 'Save Entry'}
                </Button>
            </View>
        </KeyboardAwareScrollView>
    );
}
