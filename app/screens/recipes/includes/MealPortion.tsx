import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Theme from '../../../../constants/Theme';

const MealPortion = ({ portion }:any) => {
    return (
        <View style={styles.portions}>
            <Text style={styles.portionsText}>{portion}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    portions: {
        backgroundColor: Theme.colors.lightGreen,
        height: '45%',
        width: '28%',
        marginRight: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
    },
    portionsText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Theme.colors.primary,
    },
})

export default MealPortion;