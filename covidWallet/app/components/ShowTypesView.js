import * as React from 'react';
import {StyleSheet, Text, View, Switch} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';

export function TextTypeView({startValue, endValue, endIcon, onHandlePress}) {
  if (endIcon === '') {
    return (
      <View style={styles.container}>
        <Text style={styles.startItem}>{startValue}</Text>
        <TouchableOpacity style={styles.endItem} onPress={() => {}}>
          <Text style={styles.endItem}>{endValue}</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <TouchableOpacity style={styles.container} onPress={onHandlePress}>
        <Text style={styles.startItem}>{startValue}</Text>
        <TouchableOpacity>
          <Icon name={endIcon} style={styles.endItem} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

export function BooleanTypeView({
  startValue,
  endValue,
  valueHandler,
  parentValue,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.startItem}>{startValue}</Text>
      <Switch
        trackColor={{false: '#81b0ff', true: '#81b0ff'}}
        thumbColor={endValue ? '#3ab6ae' : '#3ab6ff'}
        ios_backgroundColor="#ffffff"
        onValueChange={() => valueHandler(parentValue, startValue)}
        value={endValue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 10,
    margin: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  startItem: {
    flex: 5,
    fontSize: 17,
    color: '#0f0f0f',
  },
  endItem: {
    justifyContent: 'flex-end',
    flex: 1,
    backgroundColor: '#ffffff',
    fontSize: 15,
    color: '#3ab6ae',
  },
});
