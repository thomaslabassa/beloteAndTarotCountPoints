import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { create, deleteGame } from '../reducers/belote';



export default function BeloteInitialization(props) {
    const dispatch = useDispatch();

    const gameStore = useSelector((state) => state.belote.value);

    const [createNewgame, setCreateNewgame] = useState(false)
    const [loadGame, setLoadGame] = useState(false)

    const goToBeloteGame = () => {
        dispatch(create(['Nous', 'Eux']))
        let position = gameStore.length ? Number(gameStore.games.length) : 0
        props.navigation.navigate("BeloteGame", { index: position })
    }

    return (
        <View style={styles.container}>
            {(!createNewgame && !loadGame) && <View style={{ height: '100%', width: '100%', alignItems: 'center', marginTop: '30%' }}>
                <TouchableOpacity style={[styles.choix, { backgroundColor: '#BED3C3' }]} onPress={() => goToBeloteGame()}>
                    <Text style={{ color: 'black', fontSize: 15 }}>Créer une nouvelle partie</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.choix, { backgroundColor: '#CE6A6B' }]} onPress={() => setLoadGame(true)}>
                    <Text style={{ color: 'white', fontSize: 15 }}>Charger une partie existante</Text>
                </TouchableOpacity>

            </View>}

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
