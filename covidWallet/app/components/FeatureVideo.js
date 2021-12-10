import React, { useCallback, useRef, useState } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native'
import Modal from 'react-native-modal';
import YoutubePlayer from "react-native-youtube-iframe";
import { GRAY_COLOR, WHITE_COLOR } from '../theme/Colors';
import SimpleButton from './Buttons/SimpleButton';
import HeadingComponent from './HeadingComponent';

const FeatureVideo = ({ isVisible, onCloseClick }) => {

    const playerRef = useRef();

    const onStateChange = useCallback((state) => {
        if (state == "ended") {
            playerRef.current.seekTo(0, true);
        }
    }, []);

    const [loading, setLoading] = useState(true);

    return (
        <Modal
            isVisible={isVisible}
        >
            <View style={styles._mainContainer}>
                <HeadingComponent
                    text={`Introducing\nnew feature`}
                />

                {
                    loading &&
                    <ActivityIndicator
                        size='large'
                        color={GRAY_COLOR}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            alignSelf: 'center',
                        }}
                    />
                }
                <YoutubePlayer
                    ref={playerRef}
                    width={'100%'}
                    height={Dimensions.get('window').width * 0.45}
                    onReady={() => {
                        setLoading(false);
                    }}
                    play={true}
                    initialPlayerParams={{
                        controls: false,
                        loop: 1,

                    }}
                    webViewProps={{
                        style: {
                            borderRadius: 12,
                        },
                    }}
                    forceAndroidAutoplay={true}
                    contentScale={0.6}
                    videoId={"bOcJZZapxKw"}
                    onChangeState={onStateChange}
                />

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