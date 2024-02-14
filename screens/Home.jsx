import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';

export default function Home({ navigation }) {

    const goToTarot = () => {
        navigation.navigate('TarotInitialization')
    }

    const goToBelote = () => {
        navigation.navigate('BeloteInitialization')
    }

    return (
        <View >
            <ImageBackground
                source={require('../assets/joker.jpg')}
                resizeMode="cover"
                style={{
                    backgroundColor: '#fc0',
                    width: '100%', // applied to Image
                    height: '100%',
                    // justifyContent: 'center',
                    alignItems: 'center',

                }}>
                <View style={styles.choix}>
                    <TouchableOpacity style={styles.jeu} onPress={() => goToBelote()}>
                        <Text style={styles.texte}>Belote</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => goToTarot()}>
                        <Text style={styles.texte}>Tarot</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    choix: {
        marginTop: '80%',
        // backgroundColor: 'blue',
        flexDirection: 'row',
        height: '10%',
        width: '55%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    jeu: {
        // height: '100%',

    },
    texte: {
        color: 'white',
        fontSize: 25
    }
});
