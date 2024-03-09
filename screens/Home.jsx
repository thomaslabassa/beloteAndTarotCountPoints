import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';

export default function Home({ navigation }) {

    const goToTarot = () => {
        navigation.navigate('TarotInitialization')
    }

    const goToBelote = () => {
        navigation.navigate('BeloteInitialization')
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={[styles.side, styles.belote]} onPress={goToBelote}>
                <Text style={styles.text}>Belote</Text>
            </TouchableOpacity>
            <View style={styles.separator}></View>
            <TouchableOpacity style={[styles.side, styles.tarot]} onPress={goToTarot}>
                <Text style={styles.text}>Tarot</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',

    },
    side: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    belote: {
        backgroundColor: '#65ddb7',
    },
    tarot: {
        backgroundColor: '#4A919E',
    },
    text: {
        color: 'white',
        fontSize: 25,
    },
    separator: {
        width: 1,
        backgroundColor: 'black',
    },
});
