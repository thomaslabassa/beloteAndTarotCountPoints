import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground, Image, ScrollView, Modal } from 'react-native';
import { create, deleteGame } from '../reducers/tarot';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';


export default function TarotInitialization(props) {

    const dispatch = useDispatch();

    const [createNewgame, setCreateNewgame] = useState(false)
    const [indexToDelete, setIndexToDelete] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const [load, setLoad] = useState(false);
    const [selectedGameIndex, setSelectedGameIndex] = useState(null);
    const [loadGame, setLoadGame] = useState(false)
    const [fourPlayer, setFourPlayer] = useState(true)
    const [fivePlayer, setFivePlayer] = useState(false)
    const [nameField, setNameField] = useState(false)
    const [name, setName] = useState({
        first: '',
        second: '',
        third: '',
        forth: '',
        fifth: '',
    })

    const gameStore = useSelector((state) => state.tarot.value);


    const savedGames = gameStore.games.map((data, i) => (
        <TouchableOpacity
            key={i}
            onPress={() => loadOldTarotGame([gameStore.games[i].firstPlayer.name, gameStore.games[i].secondPlayer.name, gameStore.games[i].thirdPlayer.name,
            gameStore.games[i].forthPlayer.name, gameStore.games[i].fifthPlayer.name], i)}
            style={{ backgroundColor: 'white', height: '5%', marginTop: '5%', justifyContent: 'center' }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: '5%', paddingLeft: '5%' }}>
                <Text>{i + 1}</Text>
                <Text style={{ color: 'black' }}>{gameStore.games[i].firstPlayer.name}</Text>
                <Text style={{ color: 'black' }}>{gameStore.games[i].secondPlayer.name}</Text>
                <Text style={{ color: 'black' }}>{gameStore.games[i].thirdPlayer.name}</Text>
                <Text style={{ color: 'black' }}>{gameStore.games[i].forthPlayer.name}</Text>
                <Text style={{ color: 'black' }}>{gameStore.games[i].fifthPlayer.name}</Text>
                <TouchableOpacity onPress={() => { setModalVisible(true), setIndexToDelete(i) }}>
                    <FontAwesome name="trash-o" size={30} color="black" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    ));


    const deleteTarotGame = (index) => {
        dispatch(deleteGame(index))
        setModalVisible(false)
    }


    const loadOldTarotGame = (giveNames, index) => {
        if (giveNames[4] === null || giveNames[4] === '') {
            setFourPlayer(true)
        } else {
            setFourPlayer(false)
        }
        setSelectedGameIndex(index);
        setName({
            first: giveNames[0],
            second: giveNames[1],
            third: giveNames[2],
            forth: giveNames[3],
            fifth: giveNames[4],
        })
        setLoad(true);
    }

    useEffect(() => {
        if (load && name.first) {
            props.navigation.navigate('TarotGame', {
                data: name,
                isFourPlayer: fourPlayer,
                index: selectedGameIndex,
                points: '',
            });
        }
    }, [name, load]);

    const goToTarotGame = () => {
        if ((fourPlayer && name.first && name.second && name.third && name.forth) ||
            (fivePlayer && name.first && name.second && name.third && name.forth && name.fifth)) {
            setNameField(false)
            let allNames = [name.first, name.second, name.third, name.forth, name.fifth]
            dispatch(create(allNames))
            let position = Number(gameStore.games.length)
            props.navigation.navigate('TarotGame', { data: name, isFourPlayer: fourPlayer, index: position });
        } else {
            setNameField(true)
        }
    }

    return (

        <View style={styles.container}>
            <Image source={require('../assets/oudler.png')} style={{ width: '100%', height: '29%' }} />
            {(!createNewgame && !loadGame) && <View style={{ height: '100%', width: '100%', alignItems: 'center', marginTop: '30%' }}>
                <TouchableOpacity style={styles.choix} onPress={() => setCreateNewgame(true)}>
                    <Text style={{ color: 'black' }}>Créer une nouvelle partie</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.choix} onPress={() => setLoadGame(true)}>
                    <Text style={{ color: 'black' }}>Charger une partie existante</Text>
                </TouchableOpacity>
            </View>}
            {createNewgame && (
                <View style={styles.createGame}>
                    <Text style={{ fontSize: 20, marginTop: '5%' }} >Combien de joueurs</Text>
                    <View style={styles.numberPlayer}>
                        <TouchableOpacity onPress={() => { setFourPlayer(true); setFivePlayer(false); setName({ ...name, fifth: null }) }}
                            style={fourPlayer && { backgroundColor: 'green' }}>
                            <Text>4 Joueurs</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setFivePlayer(true); setFourPlayer(false) }}
                            style={fivePlayer && { backgroundColor: 'green' }}>
                            <Text>5 Joueurs</Text>
                        </TouchableOpacity>
                    </View>
                    < View style={{ width: '100%', height: '45%', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TextInput style={styles.input} onChangeText={(value) => setName({ ...name, first: value })} value={name.first} placeholder=" Joueur 1" maxLength={6} />
                        <TextInput style={styles.input} onChangeText={(value) => setName({ ...name, second: value })} value={name.second} placeholder=" Joueur 2" maxLength={6} />
                        <TextInput style={styles.input} onChangeText={(value) => setName({ ...name, third: value })} value={name.third} placeholder=" Joueur 3" maxLength={6} />
                        <TextInput style={styles.input} onChangeText={(value) => setName({ ...name, forth: value })} value={name.forth} placeholder=" Joueur 4" maxLength={6} />
                        {fivePlayer && <TextInput style={styles.input} onChangeText={(value) => setName({ ...name, fifth: value })} value={name.fifth} placeholder=" Joueur 5" maxLength={6} />}
                    </View>

                    <TouchableOpacity onPress={() => goToTarotGame()} >
                        <Text>Valider</Text>
                    </TouchableOpacity>
                    {nameField && <Text style={{ color: 'red' }}> Veuillez donner un nom à chaque joueur</Text>}
                    <TouchableOpacity onPress={() => setCreateNewgame(false)}>
                        <Text>Annuler</Text>
                    </TouchableOpacity>

                </View>
            )
            }
            {loadGame && (
                <View style={{ height: '100%', width: '100%', paddingLeft: '5%', paddingRight: '5%' }}>
                    <Text style={{ marginLeft: '22%', fontSize: 20, marginTop: '5%' }}>Selectionner la partie</Text>
                    {savedGames}
                    <TouchableOpacity style={{ alignItems: 'center', marginTop: '5%' }} onPress={() => setLoadGame(false)}>
                        <Text style={{ fontSize: 20 }}>Annuler</Text>
                    </TouchableOpacity>

                </View>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={{ backgroundColor: 'white', height: '20%', justifyContent: 'space-between', padding: 10 }}>
                    <Text>Etes Vous sur de vouloir supprimer vette partie ?</Text>
                    <TouchableOpacity onPress={() => deleteTarotGame(indexToDelete)}>
                        <Text>Oui</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text>Non</Text>
                    </TouchableOpacity>


                </View>


            </Modal >

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5dc',
        alignItems: 'center',
        paddingTop: '10%'

    },
    numberPlayer: {
        flexDirection: 'row',
        // backgroundColor: 'blue',
        height: '20%',
        width: '60%',
        alignItems: 'center',
        justifyContent: 'space-between',


    },
    createGame: {
        width: '80%',
        height: '65%',
        alignItems: 'center',
        // backgroundColor: 'red',
        justifyContent: 'space-between'

    },
    choix: {
        borderWidth: 1,
        backgroundColor: 'white',
        height: '10%',
        width: '65%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10%',
        borderRadius: 10,

    },
    input: {
        color: 'black',
        borderBottomWidth: 1,
        height: '12%',
        width: '100%'
    },
});
