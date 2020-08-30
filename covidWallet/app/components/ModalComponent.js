import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton'
import Modal from 'react-native-modal';
import { WHITE_COLOR, GRAY_COLOR } from '../theme/Colors';
import HeadingComponent from './HeadingComponent';
import { ScrollView } from 'react-native-gesture-handler';
import CredentialsCard from './CredentialsCard';

const card_logo = require('../assets/images/visa.jpg')

function ModalComponent(props) {

  const styles = StyleSheet.create({
    ModalComponent: {
      flex: 1,
    },
    ModalChildContainer: {
      flex: 1,
      backgroundColor: WHITE_COLOR,
      borderRadius: 15,
      marginTop: "10%",
      marginBottom: "2%",
    },
    centerContainer: {
      alignItems: 'center',
      paddingBottom: 20,
    },
    modalValues: {
      color: GRAY_COLOR,
      fontSize: 18,

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
      paddingTop: 20
    }
  });

  return (
    <View style={styles.ModalComponent}>
      <Modal hideModalContentWhileAnimating={true} useNativeDriver={false} isVisible={props.isVisible} >
        <View style={styles.ModalChildContainer}>
          {props.credentials && <CredentialsCard card_title="COVID-19 (SARS-CoV-2)" card_type="Digital Certificate" issuer="Agha Khan Hospital" card_user="SAEED AHMAD" date="05/09/2020" card_logo={card_logo} />}
          <View style={styles.centerContainer}>
            <HeadingComponent text="Details" />
          </View>
          <ScrollView>

            {props.data !== undefined && (<View style={styles.modalValuesContainer}>
              <Text>First Name</Text>
              <Text style={styles.modalValues}>{String(props.data.firstname)}</Text>
              <Text>Last Name</Text>
              <Text style={styles.modalValues}>{String(props.data.lastname)}</Text>
              <Text>Gender</Text>
              <Text style={styles.modalValues}>{props.data.gender}</Text>
              <Text>Data of Birth</Text>
              <Text style={styles.modalValues}>{props.data.dob}</Text>
              <Text>Nationality</Text>
              <Text style={styles.modalValues}>{props.data.nationality}</Text>
              <Text>Document Type</Text>
              <Text style={styles.modalValues}>{props.data.doctype}</Text>
              <Text>Document ID</Text>
              <Text style={styles.modalValues}>{props.data.docID}</Text>
              <Text>Vaccination Name</Text>
              <Text style={styles.modalValues}>{props.data.vacName}</Text>
              <Text>Batch</Text>
              <Text style={styles.modalValues}>{props.data.batch}</Text>
              <Text>Dose</Text>
              <Text style={styles.modalValues}>{props.data.dose}</Text>
              <Text>Next Booster Date</Text>
              <Text style={styles.modalValues}>{props.data.nextBoosterDate}</Text>
              <Text>Vaccinator Name</Text>
              <Text style={styles.modalValues}>{props.data.vaccinatorName}</Text>
              <Text>Accreditor Credential Defination ID</Text>
              <Text style={styles.modalValues}>{props.data.accreditor_cred_def_id}</Text>
              <Text>Vaccination Organization</Text>
              <Text style={styles.modalValues}>{props.data.vaccinator_org}</Text>
              <Text>Vaccination Organization Type</Text>
              <Text style={styles.modalValues}>{props.data.vaccinator_org_type}</Text>
              <Text>Vaccination Oragnization Location</Text>
              <Text style={styles.modalValues}>{props.data.vaccinator_org_loc}</Text>
              <Text>Validation Duration</Text>
              <Text style={styles.modalValues}>{props.data.validate_from} to {props.data.validTill}</Text>

              <View style={styles.horizontalRule} /></View>)
            }
            <View style={styles.centerContainer}>
              <PrimaryButton text="Accept" nextHandler={props.toggleModal} />
              <PrimaryButton text="Reject" nextHandler={props.toggleModal} />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

export default ModalComponent;
