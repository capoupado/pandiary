import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

type MessageDialogProps = {
    title: string;
    children: React.ReactNode;
    visible: boolean;
    onDismiss: () => void;
};

const MessageDialog: React.FC<MessageDialogProps> = ({ title, children, visible, onDismiss }) => {
    return (
        <View>
            <Portal>
                <Dialog visible={visible} onDismiss={onDismiss} dismissable={false}>
                    <Dialog.Title>{title}</Dialog.Title>
                    <Dialog.Content>
                        {children}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={onDismiss}>OK</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

export default MessageDialog;
