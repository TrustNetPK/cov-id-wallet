import axios from 'axios';
import * as React from 'react';
import {View, Text, StyleSheet, Image, ActivityIndicator} from 'react-native';
import {ZADA_S3_BASE_URL} from '../helpers/ConfigApp';
import useNetwork from '../hooks/useNetwork';
import {BLACK_COLOR, WHITE_COLOR} from '../theme/Colors';

const CARD_BG = require('../assets/images/card-bg.png');

function CardBackground(props) {
  const {isConnected} = useNetwork();
  const [backgroundImage, setBakcgroundImage] = React.useState(CARD_BG);
  const [loading, setLoading] = React.useState(true);
  const [isUrl, setUrl] = React.useState(false);

  React.useEffect(() => {
    _checkForImageInS3();
  }, []);

  const _checkForImageInS3 = () => {
    console.log('_checkForImageInS3');
    try {
      if (!isConnected) {
        setLoading(false);
        setBakcgroundImage(CARD_BG);
        setUrl(false);
        return;
      }
      setLoading(true);

      let schemeId = props.schemeId.replace(/:/g, '.');

      const result = axios
        .get(`${ZADA_S3_BASE_URL}/${schemeId}.png`)
        .then((res) => {
          if (res.status === 200) {
            setBakcgroundImage(`${ZADA_S3_BASE_URL}/${schemeId}.png`);
            setUrl(true);
            setLoading(false);
          }
        })
        .catch((error) => {
          setUrl(false);
          setLoading(false);
          //setBakcgroundImage(`${ZADA_S3_BASE_URL}/default.png`);
        });
    } catch (error) {
      setUrl(false);
      setBakcgroundImage(CARD_BG);
      setLoading(false);
    }
  };

  return (
    <View style={styles._mainContainer}>
      {loading ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="small" color={WHITE_COLOR} />
        </View>
      ) : (
        <>
          <Image
            source={isUrl ? {uri: backgroundImage} : backgroundImage}
            style={styles._frontLayer}
          />
          {props.children}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  _mainContainer: {
    width: '100%',
    height: 170,
    borderRadius: 20,
    backgroundColor: BLACK_COLOR,
  },
  _frontLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.8,
    borderRadius: 15,
  },
  _detailsView: {
    padding: 20,
    width: '100%',
    height: '100%',
  },
  _cardTitle: {
    color: 'white',
    fontSize: 23,
    lineHeight: 22,
    fontWeight: '100',
    fontWeight: 'bold',
  },
  _bottomContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  _cardLogo: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  _cardInfoContainer: {
    width: '75%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  card_small_text: {
    color: 'white',
  },
});

export default CardBackground;
