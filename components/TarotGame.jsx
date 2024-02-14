import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import Slider from '@react-native-community/slider';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addGame } from '../reducers/tarot';

export default function TarotGame(props, { navigation }) {


    const dispatch = useDispatch();

    // console.log(props.route.params)
    const [isFourPlayer, setIsFourPlayer] = useState(props.route.params.isFourPlayer);
    const [modalVisible, setModalVisible] = useState(false); // faire apparaitre modal décompte points
    const [selectedPlayer, setSelectedPlayer] = useState(null); // joueur qui prends
    const [calledPlayer, setCalledPlayer] = useState(null); // joueur appelé si 5 joueurs
    const [chosenContract, setChosenContract] = useState(null); // contrat du preneur
    const [oudlerPlayer, setOudlerPlayer] = useState([]); // nombre de bout du preneur
    const [contractValue, setContractValue] = useState(null); // valeur du slider
    const [isGameWon, setIsGameWon] = useState(null) // nombre de points necessaires pour gagner la partie 
    const [isAlone, setIsAlone] = useState(false)//nom d'un joueur si il est seul dans une aprtir à 5

    const [name, setName] = useState({
        first: props.route.params.data.first,
        second: props.route.params.data.second,
        third: props.route.params.data.third,
        forth: props.route.params.data.forth,
        fifth: props.route.params.data.fifth
    })


    const contrat = ['Pouce', 'Garde', 'Garde Contre', 'Garde Sans']
    const oudler = ['Aucun', '21', '1', 'Excuse']

    const gameStore = useSelector((state) => state.tarot.value);
    const indexGame = props.route.params.index //index de la partie dans le tableau games du reducer
    console.log(gameStore.games[indexGame])

    useEffect(() => {
        const calculContrat = () => {
            if (oudlerPlayer.length === 0) {
                setIsGameWon(56)
            } else if (oudlerPlayer.length === 1) {
                setIsGameWon(51)
            } else if (oudlerPlayer.length === 2) {
                setIsGameWon(41)
            } else if (oudlerPlayer.length === 3) {
                setIsGameWon(36)
            }
        }
        calculContrat()
    }, [oudlerPlayer]);

    useEffect(() => {
        const Alone = () => {
            if (selectedPlayer === calledPlayer) {
                setIsAlone(true)
            } else {
                setIsAlone(false)
            }
        }
        Alone()
    }, [selectedPlayer, calledPlayer]);



    const handlePlayerClick = (player) => {
        setSelectedPlayer(player === selectedPlayer ? null : player);
    };
    const handleCalledPlayer = (player) => {
        setCalledPlayer(player === calledPlayer ? null : player);
    };
    const whichContract = (contract) => {
        setChosenContract(contract === chosenContract ? null : contract);
    };

    const howManyOudler = (oudlers) => {
        if (oudlers === 'Aucun') {
            setOudlerPlayer([]);
        } else {
            const oudlerIndex = oudlerPlayer.indexOf(oudlers);
            if (oudlerIndex === -1) {
                setOudlerPlayer([...oudlerPlayer, oudlers]);
            } else {
                const oudlersMisAJour = oudlerPlayer.filter((oudler) => oudler !== oudlers);
                setOudlerPlayer(oudlersMisAJour);
            }
        }
    };



    const player = Object.keys(name).map((data, i) => (
        <TouchableOpacity
            key={i}
            onPress={() => handlePlayerClick(name[data])}
            style={[
                styles.playerButton,
                { backgroundColor: selectedPlayer === name[data] ? 'green' : 'transparent' },
            ]}
        >
            <Text>{name[data]}</Text>
        </TouchableOpacity>
    ));
    const howManyPlayers = isFourPlayer ? player.slice(0, 4) : player

    const oudlerStyles = oudler.map((oudler) => ({
        backgroundColor: oudlerPlayer.length === 0 && oudler === 'Aucun' ? 'green' :
            oudlerPlayer.includes(oudler) ? 'green' : 'transparent',
        width: '20%', alignItems: 'center', height: '120%', borderWidth: 1
    }));

    let earnPoints = 0
    const pointsCalculation = () => {

        if (chosenContract === 'Pouce') {
            if (contractValue - isGameWon >= 0) {
                earnPoints = (contractValue - isGameWon + 25)
            } else {
                earnPoints = (contractValue - isGameWon - 25)
            }
        }
        if (chosenContract === 'Garde') {
            if (contractValue - isGameWon >= 0) {
                earnPoints = (contractValue - isGameWon + 25) * 2
            } else {
                earnPoints = (contractValue - isGameWon - 25) * 2
            }
        }
        if (chosenContract === 'Garde Contre') {
            if (contractValue - isGameWon >= 0) {
                earnPoints = (contractValue - isGameWon + 25) * 4
            } else {
                earnPoints = (contractValue - isGameWon - 25) * 4
            }
        }
        if (chosenContract === 'Garde Sans') {
            if (contractValue - isGameWon >= 0) {
                earnPoints = (contractValue - isGameWon + 25) * 6
            } else {
                earnPoints = (contractValue - isGameWon - 25) * 6
            }
        }
        return earnPoints
    }
    // console.log(isGameWon)
    // console.log('points', pointsCalculation())
    console.log(isFourPlayer)
    const gameValidation = () => {
        if (selectedPlayer === null || chosenContract === null) {
            // message erreur
        } else {
            if (isFourPlayer) {
                dispatch(addGame({
                    index: indexGame,
                    firstPlayer: {
                        points: selectedPlayer === name.first ? pointsCalculation() * 3 : -pointsCalculation(),
                        isPreneur: selectedPlayer === name.first ? chosenContract : false
                    },
                    secondPlayer: {
                        points: selectedPlayer === name.second ? pointsCalculation() * 3 : -pointsCalculation(),
                        isPreneur: selectedPlayer === name.second ? chosenContract : false
                    },
                    thirdPlayer: {
                        points: selectedPlayer === name.third ? pointsCalculation() * 3 : -pointsCalculation(),
                        isPreneur: selectedPlayer === name.third ? chosenContract : false
                    },
                    forthPlayer: {
                        points: selectedPlayer === name.forth ? pointsCalculation() * 3 : -pointsCalculation(),
                        isPreneur: selectedPlayer === name.forth ? chosenContract : false
                    },
                    fifthPlayer: {
                        points: 0,
                        isPreneur: 'false'
                    }
                }))
            } else {
                // const PointEarnFivePlayer = (player) => {
                //     const points = isAlone && selectedPlayer === player ? pointsCalculation() * 4 : selectedPlayer === player ? pointsCalculation() * 3 : calledPlayer === player ? pointsCalculation() : -pointsCalculation()
                //     return points
                // }
                dispatch(addGame({
                    index: indexGame,
                    firstPlayer: {
                        points: isAlone && selectedPlayer === name.first ? pointsCalculation() * 4 : selectedPlayer === name.first ? pointsCalculation() * 3 : calledPlayer === name.first ? pointsCalculation() : -pointsCalculation(),
                        isPreneur: selectedPlayer === name.first ? chosenContract : false
                    },
                    secondPlayer: {
                        points: isAlone && selectedPlayer === name.second ? pointsCalculation() * 4 : selectedPlayer === name.second ? pointsCalculation() * 3 : calledPlayer === name.second ? pointsCalculation() : -pointsCalculation(),
                        isPreneur: selectedPlayer === name.second ? chosenContract : false
                    },
                    thirdPlayer: {
                        points: isAlone && selectedPlayer === name.third ? pointsCalculation() * 4 : selectedPlayer === name.third ? pointsCalculation() * 3 : calledPlayer === name.third ? pointsCalculation() : -pointsCalculation(),
                        isPreneur: selectedPlayer === name.third ? chosenContract : false
                    },
                    forthPlayer: {
                        points: isAlone && selectedPlayer === name.forth ? pointsCalculation() * 4 : selectedPlayer === name.forth ? pointsCalculation() * 3 : calledPlayer === name.forth ? pointsCalculation() : -pointsCalculation(),
                        isPreneur: selectedPlayer === name.forth ? chosenContract : false
                    },
                    fifthPlayer: {
                        points: isAlone && selectedPlayer === name.fifth ? pointsCalculation() * 4 : selectedPlayer === name.fifth ? pointsCalculation() * 3 : calledPlayer === name.fifth ? pointsCalculation() : -pointsCalculation(),
                        isPreneur: selectedPlayer === name.fifth ? chosenContract : false
                    },
                }))
            }

            setCalledPlayer(null)
            setChosenContract(null)
            setOudlerPlayer([])
            setSelectedPlayer(null)
            setContractValue(0)
            setModalVisible(false)
        }
    }

    useEffect(() => {
        setCalledPlayer(null)
        setChosenContract(null)
        setOudlerPlayer([])
        setSelectedPlayer(null)
        setContractValue(0)
    }, [modalVisible]);

    const totalPoints = (arr) => {
        let sum = 0;
        arr.forEach((el) => sum += el);
        return sum
    }

    const GameStoreToMap = (whichPlayer) => {
        return (whichPlayer.game.map((data, i) => (
            <View key={i} style={{
                backgroundColor: whichPlayer.game[i] > 0 ? 'green' : 'red', height: 25, width: 45,
                marginBottom: 10, alignItems: 'center', justifyContent: 'center'
            }}>
                <Text > {whichPlayer.game[i]}</Text>
            </View>
        ))
        )
    }

    return (
        <View style={styles.container}>

            <View style={styles.name}>
                <View><Text style={{ color: 'white' }}>ici</Text></View>
                <View >
                    <Text>{props.route.params.data.first} </Text>
                </View>
                <View>
                    <Text>{props.route.params.data.second} </Text>
                </View>
                <View>
                    <Text>{props.route.params.data.third} </Text>
                </View>
                <View>
                    <Text>{props.route.params.data.forth} </Text>
                </View>
                {props.route.params.data.fifth && (
                    <View>
                        <Text>{props.route.params.data.fifth} </Text>
                    </View>)}
            </View>
            <View style={styles.totaux}>
                <View><Text style={{ color: 'white' }}>ici</Text></View>
                <View style={{ backgroundColor: totalPoints(gameStore.games[indexGame].firstPlayer.game) > 0 ? 'green' : 'red', ...styles.totalSize }}>
                    <Text style={styles.pointsEveryGame}>{totalPoints(gameStore.games[indexGame].firstPlayer.game)} </Text>
                </View>

                <View style={{ backgroundColor: totalPoints(gameStore.games[indexGame].secondPlayer.game) > 0 ? 'green' : 'red', ...styles.totalSize }}>
                    <Text style={styles.pointsEveryGame}>{totalPoints(gameStore.games[indexGame].secondPlayer.game)}</Text>
                </View>
                <View style={{ backgroundColor: totalPoints(gameStore.games[indexGame].thirdPlayer.game) > 0 ? 'green' : 'red', ...styles.totalSize }}>
                    <Text style={styles.pointsEveryGame}>{totalPoints(gameStore.games[indexGame].thirdPlayer.game)} </Text>
                </View>
                <View style={{
                    backgroundColor: totalPoints(gameStore.games[indexGame].forthPlayer.game) > 0 ? 'green' : 'red', ...styles.totalSize
                }}>
                    <Text style={styles.pointsEveryGame}>{totalPoints(gameStore.games[indexGame].forthPlayer.game)} </Text>
                </View>
                {props.route.params.data.fifth && (
                    <View style={{
                        backgroundColor: totalPoints(gameStore.games[indexGame].fifthPlayer.game) > 0 ? 'green' : 'red', ...styles.totalSize
                    }}>
                        <Text style={styles.pointsEveryGame}>{totalPoints(gameStore.games[indexGame].fifthPlayer.game)} </Text>
                    </View>)}
            </View>
            <View style={styles.pointsmap}>
                <View>
                    {gameStore.games[indexGame].firstPlayer.game.map((data, i) => (
                        <View key={i} style={{ marginBottom: 10, height: 25, justifyContent: 'center' }}>
                            <Text > {i + 1}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.singlePointMap}>
                    {GameStoreToMap(gameStore.games[indexGame].firstPlayer)}
                </View>
                <View style={styles.singlePointMap}>
                    {GameStoreToMap(gameStore.games[indexGame].secondPlayer)}
                </View>
                <View style={styles.singlePointMap}>
                    {GameStoreToMap(gameStore.games[indexGame].thirdPlayer)}
                </View>
                <View style={styles.singlePointMap}>
                    {GameStoreToMap(gameStore.games[indexGame].forthPlayer)}
                </View>
                {props.route.params.data.fifth && (
                    <View style={styles.singlePointMap}>
                        {GameStoreToMap(gameStore.games[indexGame].fifthPlayer)}
                    </View>)}
            </View>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={{ width: '100%', height: '5%', backgroundColor: 'green', alignItems: 'center', justifyContent: 'center' }}>
                <Text>Ajouter une  partie</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={{ backgroundColor: 'white', height: '100%', justifyContent: 'space-between', padding: 20 }}>
                    <View >
                        <Text style={{ textAlign: 'center', fontSize: 20 }}>Qui prends ?</Text>
                        <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginTop: '8%' }}>
                            {howManyPlayers}
                        </View>
                    </View>
                    <View>
                        <Text style={{ textAlign: 'center', fontSize: 20 }}>Quel contrat ?</Text>
                        <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginTop: '8%' }}>
                            {contrat.map((data, i) => (
                                <TouchableOpacity key={i} style={[styles.contratButton, { backgroundColor: chosenContract === contrat[i] ? 'green' : 'transparent' }]} onPress={() => whichContract(contrat[i])}>
                                    <Text > {contrat[i]}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <View>
                        <Text style={{ textAlign: 'center', fontSize: 20 }}>Combien de bouts</Text>
                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: '8%' }}>
                            {oudler.map((data, i) => (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => howManyOudler(oudler[i])}
                                    style={oudlerStyles[i]}>
                                    <Text>{oudler[i]}</Text>
                                </TouchableOpacity>
                            )
                            )}
                        </View>
                    </View>
                    {!isFourPlayer &&
                        <View>
                            <Text>Qui est appelé ?</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                {Object.keys(name).map((data, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={() => handleCalledPlayer(name[data])}
                                        style={[
                                            styles.playerButton,
                                            { backgroundColor: calledPlayer === name[data] ? 'green' : 'transparent' },
                                        ]}
                                    >
                                        <Text>{name[data]}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    }


                    <View>
                        <Text style={{ textAlign: 'center', fontSize: 20 }}>Combien de points ?</Text>
                        <View style={{ flexDirection: 'row', marginTop: '8%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text >Preneur </Text>
                            <View style={{ borderWidth: 1, alignItems: 'center', justifyContent: 'center', width: '10%', marginLeft: '10%', marginRight: '10%' }}>
                                <Text style={{ color: isGameWon <= contractValue ? 'green' : 'red' }}> {contractValue}</Text>
                            </View>
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => (setContractValue(contractValue + 1))}>
                                    <Text style={{ fontSize: 20 }}>+</Text>
                                </TouchableOpacity >
                                <Text style={{ color: isGameWon <= contractValue ? 'green' : 'red' }}>({contractValue - isGameWon})</Text>
                                <TouchableOpacity onPress={() => (setContractValue(contractValue - 1))}>
                                    <Text style={{ fontSize: 20 }}>-</Text>
                                </TouchableOpacity>
                            </View>


                        </View>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            onValueChange={(value) => setContractValue(value)}
                            minimumValue={0}
                            maximumValue={91}
                            minimumTrackTintColor="#000000"
                            maximumTrackTintColor="#000000"
                            value={contractValue}
                            step={1}
                            thumbTintColor='#000000'

                        />
                        <View style={{ flexDirection: 'row', marginTop: '8%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text >Autre équipe </Text>
                            <View style={{ borderWidth: 1, alignItems: 'center', justifyContent: 'center', width: '10%', marginLeft: '10%', marginRight: '10%' }}>
                                <Text style={{ color: isGameWon <= contractValue ? 'red' : 'green' }}> {91 - contractValue}</Text>
                            </View>
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => (setContractValue(contractValue - 1))}>
                                    <Text style={{ fontSize: 20 }}>+</Text>
                                </TouchableOpacity >
                                <Text style={{ color: isGameWon <= contractValue ? 'red' : 'green' }}>({contractValue - isGameWon})</Text>
                                <TouchableOpacity onPress={() => (setContractValue(contractValue + 1))}>
                                    <Text style={{ fontSize: 20 }}>-</Text>
                                </TouchableOpacity>
                            </View>


                        </View>


                    </View>
                    <TouchableOpacity onPress={() => gameValidation()} style={{ alignItems: 'center' }}>
                        <Text>Valider</Text>
                    </TouchableOpacity>
                </View>


            </Modal >

        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: '10%',


    },
    playerButton: {
        borderWidth: 1,
        width: 60,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',

    },
    contratButton: {
        borderWidth: 1,
        width: 60,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    totaux: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        height: '8%',
    },
    name: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        height: '5%',
    },
    pointsmap: {
        flexDirection: "row",
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        width: '100%',
        height: '80%',
    },
    pointsEveryGame: {
        fontSize: 18,
    },
    totalSize: {
        height: '50%',
        width: '12%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    singlePointMap: {
        justifyContent: 'center',
        alignItems: 'center'

    }
});