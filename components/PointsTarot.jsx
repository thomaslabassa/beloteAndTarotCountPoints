import { StyleSheet, Text, View } from 'react-native';

export default function PointsTarot(props) {
    console.log(props.route.params)
    return (
        <View style={styles.container}>
            <Text>Ici !!</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: '10%'

    },
    top: {
        flexDirection: "row",
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        height: '10%',

    }
});
