import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Theme from '../../../../constants/Theme';

import MealCard from './MealCard';

function renderItem({ item, handleActiveMeal }: any) {

    return (
        <View style={styles.mealContainer}>
            <View style={styles.headerMeal}>
                <Text style={styles.meal}>{item.title}</Text>
            </View>
            <MealCard snack={item} />
            <View style={{width: '100%', alignItems: 'center', position: 'absolute', bottom: '25%'}}>
                <View style={styles.seeMealContainer}>
                    <TouchableOpacity onPress={() => handleActiveMeal(item)}>
                        <Text style={styles.seeMealText}>Ver refeição</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerMeal: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    meal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Theme.colors.primary,
    },
    seeMealContainer: {
        position: 'absolute',
        backgroundColor: Theme.colors.lightGreen,
        borderRadius: 10,
        paddingHorizontal: 40,
        paddingVertical: 5,
        width: 160,

    },
    seeMealText: {
        color: Theme.colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    mealContainer: {
        width: '100%',
        minHeight: 200,
    },
})

export default renderItem;