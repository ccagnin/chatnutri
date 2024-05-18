import React from 'react';
import { StyleSheet, View } from 'react-native';
import Theme from '../../../../constants/Theme';

import MealCalories from './MealCalories';
import MealPortion from './MealPortion';

const MealCard = ({ snack }:any) => {
    return (
        <View>
            <View style={styles.mealCardContainer}>
                <MealCalories calories={snack.calories} />
                <View style={styles.portionsContainer}>
                    <MealPortion portion={snack.macros.Carboidratos} />
                    <MealPortion portion={snack.macros.Gordura} />
                    <MealPortion portion={snack.macros['Proteínas']} />
                </View>

            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    mealCardContainer: {
        minHeight: 140,
        paddingVertical: 20,
        backgroundColor: Theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 20,
        flexDirection: 'row',
    },
    portionsContainer: {
        flex: 1,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '5%',
    },
})

export default MealCard;