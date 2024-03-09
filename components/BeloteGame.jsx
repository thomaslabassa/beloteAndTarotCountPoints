import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useEffect } from 'react';
import { create, deleteGame } from '../reducers/tarot';
import { useSelector, useDispatch } from 'react-redux';



export default function BeloteGame(props) {
    const dispatch = useDispatch();

    const indexGame = props.route.params.index
    const gameStore = useSelector((state) => state.belote.value);


    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <Text>{gameStore.games[indexGame].firstTeam.name}</Text>
                <Text>{gameStore.games[indexGame].secondTeam.name}</Text>
            </View>
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
