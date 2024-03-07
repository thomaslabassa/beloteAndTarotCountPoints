import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import Slider from '@react-native-community/slider';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addGame, deleteSingleGame } from '../reducers/tarot';

export default function TarotGame(props, { navigation }) {


    const dispatch = useDispatch();

    // console.log(props.route.params)
    const [isFourPlayer, setIsFourPlayer] = useState(props.route.params.isFourPlayer);
    const [modalVisible, setModalVisible] = useState(false); // faire apparaitre modal décompte points
    const [modalStatsVisible, setModalStatsVisible] = useState(false); // faire apparaitre modal avec les stats de la partie
    const [modalDeleteGameVisible, setModalDeleteGameVisible] = useState(false); // faire apparaitre pour supprimer une partie en particulier
    const [selectedPlayer, setSelectedPlayer] = useState(null); // joueur qui prends
    const [calledPlayer, setCalledPlayer] = useState(null); // joueur appelé si 5 joueurs
    const [chosenContract, setChosenContract] = useState(null); // contrat du preneur
    const [oudlerPlayer, setOudlerPlayer] = useState([]); // nombre de bout du preneur
    const [contractValue, setContractValue] = useState(null); // valeur du slider
    const [isGameWon, setIsGameWon] = useState(null) // nombre de points necessaires pour gagner la partie 
    const [isAlone, setIsAlone] = useState(false)//nom d'un joueur si il est seul dans une aprtir à 5
    const [indexGameToDelete, setIndexGameToDelete] = useState(null) // index de la partie unique à supprimer
    const [missingInfo, setMissingInfo] = useState(false) // check to validate game
    const [arrRankingsPoints, setArrRankingsPoints] = useState(null)// tableau claseement joueurs par points
    const [arrRankingsPreneur, setArrRankingsPreneur] = useState(null)// tableau claseement joueurs par nombre de fois pris

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
    console.log('ici', gameStore.games[indexGame])

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

    useEffect(() => {
        const allData = () => {
            if (selectedPlayer === null || chosenContract === null) {
                setMissingInfo(false)
            } else {
                setMissingInfo(true)
            }
        }
        allData()
    }, [selectedPlayer, chosenContract]);





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
            <Text style={{ fontSize: 20, alignItems: 'center', justifyContent: 'center' }}>{name[data]}</Text>
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
    //console.log(indexGameToDelete)
    // console.log('points', pointsCalculation())
    //console.log(isFourPlayer)
    const gameValidation = () => {
        if (selectedPlayer === null || chosenContract === null) {
            setMissingInfo(false)
        } else {
            setMissingInfo(true)
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
                        points: isAlone && selectedPlayer === name.first ? pointsCalculation() * 4 : selectedPlayer === name.first ? pointsCalculation() * 2 : calledPlayer === name.first ? pointsCalculation() : -pointsCalculation(),
                        isPreneur: selectedPlayer === name.first ? chosenContract : false
                    },
                    secondPlayer: {
                        points: isAlone && selectedPlayer === name.second ? pointsCalculation() * 4 : selectedPlayer === name.second ? pointsCalculation() * 2 : calledPlayer === name.second ? pointsCalculation() : -pointsCalculation(),
                        isPreneur: selectedPlayer === name.second ? chosenContract : false
                    },
                    thirdPlayer: {
                        points: isAlone && selectedPlayer === name.third ? pointsCalculation() * 4 : selectedPlayer === name.third ? pointsCalculation() * 2 : calledPlayer === name.third ? pointsCalculation() : -pointsCalculation(),
                        isPreneur: selectedPlayer === name.third ? chosenContract : false
                    },
                    forthPlayer: {
                        points: isAlone && selectedPlayer === name.forth ? pointsCalculation() * 4 : selectedPlayer === name.forth ? pointsCalculation() * 2 : calledPlayer === name.forth ? pointsCalculation() : -pointsCalculation(),
                        isPreneur: selectedPlayer === name.forth ? chosenContract : false
                    },
                    fifthPlayer: {
                        points: isAlone && selectedPlayer === name.fifth ? pointsCalculation() * 4 : selectedPlayer === name.fifth ? pointsCalculation() * 2 : calledPlayer === name.fifth ? pointsCalculation() : -pointsCalculation(),
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
        let sum = 0
        arr.forEach((el) => sum += el)
        return sum
    }

    useEffect(() => {

        const howManyPreneur = (arr) => {
            let sum = 0
            arr.forEach((el) => {
                if (el !== false) {
                    sum++
                }
            });
            return sum;
        }
        let arr = [
            { name: name.first, total: totalPoints(gameStore.games[indexGame].firstPlayer.game), preneur: howManyPreneur(gameStore.games[indexGame].firstPlayer.preneur) },
            { name: name.second, total: totalPoints(gameStore.games[indexGame].secondPlayer.game), preneur: howManyPreneur(gameStore.games[indexGame].secondPlayer.preneur) },
            { name: name.third, total: totalPoints(gameStore.games[indexGame].thirdPlayer.game), preneur: howManyPreneur(gameStore.games[indexGame].thirdPlayer.preneur) },
            { name: name.forth, total: totalPoints(gameStore.games[indexGame].forthPlayer.game), preneur: howManyPreneur(gameStore.games[indexGame].forthPlayer.preneur) },
        ]
        if (!isFourPlayer) {
            arr.push({ name: name.fifth, total: totalPoints(gameStore.games[indexGame].fifthPlayer.game), preneur: howManyPreneur(gameStore.games[indexGame].fifthPlayer.preneur) });
        }
        //console.log(arr)
        let arrPoints = [...arr]
        arrPoints.sort((a, b) => b.total - a.total)
        setArrRankingsPoints(arrPoints)

        let arrPreneur = [...arr]
        arrPreneur.sort((a, b) => b.preneur - a.preneur)
        setArrRankingsPreneur(arrPreneur)

    }, [modalStatsVisible]);


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
                            <TouchableOpacity onPress={() => { setIndexGameToDelete(i), setModalDeleteGameVisible(!modalDeleteGameVisible) }}>
                                <Text > {i + 1}</Text>
                            </TouchableOpacity>
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
            <TouchableOpacity onPress={() => setModalStatsVisible(!modalStatsVisible)} style={{ width: '100%', height: '5%', backgroundColor: 'yellow', alignItems: 'center', justifyContent: 'center' }}>
                <Text>Voir les statistiques de la partie</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={{ backgroundColor: 'white', height: '100%', width: '100%', justifyContent: 'space-between' }}>
                    <View >
                        <Text style={{ textAlign: 'center', fontSize: 25 }}>Qui a pris ?</Text>
                        <View style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', marginTop: '2%', flexWrap: 'wrap' }}>
                            {howManyPlayers}
                        </View>
                    </View>
                    <View>
                        <Text style={{ textAlign: 'center', fontSize: 25 }}>Quel contrat a été choisi ?</Text>
                        <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginTop: '2%', flexWrap: 'wrap' }}>
                            {contrat.map((data, i) => (
                                <TouchableOpacity key={i} style={[styles.contratButton, { backgroundColor: chosenContract === contrat[i] ? 'green' : 'transparent' }]} onPress={() => whichContract(contrat[i])}>
                                    <Text style={{ fontSize: 15 }}> {contrat[i]}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <View>
                        <Text style={{ textAlign: 'center', fontSize: 20 }}>Combien de bouts</Text>
                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: '8%' }}>
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
                        <View >
                            <View >
                                <TouchableOpacity style={styles.buttonMoreLessPoints} onPress={() => {
                                    if (contractValue > 0) {
                                        (setContractValue(contractValue - 1))
                                    } else {
                                        setContractValue(0)
                                    }
                                }}>
                                    <Text style={{ fontSize: 20 }}>-</Text>
                                </TouchableOpacity>
                                <View style={{ borderWidth: 1, alignItems: 'center', justifyContent: 'center', width: '10%', borderRadius: 15 }}>
                                    <Text style={{ color: isGameWon <= contractValue ? 'green' : 'red' }}> {contractValue}</Text>
                                </View>
                                <TouchableOpacity style={styles.buttonMoreLessPoints} onPress={() => {
                                    if (contractValue < 91) {
                                        (setContractValue(contractValue + 1))
                                    } else {
                                        setContractValue(91)
                                    }
                                }}>
                                    <Text style={{ fontSize: 20 }}>+</Text>
                                </TouchableOpacity >
                            </View>
                            <Text style={{ color: isGameWon <= contractValue ? 'green' : 'red' }}>({contractValue - isGameWon})</Text>
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
                    <TouchableOpacity onPress={() => gameValidation()} style={{ alignItems: 'center', backgroundColor: !missingInfo ? 'red' : 'transparent' }}>
                        <Text>Valider</Text>
                    </TouchableOpacity>
                </View>
            </Modal >

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalDeleteGameVisible}
                onRequestClose={() => {
                    setModalDeleteGameVisible(!modalDeleteGameVisible);
                }}>
                <View style={{ backgroundColor: 'white', height: '20%', justifyContent: 'space-between', padding: 10 }}>
                    <Text>Etes vous sur de vouloir supprimer la partie {indexGameToDelete + 1} ?</Text>
                    <TouchableOpacity onPress={() => {
                        dispatch(deleteSingleGame({
                            indexGameWhereToDelete: indexGame,
                            indexGametoDelete: indexGameToDelete
                        })), setModalDeleteGameVisible(!modalDeleteGameVisible)
                    }
                    }>
                        <Text>Oui</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalDeleteGameVisible(!modalDeleteGameVisible)}>
                        <Text>Non</Text>
                    </TouchableOpacity>
                </View>
            </Modal >

            <Modal
                animationType="slide"
                visible={modalStatsVisible}
                onRequestClose={() => {
                    setModalStatsVisible(!modalStatsVisible);
                }}>
                <View style={{ backgroundColor: 'white', height: '100%', justifyContent: 'space-between', padding: 10 }}>


                    <View style={{ alignItems: 'center' }}>

                        <Text>Classement</Text>
                        {arrRankingsPoints && arrRankingsPoints.map((data, i) => (
                            <View key={i} >
                                <Text > {data.name}:  {data.total}</Text>
                            </View>
                        ))}

                        <Text>Nombre de fois pris</Text>
                        {arrRankingsPreneur && arrRankingsPreneur.map((data, i) => (
                            <View key={i} >
                                <Text > {data.name}:  {data.preneur}</Text>
                            </View>
                        ))}
                    </View>

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
        paddingBottom: '10%'


    },
    playerButton: {
        borderWidth: 1,
        width: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '5%',
        marginTop: '5%',


    },
    contratButton: {
        borderWidth: 1,
        width: '20%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '5%',
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

    },
    buttonMoreLessPoints: {
        backgroundColor: 'grey',
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
