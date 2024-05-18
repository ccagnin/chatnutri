import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Theme from '../../../../constants/Theme';


const MealCalories = ({ calories }:any) => {
    return (
        <View style={styles.calories}>
            <Text style={styles.caloriesText}>{calories}</Text>
            <Text style={styles.caloriesText}>kcal</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    calories: {
        backgroundColor: Theme.colors.lightGreen,
        width: 99,
        height: 99,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',

    },
    caloriesText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Theme.colors.primary,
    },
})

export default MealCalories;