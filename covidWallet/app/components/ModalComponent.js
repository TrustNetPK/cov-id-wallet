import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton'
import Modal from 'react-native-modal';
import { WHITE_COLOR, GRAY_COLOR } from '../theme/Colors';
import HeadingComponent from './HeadingComponent';
import { ScrollView } from 'react-native-gesture-handler';

function ModalComponent(props) {

  const styles = StyleSheet.create({
    ModalComponent: {
      flex: 1,
    },
    ModalChildContainer: {
      flex: 1,
      backgroundColor: WHITE_COLOR,
      borderRadius: 10,
    },
    centerContainer: {
      alignItems: 'center',
      paddingBottom: 20,
      paddingTop: 10,
    },
    modalValues: {
      color: GRAY_COLOR,
      fontSize: 18
    },
    horizontalRule: {
      borderBottomColor: GRAY_COLOR,
      borderBottomWidth: 1,
    },
    modalValuesContainer: {
      width: '97%',
      alignSelf: 'center',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 8
    }
  });

  return (
    <View style={styles.ModalComponent}>
      <Modal hideModalContentWhileAnimating={true} useNativeDriver={false} isVisible={props.isVisible}>
        <View style={styles.ModalChildContainer}>
          <View style={styles.centerContainer}>
            <HeadingComponent text="Details" />
          </View>
          <ScrollView>
            {props.data && props.data.map((v, i) => {
              return (<View key={i} style={styles.modalValuesContainer}>
                <Text>{v.name}</Text>
                <Text style={styles.modalValues}>{v.value}</Text>
                <View style={styles.horizontalRule} /></View>)
            })
            }
            <View style={styles.centerContainer}>
              <PrimaryButton text="ACCEPT" nextHandler={props.toggleModal} />
              <PrimaryButton text="REJECT" nextHandler={props.toggleModal} />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

export default ModalComponent;
