import { StyleSheet } from 'react-native';
import { PRIMARY_COLOR } from '../theme/colors'

export const themeStyles = StyleSheet.create({
    primaryButton: {
        borderColor: PRIMARY_COLOR,
        borderWidth: 2,
        paddingTop: 10,
        paddingLeft: 20,
        paddingBottom: 10,
        paddingRight: 20,
        marginTop: 60
    }
});

