import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { saveUserInfo, getUserInfo } from '../db/database'; // Assuming you have a function to save user info

type Navigation = StackNavigationProp<any>;



export default function UserInfoScreen() {
    const [userId, setUserId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [conditions, setConditions] = useState('');
    const [medications, setMedications] = useState('');
    const [hobbies, setHobbies] = useState('');
    const [goals, setGoals] = useState('');
    const [occupation, setOccupation] = useState('');
    const [physicalActivity, setPhysicalActivity] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const theme = useTheme();

    const styles = StyleSheet.create({
        scrollContainer: {
            flexGrow: 1,
            paddingBottom: 64, // Add padding to the bottom for better scroll experience
            backgroundColor: theme.colors.background, // Use theme background color
        },
        container: { flex: 1, padding: 16, gap: 12 },
        input: {
            textAlignVertical: 'top',
            backgroundColor: theme.colors.onSurface, // Let Paper theme handle surface color
            borderColor: theme.colors.outline,
            borderWidth: 1,
            borderRadius: 8,
            padding: 2,
        },
        text: {
            backgroundColor: theme.colors.surface,
            padding: 8,
            borderRadius: 8,
            color: theme.colors.onSurface, // Use theme onSurface color for text
        },
    });

    const loadUserInfo = async () => {
        try {
            const userInfo = await getUserInfo();
            if (userInfo) {
                setUserId(userInfo.id || 1); // Set userId if available
                setName(userInfo.name || '');
                setAge(String(userInfo.age || ''));
                setWeight(String(userInfo.weight || ''));
                setHeight(String(userInfo.height || ''));
                setConditions(userInfo.conditions || '');
                setMedications(userInfo.medications || '');
                setHobbies(userInfo.hobbies || '');
                setGoals(userInfo.goals || '');
                setOccupation(userInfo.occupation || '');
                setPhysicalActivity(userInfo.physical_activity || '');
                setAdditionalInfo(userInfo.additional_info || '');
            }

        } catch (error) {
            console.error('Error loading user info:', error);
        }
    };


    useFocusEffect(
        useCallback(() => {
            // Load user info when the screen is focused
            loadUserInfo();
        }, [])
    );

    useEffect(() => {
        // Load existing user info if available
        loadUserInfo();
    }, []);

    const handleSave = async () => {
        try {
            let userInfo = {
                id: userId || 1, // Use existing userId or null for new entry
                name: String(name),
                age: Number(age),
                weight: Number(weight),
                height: Number(height),
                conditions: String(conditions),
                medications: String(medications),
                hobbies: String(hobbies),
                goals: String(goals),
                occupation: String(occupation),
                physical_activity: String(physicalActivity),
                additional_info: String(additionalInfo), // Placeholder for additional info
            };

            await saveUserInfo(userInfo, () => {
                // Callback after saving user info
                Alert.alert('User Info Saved', 'Your information has been saved successfully.');
            });
        }
        catch (error) {
            console.error('Error saving user info:', error);
        }
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
            enableOnAndroid={true} // Ensures it works on Android
            extraScrollHeight={200} // Adjusts scroll height when the keyboard is open
        >
            <View style={styles.container}>
                <Text style={{color: theme.colors.backdrop, textAlign: 'center'}} variant="labelLarge">User Information</Text>
                <Text style={styles.text} variant="labelMedium">⚠️ This will be used to personalize your experience.</Text>
                <Text style={styles.text} variant="labelLarge">Your name (or what you like being called)</Text>
                <TextInput
                    placeholder="John Doe"
                    placeholderTextColor={theme.colors.backdrop}
                    style={styles.input}
                    textColor='#000'
                    value={name}
                    onChangeText={(text) => setName(text)}
                    mode="flat" />

                <Text style={styles.text} variant="labelLarge">How old are you?</Text>
                <TextInput
                    keyboardType="numeric"
                    placeholder="25"
                    textColor='#000'
                    placeholderTextColor={theme.colors.backdrop}
                    style={styles.input}
                    value={age}
                    onChangeText={(text) => setAge(text)}
                    mode="flat" />

                <Text style={styles.text} variant="labelLarge">What is your weight?</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        keyboardType="numeric"
                        placeholder="70"
                        textColor='#000'
                        placeholderTextColor={theme.colors.backdrop}
                        style={[styles.input, { flex: 1 }]}
                        value={weight}
                        onChangeText={(text) => setWeight(text.replace(/[^0-9.]/g, ''))}
                        mode="flat"
                    />
                    <Text style={{ marginLeft: 8 }}>kg</Text>
                </View>

                <Text style={styles.text} variant="labelLarge">What is your height?</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        keyboardType="numeric"
                        placeholder="175"
                        textColor='#000'
                        placeholderTextColor={theme.colors.backdrop}
                        style={[styles.input, { flex: 1 }]}
                        value={height}
                        onChangeText={(text) => setHeight(text.replace(/[^0-9.]/g, ''))}
                        mode="flat"
                    />
                    <Text style={{ marginLeft: 8 }}>cm</Text>
                </View>
                <Text style={styles.text} variant="labelLarge">Do you have any medical conditions?</Text>
                <TextInput
                    multiline
                    placeholder="e.g., diabetes, asthma"
                    placeholderTextColor={theme.colors.backdrop}
                    textColor='#000'
                    style={styles.input}
                    value={conditions}
                    onChangeText={(text) => setConditions(text)}
                    mode="flat" />
                <Text style={styles.text} variant="labelLarge">Are you taking any medications?</Text>
                <TextInput
                    multiline
                    placeholder="e.g., insulin, inhaler"
                    placeholderTextColor={theme.colors.backdrop}
                    textColor='#000'
                    style={styles.input}
                    value={medications}
                    onChangeText={(text) => setMedications(text)}
                    mode="flat" />
                <Text style={styles.text} variant="labelLarge">What are your hobbies?</Text>
                <TextInput
                    multiline
                    placeholder="e.g., reading, sports"
                    placeholderTextColor={theme.colors.backdrop}
                    textColor='#000'
                    style={styles.input}
                    value={hobbies}
                    onChangeText={(text) => setHobbies(text)}
                    mode="flat" />
                <Text style={styles.text} variant="labelLarge">What are your goals?</Text>
                <TextInput
                    multiline
                    placeholder="e.g., lose weight, run a marathon"
                    textColor='#000'
                    placeholderTextColor={theme.colors.backdrop}
                    style={styles.input}
                    value={goals}
                    onChangeText={(text) => setGoals(text)}
                    mode="flat" />
                <Text style={styles.text} variant="labelLarge">What is your occupation?</Text>
                <TextInput
                    multiline
                    placeholder="e.g., software engineer, student"
                    textColor='#000'
                    placeholderTextColor={theme.colors.backdrop}
                    style={styles.input}
                    value={occupation}
                    onChangeText={(text) => setOccupation(text)}
                    mode="flat" />
                <Text style={styles.text} variant="labelLarge">How physically active are you?</Text>
                <TextInput
                    multiline
                    placeholder="e.g., sedentary, active, very active"
                    textColor='#000'
                    placeholderTextColor={theme.colors.backdrop}
                    style={styles.input}
                    value={physicalActivity}
                    onChangeText={(text) => setPhysicalActivity(text)}
                    mode="flat" />
                <Text style={styles.text} variant="labelLarge">Anything else you want to share?</Text>
                <TextInput
                    multiline
                    placeholder="e.g., favorite foods, stress triggers"
                    textColor='#000'
                    placeholderTextColor={theme.colors.backdrop}
                    style={styles.input}
                    value={additionalInfo}
                    onChangeText={(text) => { setAdditionalInfo(text) }}
                    mode="flat" />
                <Button mode="contained" onPress={handleSave}>
                    Update
                </Button>
            </View>
        </KeyboardAwareScrollView>
    );
}
