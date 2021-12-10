import React from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native'
import Modal from 'react-native-modal';
import { GRAY_COLOR, WHITE_COLOR } from '../theme/Colors';
import SimpleButton from './Buttons/SimpleButton';
import HeadingComponent from './HeadingComponent';
import WebView from 'react-native-webview';

const FeatureVideo = ({ isVisible, onCloseClick }) => {

    return (
        <Modal
            isVisible={isVisible}
        >
            <View style={styles._mainContainer}>
                <HeadingComponent
                    text={`Introducing\nnew feature`}
                />
                <View style={{
                    width: '100%',
                    height: Dimensions.get('window').width * 0.5,
                    borderRadius: 15,
                }}>
                    <WebView
                        renderLoading={() => (
                            <ActivityIndicator
                                size='large'
                                color={GRAY_COLOR}
                                style={{
                                    alignSelf: 'center',
                                }}
                            />
                        )}
                        bounces={false}
                        originWhitelist={['*']}
                        allowsInlineMediaPlayback
                        mediaPlaybackRequiresUserAction={false}
                        source={{ uri: 'https://www.youtube.com/embed/bOcJZZapxKw?playlist=bOcJZZapxKw&loop=1&autoplay=1&controls=0&fs=0&playsinline=1' }}
                        allowsFullscreenVideo={false}
                        containerStyle={{
                            borderRadius: 15,
                        }}
                    />
                </View>

                <SimpleButton
                    onPress={onCloseClick}
                    width={250}
                    title='Close'
                    titleColor={WHITE_COLOR}
                    buttonColor={GRAY_COLOR}
                    style={{
                        alignSelf: 'center',
                        marginTop: 20,
                    }}
                />
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    _mainContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 12,
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
    }
})

export default FeatureVideo;