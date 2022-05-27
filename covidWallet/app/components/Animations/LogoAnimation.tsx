import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const LogoAnimation = () => {

  // Constants
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(1.1));

  // UseEffects 
  React.useEffect(() => {
    handleAnimation();
  }, [])


  //Functions
  const handleAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.9,
          duration: 1000,
          delay: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        })
      ]),
      {
        iterations: 10
      }
    ).start()
  }

  const memoizedAnimation = useMemo(() => {
    console.log('RNNING...')
    return (
      <Animated.Image
        source={require('../../assets/gifs/launch_screen_logo.gif')}
        style={{
          width: 200,
          height: 60,
          transform: [
            {
              scale: animatedValue
            }
          ]
        }}
      />
    )
  }, [animatedValue])

  return (
    <View style={styles.zadaLogoStyle}>
      {memoizedAnimation}
    </View>
  );
}

const styles = StyleSheet.create({
  zadaLogoStyle: {
    position: "absolute",
    top: '46%',
  },
});

export default LogoAnimation;