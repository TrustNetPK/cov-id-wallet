import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

function AboutUs() {

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
            ZADA is a Digital Identity Technology Company, driven to ensure
            everyone can provide and use digital services without risk for fraud
            or privacy intrusion.
          </Text>
          <Text style={styles.MainText}>
            Using ZADA, you are in full control of your data. You decide what
            you want to receive and what you want to share with who.
          </Text>
          <Text style={styles.MainText}>
            ZADA is leading a revolution in how personal information is managed,
            and by using ZADA you are part of this change!
          </Text>
          <Text style={styles.MainText}>
            To contribute back to the community, the ZADA App is created as an
            open source project, originally created by Trustnet Pakistan, so
            other companies that want to launch a wallet on ZADA Network also
            can do that.
          </Text>
          <Text style={styles.MainText}>
            ZADA is not just an app but an ecosystem, a network, and a mission
            to ensure everyone can provide and use digital services without risk
            for fraud or privacy intrusion!
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
    marginVertical: 16,
    margin: 16,
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
    marginVertical: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AboutUs;
