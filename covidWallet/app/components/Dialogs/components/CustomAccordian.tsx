import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CollapsibleView from "@eliav2/react-native-collapsible-view";
import { CheckBox}  from 'react-native-elements';

import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from '../../../theme/Colors';

interface INProps {
  credential: any;
  setSelected: Function;
}

const CustomAccordian = (props: INProps) => {

  //States
  const [cred, setCred] = useState({});
  const [credentials, setCredentials] = useState([]);
  const [temp, setTemp] = useState(0);

  useEffect(()=>{
    _modifyData();  
  },[])

  const _modifyData = () => {
    setCred(null);
    props.setSelected(null);
    let temp = [];
    props.credential.forEach((item:any, index:number)=>{
      let obj = {
        ...item,
        expanded: false,
        selected: false,
      };
      temp.push(obj);
    });
    setCredentials(temp);
  }
  
  function setSelected(e: any) {

    setCred(null);
    props.setSelected(null);
    
    let temp = credentials;
    credentials.forEach((item: any, index: number)=>{
      if(item.credentialId == e.credentialId){
        if(item.selected)
          item.selected = false;
        else{
          setCred(e);
          props.setSelected(e);
          item.selected = true;
        }
      }
      else{
        item.selected = false;
      }
    });
    setCredentials(temp);
    setTemp(Math.random()*999);
  }

  function _openDetails (e: any) {
    let temp = credentials;
    credentials.forEach((item: any, index: number)=>{
      if(item.credentialId == e.credentialId){
        if(item.expanded)
          item.expanded = false;
        else
          item.expanded = true;
      }
      else{
        item.expanded = false;
      }
    });
    setCredentials(temp);
    setTemp(Math.random()*999);
  }

  // Function to render credentials values
  const _renderValues = (cred) => {
    return (
      <View
        style={{
          marginTop: 10,
        }}
      >
        {
          Object.keys(cred.values).map((v, i) =>
            (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: i == (Object.keys(cred.values).length - 1) ? 0 : 0.5,
                  borderBottomColor: 'rgba(0,0,0,0.5)',
                  paddingBottom: i == (Object.keys(cred.values).length - 1) ? 0 : 5,
                  marginBottom: i == (Object.keys(cred.values).length - 1) ? 0 : 5,
                }}>
                <Text style={{width: '45%', color: SECONDARY_COLOR, fontFamily: 'Poppins-Regular', fontSize: 12, fontWeight: 'bold'}}>
                  {v}
                </Text>
                <Text style={{width: '45%', color: SECONDARY_COLOR, fontFamily: 'Poppins-Regular', fontSize: 12 }}>
                  {cred.values[v]}
                </Text>
              </View>
            )
          )
        }
      </View>
    );
  };

  return (
    credentials.length ? (
      credentials.map((cred:any, index:number)=>(
        <View style={styles._mainContainer}>
          <View style={styles._titleContainer}>
            <CheckBox 
              onPress={()=>{
                setSelected(cred);
              }}
              size={24}
              containerStyle={{
                margin: 0,
                padding: 0,
                marginLeft: 0,
                marginRight: 5,
              }}
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={cred.selected}
              checkedColor={PRIMARY_COLOR}
              uncheckedColor={SECONDARY_COLOR}
            />
            <Text style={styles._titleStyle}>
              {
                (cred != undefined && cred.values.type != undefined) ? cred.values.type :
                    (
                      (cred.values != undefined || cred.values != null) &&
                      cred.values["Vaccine Name"] != undefined &&
                      cred.values["Vaccine Name"].length != 0 &&
                      cred.values["Dose"] != undefined &&
                      cred.values["Dose"].length != 0
                  ) ?
                  'COVIDpass (Vaccination)' :
                  "Digital Certificate"
              }
            </Text>
          </View>
          <CollapsibleView 
            expanded={cred.expanded}
            noArrow
            touchableWrapperStyle={styles._collapsibleMainContainer}
            title={
              <Text onPress={()=>{ _openDetails(cred) }} style={styles._openStyle}>Open Details</Text>
            }
          >
            {
              _renderValues(cred)
            }
          </CollapsibleView>
        </View>
      ))
    ):(
      <Text style={{ marginLeft: 24, marginRight: 24, textAlign: 'center', fontSize: 14, color: SECONDARY_COLOR }}>Sorry! you don't have any credentials yet</Text>
    )
  );
};

const styles = StyleSheet.create({
  _mainContainer:{
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
    padding: 10,
  },
  _titleContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  _collapseTitleContainer:{
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  _collapsibleMainContainer:{
    width: '100%',
    alignSelf: 'center',
    alignItems: 'flex-start',
    borderWidth: 0,
    padding: 0,
  },
  _titleStyle:{
    width: '90%',
    fontSize: 14,
    color: PRIMARY_COLOR,
    fontFamily: 'Poppins-Regular',
  },
  _openStyle:{
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textDecorationLine: 'underline',
  }
});

export default CustomAccordian;
