import * as React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {BLACK_COLOR} from '../theme/Colors';

function CertificateCard(props) {
  return (
    <View style={styles._detailsView}>
      <Text style={styles._cardTitle}>{props.card_type}</Text>

      <View style={styles._bottomContainer}>
        <Image source={props.card_logo} style={styles._cardLogo} />
        <View style={styles._cardInfoContainer}>
          <View
            style={{
              width: '60%',
            }}>
            <Text style={styles.card_small_text}>Issued by</Text>
            <Text style={[styles.card_small_text, {fontWeight: 'bold'}]}>
              {props.issuer}
            </Text>
          </View>
          {props.date ? (
            <View>
              <Text style={styles.card_small_text}>Issued Time</Text>
              <Text style={[styles.card_small_text, {fontWeight: 'bold'}]}>
                {props.date}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
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

export default CertificateCard;
