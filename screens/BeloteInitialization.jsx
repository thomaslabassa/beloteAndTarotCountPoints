import { StyleSheet, Text, View } from 'react-native';

export default function BeloteInitialization() {
    return (
        <View style={styles.container}>
            <Text>belote</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
