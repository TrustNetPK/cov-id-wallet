import { StyleSheet } from 'react-native';
import { PRIMARY_COLOR } from './Colors'

export const themeStyles = StyleSheet.create({
    primaryButton: {
        borderColor: PRIMARY_COLOR,
        borderWidth: 2,
        paddingTop: 10,
        paddingLeft: 20,
        paddingBottom: 10,
        paddingRight: 20,
        marginTop: 30
    },
    mainContainer: {
        flex: 1,
        padding: 10
    },
});

