import React from 'react';
import { View } from 'react-native';

interface InfoCardRowProps {
    children: React.ReactNode;
    marginBottom?: number;
}

export default function InfoCardRow({ children, marginBottom = 4 }: InfoCardRowProps) {
    return (
        <View
            style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: '100%',
                marginBottom,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {children}
        </View>
    );
}
