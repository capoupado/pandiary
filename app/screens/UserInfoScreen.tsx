import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, TextInput, useTheme, Card, IconButton } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { saveUserInfo, getUserInfo } from '../db/database';

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
    const [isEditing, setIsEditing] = useState(false);
    const [hasData, setHasData] = useState(false);
    const theme = useTheme();

    const styles = StyleSheet.create({
        warningMessage: {
            color: theme.colors.error,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 16,
        },
        scrollContainer: {
            flexGrow: 1,
            paddingBottom: 64,
            backgroundColor: theme.colors.background,
        },
        container: { flex: 1, padding: 16, gap: 16 },
        input: {
            textAlignVertical: 'top',
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outline,
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginTop: 8,
            marginBottom: 16,
            fontSize: 16,
        },
        text: {
            backgroundColor: theme.colors.surface,
            padding: 8,
            borderRadius: 8,
            color: theme.colors.onSurface,
        },
        card: {
            marginVertical: 8,
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.primary,
            borderWidth: 1,
            borderRadius: 12,
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        infoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 4,
        },
        label: {
            fontWeight: 'bold',
            color: theme.colors.onSurface,
        },
        value: {
            color: theme.colors.onSurface,
            flex: 1,
            textAlign: 'right',
        },
        emptyState: {
            alignItems: 'center',
            marginTop: 40,
        },
        button: {
            backgroundColor: theme.colors.primary,
            color: theme.colors.onSurface,
            borderColor: theme.colors.primary,
            borderWidth: 1,
            width: '100%',
        },
        // New styles for better editing mode
        formSection: {
            backgroundColor: theme.colors.surfaceVariant,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
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
            marginBottom: 4,
        },
        formInput: {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outline,
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginTop: 8,
            marginBottom: 16,
            fontSize: 16,
            color: theme.colors.onSurface,
        },
        multilineInput: {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outline,
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginTop: 8,
            marginBottom: 16,
            fontSize: 16,
            color: theme.colors.onSurface,
            minHeight: 80,
            textAlignVertical: 'top',
        },
        unitContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
        },
        unitInput: {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outline,
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            fontSize: 16,
            color: theme.colors.onSurface,
            flex: 1,
        },
        unitText: {
            marginLeft: 12,
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
            fontWeight: '500',
        },
        buttonRow: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 24,
        },
        actionButton: {
            flex: 1,
            paddingVertical: 8,
        },
    });

    const loadUserInfo = async () => {
        try {
            const userInfo = await getUserInfo();
            if (userInfo) {
                setUserId(userInfo.id || 1);
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
                setHasData(true);
            } else {
                setHasData(false);
            }
        } catch (error) {
            console.error('Error loading user info:', error);
            setHasData(false);
        }
    };


    useFocusEffect(
        useCallback(() => {
            // Load user info when the screen is focused
            loadUserInfo();
            setIsEditing(false);
        }, [])
    );

    useEffect(() => {
        // Load existing user info if available
        loadUserInfo();
    }, []);

    const handleSave = async () => {
        try {
            let userInfo = {
                id: userId || 1,
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
                additional_info: String(additionalInfo),
            };

            await saveUserInfo(userInfo, () => {
                Alert.alert('User Info Saved', 'Your information has been saved successfully.');
                setIsEditing(false);
                setHasData(true);
            });
        } catch (error) {
            console.error('Error saving user info:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadUserInfo(); // Reset to original values
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const renderForm = () => (
        <View>
            {/* Personal Information Section */}
            <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                
                <Text style={styles.formLabel}>Your name (or what you like being called)</Text>
                <TextInput
                    placeholder="John Doe"
                    placeholderTextColor={theme.colors.backdrop}
                    style={styles.formInput}
                    textColor={theme.colors.onSurface}
                    value={name}
                    onChangeText={(text) => setName(text)}
                    mode="flat" />

                <Text style={styles.formLabel}>How old are you?</Text>
                <TextInput
                    keyboardType="numeric"
                    placeholder="25"
                    textColor={theme.colors.onSurface}
                    placeholderTextColor={theme.colors.backdrop}
                    style={styles.formInput}
                    value={age}
                    onChangeText={(text) => setAge(text)}
                    mode="flat" />
            </View>

            {/* Physical Information Section */}
            <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Physical Information</Text>
                
                <Text style={styles.formLabel}>What is your weight?</Text>
                <View style={styles.unitContainer}>
                    <TextInput
                        keyboardType="numeric"
                        placeholder="70"
                        textColor={theme.colors.onSurface}
                        placeholderTextColor={theme.colors.backdrop}
                        style={styles.unitInput}
                        value={weight}
                        onChangeText={(text) => setWeight(text.replace(/[^0-9.]/g, ''))}
                        mode="flat"
                    />
                    <Text style={styles.unitText}>kg</Text>
                </View>

                <Text style={styles.formLabel}>What is your height?</Text>
                <View style={styles.unitContainer}>
                    <TextInput
                        keyboardType="numeric"
                        placeholder="175"
                        textColor={theme.colors.onSurface}
                        placeholderTextColor={theme.colors.backdrop}
                        style={styles.unitInput}
                        value={height}
                        onChangeText={(text) => setHeight(text.replace(/[^0-9.]/g, ''))}
                        mode="flat"
                    />
                    <Text style={styles.unitText}>cm</Text>
                </View>
            </View>

            {/* Medical Information Section */}
            <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Medical Information</Text>
                
                <Text style={styles.formLabel}>Do you have any medical conditions?</Text>
                <TextInput
                    multiline
                    placeholder="e.g., diabetes, asthma"
                    placeholderTextColor={theme.colors.backdrop}
                    textColor={theme.colors.onSurface}
                    style={styles.multilineInput}
                    value={conditions}
                    onChangeText={(text) => setConditions(text)}
                    mode="flat" />

                <Text style={styles.formLabel}>Are you taking any medications?</Text>
                <TextInput
                    multiline
                    placeholder="e.g., insulin, inhaler"
                    placeholderTextColor={theme.colors.backdrop}
                    textColor={theme.colors.onSurface}
                    style={styles.multilineInput}
                    value={medications}
                    onChangeText={(text) => setMedications(text)}
                    mode="flat" />
            </View>

            {/* Lifestyle Information Section */}
            <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Lifestyle & Interests</Text>
                
                <Text style={styles.formLabel}>What are your hobbies?</Text>
                <TextInput
                    multiline
                    placeholder="e.g., reading, sports"
                    placeholderTextColor={theme.colors.backdrop}
                    textColor={theme.colors.onSurface}
                    style={styles.multilineInput}
                    value={hobbies}
                    onChangeText={(text) => setHobbies(text)}
                    mode="flat" />

                <Text style={styles.formLabel}>What are your goals?</Text>
                <TextInput
                    multiline
                    placeholder="e.g., lose weight, run a marathon"
                    textColor={theme.colors.onSurface}
                    placeholderTextColor={theme.colors.backdrop}
                    style={styles.multilineInput}
                    value={goals}
                    onChangeText={(text) => setGoals(text)}
                    mode="flat" />

                <Text style={styles.formLabel}>What is your occupation?</Text>
                <TextInput
                    multiline
                    placeholder="e.g., software engineer, student"
                    placeholderTextColor={theme.colors.backdrop}
                    textColor={theme.colors.onSurface}
                    style={styles.multilineInput}
                    value={occupation}
                    onChangeText={(text) => setOccupation(text)}
                    mode="flat" />

                <Text style={styles.formLabel}>How physically active are you?</Text>
                <TextInput
                    multiline
                    placeholder="e.g., sedentary, active, very active"
                    placeholderTextColor={theme.colors.backdrop}
                    textColor={theme.colors.onSurface}
                    style={styles.multilineInput}
                    value={physicalActivity}
                    onChangeText={(text) => setPhysicalActivity(text)}
                    mode="flat" />
            </View>

            {/* Additional Information Section */}
            <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Additional Information</Text>
                
                <Text style={styles.formLabel}>Anything else you want to share?</Text>
                <TextInput
                    multiline
                    placeholder="e.g., favorite foods, stress triggers"
                    placeholderTextColor={theme.colors.backdrop}
                    textColor={theme.colors.onSurface}
                    style={styles.multilineInput}
                    value={additionalInfo}
                    onChangeText={(text) => { setAdditionalInfo(text) }}
                    mode="flat" />
            </View>
        </View>
    );

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
            enableOnAndroid={true} // Ensures it works on Android
            extraScrollHeight={200} // Adjusts scroll height when the keyboard is open
        >
            <View style={styles.container}>
                <Text style={styles.warningMessage} variant="bodyMedium">
                    ⚠️ This will be used to personalize your experience. It is not required, but it will help the app to better understand you.
                </Text>
                {!hasData && !isEditing ? (
                    // Empty state - show form to create new user info
                    <View>

                        {renderForm()}
                        <Button mode="contained" onPress={handleSave} style={{ marginTop: 16 }}>
                            Create Profile
                        </Button>
                    </View>
                ) : isEditing ? (
                    // Edit mode - show form with current values
                    <View>
                        {renderForm()}
                        <View style={styles.buttonRow}>
                            <Button mode="outlined" onPress={handleCancel} style={styles.actionButton}>
                                Cancel
                            </Button>
                            <Button mode="contained" onPress={handleSave} style={styles.actionButton}>
                                Save Changes
                            </Button>
                        </View>
                    </View>
                ) : (
                    // Display mode - show card with user info
                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Name:</Text>
                                <Text style={styles.value}>{name || 'Not specified'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Age:</Text>
                                <Text style={styles.value}>{age || 'Not specified'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Weight:</Text>
                                <Text style={styles.value}>{weight ? `${weight} kg` : 'Not specified'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Height:</Text>
                                <Text style={styles.value}>{height ? `${height} cm` : 'Not specified'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Medical Conditions:</Text>
                                <Text style={styles.value}>{conditions || 'None'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Medications:</Text>
                                <Text style={styles.value}>{medications || 'None'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Hobbies:</Text>
                                <Text style={styles.value}>{hobbies || 'Not specified'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Goals:</Text>
                                <Text style={styles.value}>{goals || 'Not specified'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Occupation:</Text>
                                <Text style={styles.value}>{occupation || 'Not specified'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Physical Activity:</Text>
                                <Text style={styles.value}>{physicalActivity || 'Not specified'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Additional Info:</Text>
                                <Text style={styles.value}>{additionalInfo || 'None'}</Text>
                            </View>
                        </Card.Content>
                    </Card>
                )}
                <View style={styles.headerRow}>
                    {hasData && !isEditing && (
                        <Button style={styles.button} mode="contained" onPress={handleEdit}>
                            Edit Profile
                        </Button>
                    )}
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}
