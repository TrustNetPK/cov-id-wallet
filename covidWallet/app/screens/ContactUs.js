import * as React from 'react';
import {
  View,
  Text,
  Linking,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  PRIMARY_COLOR,
} from '../theme/Colors';

function ContactUs() {
  return (
    <View style={styles.MainContainer}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{
          flexGrow: 0,
        }}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.centerView}>
          <Text style={styles.MainText}>
            For questions and support, don’t hesitate to contact us on any of
            the following:
          </Text>
        </View>

        <View style={{}}>
          <Text
            style={[styles.ItemText, {color: PRIMARY_COLOR}]}
            onPress={() => {
              Linking.openURL('tel://+959765606651');
            }}>
            Phone: +959765606651
          </Text>

          <Text
            style={[styles.ItemText, {color: PRIMARY_COLOR}]}
            onPress={() => {
              Linking.openURL('mailto:help@zada.io');
            }}>
            Email: help@zada.io
          </Text>

          <Text
            style={[styles.ItemText, {color: PRIMARY_COLOR}]}
            onPress={() => {
              Linking.openURL('http://m.me/zadanetwork');
            }}>
            Facebook messenger: m.me/zadanetwork
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerView: {
    marginVertical: 25,
    marginLeft: 15,
    marginRight:8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ItemText: {
    color: 'black',
    marginVertical: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    justifyContent: 'center',
    alignItems: 'center',
  },

  MainText: {
    color: 'black',
    marginTop: 0,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ContactUs;
