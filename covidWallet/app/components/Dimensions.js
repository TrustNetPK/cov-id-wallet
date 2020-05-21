//Dimensions.js
import {Dimensions} from 'react-native';
const {height, width} = Dimensions.get('window');

const actualDimensions =  {
  height:  (height<width) ? width : height,
  width: (width>height) ? height : width
};

export default actualDimensions;