import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import TouchableComponent from '../../Buttons/TouchableComponent';
import RadioButton from './RadioButton';
import {
  BLACK_COLOR,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  WHITE_COLOR,
} from '../../../theme/Colors';

interface INProps {
  credential: any;
  setSelected: Function;
}

const CustomAccordian = (props: INProps) => {
  //States
  const [activeSections, setActiveSections] = useState([]);
  const [cred, setCred] = useState({});

  console.log("PROPS => ", JSON.stringify(props));

  function setSelected(e: object) {
    setCred(e);
    props.setSelected(e);
  }

  const _renderSectionTitle = (section) => {
    console.log("SECTION => ", section);
    return (
      <View
        style={{
          marginTop: 10,
        }}>
        <RadioButton
          isChecked={cred == section}
          item={section}
          setSelected={setSelected}>
          <Text
            style={{
              textAlignVertical: 'center',
              color: BLACK_COLOR,
            }}>
            {section.type != undefined ? section.type : 'Digital Certificate'}
          </Text>
        </RadioButton>
      </View>
    );
  };

  const _renderHeader = (section) => {
    console.log("HEADER => ", section);
    return (
      <View style={styles.header}>
        <View style={styles.cardContainerStyle}>
          <Text style={styles.headerTextStyle}>Open details</Text>
        </View>
      </View>
    );
  };

  const _renderContent = (section) => {
    console.log("CONTENT => ", section);
    return (
      <View
        style={{
          borderRadius: 20,
          //   backgroundColor: PRIMARY_COLOR,
          padding: 8,
        }}>
        {Object.keys(section.values).map((v, i) =>
          (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 24,
                marginRight: 24,
              }}>
              <Text style={{color: SECONDARY_COLOR, fontWeight: 'bold'}}>
                {v}
              </Text>
              <View>
                <Text style={{color: SECONDARY_COLOR}}>
                  {section.values[v]}
                </Text>
              </View>
            </View>
          )
        )}
      </View>
    );
  };

  const _updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };
  
  return (
    <Accordion
      sections={props.credential}
      activeSections={activeSections}
      renderSectionTitle={_renderSectionTitle}
      renderHeader={_renderHeader}
      renderContent={_renderContent}
      onChange={_updateSections}
      containerStyle={styles.accordianContainerStyle}
      touchableComponent={TouchableComponent}
    />
  );
};

const styles = StyleSheet.create({
  cardContainerStyle: {
    padding: 0,
    borderRadius: 4,
    height: 50,
    justifyContent: 'center',
  },
  accordianContainerStyle: {
    margin: 16,
  },
  header: {
    padding: 5,
    // height: 50,
    backgroundColor: PRIMARY_COLOR,
  },
  headerTextStyle: {
    color: WHITE_COLOR,
    textAlign: 'center',
  },
  content: {},
  contentTextStyle: {
    // borderWidth: 2,
  },
  image: {
    flexDirection: 'row',
    height: '100%',
    borderRadius: 4,
    justifyContent: 'center',
  },
  textStyle: {
    color: 'black',
  },
});

export default CustomAccordian;
