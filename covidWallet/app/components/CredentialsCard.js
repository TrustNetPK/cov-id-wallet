import * as React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';

const image = require('../assets/images/creditcard.jpg')

function CredentialsCard(props) {
    return (
        <View>
            <View style={styles.card}>
                <ImageBackground source={image} style={styles.image} imageStyle={{ borderRadius: 15 }}>
                    <View style={styles.container}>
                        <View style={styles.cardTextContainer}>
                        <Text style={styles.card_text}>{props.card_title}</Text>
                        <Text style={styles.card_text}>{props.card_type}</Text>
                        </View>
                        <View>
                        <Image source={props.card_logo} style={styles.logo} />
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.item}>
                        <Image source={props.card_logo} style={{width:30,height:40}} />
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.card_small_text}>Issued by</Text>
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
        padding: 20,
    },
    logo: {
        width: 50,
        marginTop: 60,
        marginRight: 6,
        backgroundColor: 'white',
        height: 40,
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
        justifyContent:'center',
    },
    item: {
        width:'50%',
        padding: 20,
        justifyContent:'center',
    },
    card_text: {
        color: 'white',
        fontSize: 23,
        lineHeight: 22,
        fontWeight: '100',
    },
    card_small_text: {
        color: 'white',
        lineHeight: 14,
    },
    image: {
        flex: 1,
        borderRadius: 20,
        justifyContent: "center"
    },
});

export default CredentialsCard;