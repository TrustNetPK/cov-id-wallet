import * as React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';

const image = require('../assets/images/creditcard.jpg')

function CredentialsCard(props) {
    return (
        <View>
            <View style={styles.card}>
                <ImageBackground source={image} style={styles.image} imageStyle={{ borderRadius: 15 }}>
                    <View style={styles.container}>
                        <View style={styles.item}>
                        </View>
                        <View style={styles.item}>
                            <Image source={props.card_logo} style={styles.logo} />
                        </View>
                        <View style={styles.card_no}>
                            <Text style={styles.card_text}>{props.card_no}</Text>
                        </View>
                        <View style={styles.item}>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.item}>
                            <Text style={styles.card_small_text}>{props.card_user}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.card_small_text}>{props.date}</Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: 50,
        backgroundColor: 'white',
        height: 40,
    },

    card: {
        width: 280,
        height: 170,
        borderRadius: 20,
        backgroundColor: 'black',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    item: {
        width: '50%',
        paddingLeft: 40,
        paddingTop: 30,
    },
    card_no: {
        width: '100%',
        paddingTop: 20,
    },
    card_text: {
        color: 'white',
        fontSize: 17,
        paddingLeft: 15,
        fontWeight: 'bold',
    },
    card_small_text: {
        color: 'white',
        paddingTop: 15,
    },
    image: {
        flex: 1,
        borderRadius: 20,
        justifyContent: "center"
    },
});

export default CredentialsCard;