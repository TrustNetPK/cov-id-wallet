import React from 'react'
import {
    StyleSheet,
    View,
    ScrollView,
    RefreshControl
} from 'react-native';

import { BACKGROUND_COLOR, BLACK_COLOR } from '../theme/Colors';
import BorderButton from './BorderButton';
import ImageBoxComponent from './ImageBoxComponent';
import TextComponent from './TextComponent';

const EmptyList = ({ refreshing, onRefresh, text, image, screen, onPress }) => {
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    tintColor={'#7e7e7e'}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            contentContainerStyle={styles.EmptyContainer}
        >
            <TextComponent
                text={text}
            />
            <ImageBoxComponent
                source={image}
            />
            {
                screen == 'actions' &&
                <View style={styles.QRBtnContainer}>
                    <BorderButton
                        nextHandler={onPress}
                        text="QR CODE"
                        color={BLACK_COLOR}
                        textColor={BLACK_COLOR}
                        backgroundColor={BACKGROUND_COLOR}
                        isIconVisible={true}
                    />
                </View>
            }

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    EmptyContainer: {
        flex: 1,
        alignItems: 'center',
    },
    QRBtnContainer: {
        alignItems: "center",
        position: 'absolute',
        bottom: '3%',
    }
});

export default EmptyList;
