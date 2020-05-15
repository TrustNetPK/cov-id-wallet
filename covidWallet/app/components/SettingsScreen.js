import React, { useState } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import { TextTypeView, BooleanTypeView } from './ShowTypesView'

var settingLocalData = {
  GENERAL: {
    Agent: {
      value: 'Iphone',
      type: 'Text',
      key: '1'
    },
    Network: {
      value: 'Soverign Staging Network',
      type: 'Radio',
      key: '2',
      options: ['Soverign', 'non-soverign']
    },
    key: '1'
  },
  SECURITY: {
    'Bio-Metric Security': {
      value: true,
      key: '1',
      type: 'Boolean'
    },
    'Change Code': {
      value: 'None',
      key: '2',
      type: 'Link'
    },
    key: '2'
  },
  SUPPORT: {
    'Contact us': {
      value: 'None',
      type: 'Link',
      key: '1'
    },
    'license and  agreements': {
      value: 'None',
      type: 'Link',
      key: '2'
    },
    'about us': {
      value: 'None',
      type: 'Link',
      key: '3'
    },
    key: '3'
  }
}

export default function SettingsScreen () {
  const [settingsData, setSettingsData] = useState(settingLocalData)

  const toggleSwitch = (parent, child) => {
    const tempSettings = { ...settingsData }
    tempSettings[parent][child].value = !tempSettings[parent][child].value
    setSettingsData({ ...tempSettings })
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(settingsData)}
        renderItem={({ item }) => {
          const parent = item
          const parentData = settingsData[parent]
          return (
            <View>
              <Text style={styles.parentItem}>{parent}</Text>
              <FlatList
                data={Object.keys(parentData)}
                renderItem={({ item }) => {
                  const childData = settingsData[parent][item]
                  if (item !== 'key' && item !== '') {
                    if (childData.value !== 'None') {
                      if (childData.type === 'Text') {
                        return (
                          <TextTypeView startValue={item + ':  ' + childData.value} endValue='Edit' endIcon='' />
                        )
                      } else if (childData.type === 'Radio') {
                        return (
                          <TextTypeView startValue={item + ':  ' + childData.value} endIcon='right' />
                        )
                      } else if (childData.type === 'Boolean') {
                        return (
                          <BooleanTypeView
                            parentValue={parent}
                            startValue={item}
                            endValue={childData.value}
                            toChangeValue={childData.value}
                            valueHandler={toggleSwitch}
                          />
                        )
                      } else {
                        return (
                          <TextTypeView startValue={item + ':  ' + childData.value} endIcon='right' />
                        )
                      }
                    } else {
                      return (
                        <TextTypeView startValue={item} endValue='Edit' endIcon='right' />

                      )
                    }
                  }
                }}
              />
            </View>
          )
        }}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: '#f7f7f7'
  },
  parentItem: {
    flex: 1,
    margin: 5,
    marginTop: 20,
    backgroundColor: '#f7f7f7',
    fontSize: 15,
    color: '#6f6f6f'
  },
  childItem: {
    flex: 1,
    padding: 8,
    margin: 1,
    backgroundColor: '#ffffff',
    fontSize: 20,
    color: '#0f0f0f',
    borderRadius: 10
  }
})
