import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Card, Avatar, useTheme } from 'react-native-paper';

interface InfoCardProps {
    title: string;
    subtitle?: string;
    titleColor?: string;
    subtitleColor?: string;
    icon: string;
    iconColor?: string;
    backgroundColor?: string;
    borderColor?: string;
    style?: ViewStyle;
}

export default function InfoCard({ 
    title, 
    subtitle,
    titleColor,
    subtitleColor,
    icon, 
    iconColor,
    backgroundColor,
    borderColor, 
    style 
}: InfoCardProps) {
    const theme = useTheme();

    return (
        <View
            style={[
                {
                    flex: 1,
                    padding: 4,
                    marginHorizontal: 2,
                },
                style
            ]}
        >
            <Card.Title
                title={title}
                subtitle={subtitle}
                titleStyle={{ 
                    color: titleColor || theme.colors.tertiary, 
                    fontWeight: 'bold',
                    fontSize: 16,
                }}
                subtitleStyle={{ 
                    color: subtitleColor || theme.colors.tertiary, 
                    fontWeight: '600',
                    fontSize: 14,
                    opacity: 0.8
                }}
                left={(props) => (
                    <Avatar.Icon 
                        {...props} 
                        icon={icon}
                        size={42}
                        style={{ 
                            backgroundColor: iconColor || theme.colors.tertiary,
                            marginRight: 8
                        }}
                        color={theme.colors.onTertiary}
                    />
                )}
                style={{ 
                    borderColor: borderColor || theme.colors.primary, 
                    borderWidth: 1.5, 
                    borderRadius: 16,
                    backgroundColor: backgroundColor || theme.colors.primary,
                    elevation: 3,
                    shadowColor: theme.colors.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                }}
            />
        </View>
    );
}
