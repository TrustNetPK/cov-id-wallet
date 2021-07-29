import * as React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
// import {} from 'linera'

const image = require('../assets/images/card-bg.png')
const card_badge = require('../assets/images/badge.png')
const planeImage = require('../assets/images/world_map.png')

function CredentialsCard(props) {
    return (
        <View>
            <View style={styles.card}>
                <ImageBackground resizeMode={"cover"} source={planeImage} style={styles.image} imageStyle={{ borderRadius: 15 }}>
                    <Image source={image} style={styles.frontLayer} />
                    <View style={styles.container}>
                        <View style={styles.cardTextContainer}>
                            {/* <Text style={styles.card_text}>{props.card_title}</Text> */}
                            <Text style={styles.card_text}>{props.card_type}</Text>
                        </View>
                        {/* <View style={styles.imageContainer}>
                            <Image source={card_badge} style={styles.logo} />
                        </View> */}
                    </View>
                    <View style={styles.container}>
                        <View style={styles.item1}>
                            <Image source={props.card_logo} style={{ width: 50, height: 50, borderRadius: 4, }} />
                        </View>
                        <View style={styles.item2}>
                            <Text style={[styles.card_small_text, { color: '#ffffff90' }]}>Issued by</Text>
                            <Text style={styles.card_small_text}>{props.issuer}</Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardTextContainer: {
        paddingTop: 20,
        paddingLeft: 20,
    },
    logo: {
        width: 50,
        marginTop: 50,
        marginLeft: 75,
        height: 70,
        position: 'absolute',
        alignItems: 'center', justifyContent: 'center',
    },
    card: {
        width: '100%',
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
        justifyContent: 'center',
    },
    item1: {
        width: '20%',
        padding: 20,
        justifyContent: 'center',
    },
    item2: {
        width: '80%',
        paddingTop: 24,
        paddingLeft: 8,
        paddingBottom: 24,
        justifyContent: 'space-around',
    },
    imageContainer: {

    },
    card_text: {
        color: 'white',
        fontSize: 23,
        lineHeight: 22,
        fontWeight: '100',
        fontWeight: "bold",
    },
    card_small_text: {
        color: 'white',
        lineHeight: 14,
    },
    image: {
        flex: 1,
        borderRadius: 20,
        justifyContent: "center",
    },
    frontLayer: {
        position: "absolute",
        width: '100%',
        height: "100%",
        opacity: 0.8,
        borderRadius: 15,
    }
});

export default CredentialsCard;