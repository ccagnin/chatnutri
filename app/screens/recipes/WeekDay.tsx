import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Platform, Button, Text, Modal, Animated, Easing, ScrollView } from 'react-native';
import Theme from '../../../constants/Theme';
import { useRoute } from '@react-navigation/native';
import { ApiManager } from '../../api/ApiManager';
import LoadingScreen from '../loading/LoadingScreen';
import { isSunday } from 'date-fns';
import { TouchableOpacity } from 'react-native-gesture-handler'
import { CustomHeader } from '../../../components/CustomHeader'
import NavBar from '../../../components/NavBar'

import * as SecureStore from 'expo-secure-store';

import Layout from '../../layout';
import TextHeader from '../../../components/TextHeader'

const HeaderContent = () => {
    const route = useRoute();
    //const { weekDay } = route.params;
    const weekDay = "Segunda"
    return (
        <View style={styles.headerContainer}>
            <TextHeader text={weekDay || ''} />
            <TextHeader text={'Sua meta diaria é x calorias'} />
        </View>
    )
}

const MealCalories = ({ calories }) => {
    return (
        <View style={styles.calories}>
            <Text style={styles.caloriesText}>{calories}</Text>
            <Text style={styles.caloriesText}>kcal</Text>
        </View>
    )
}

const MealPortion = ({ portion }) => {
    return (
        <View style={styles.portions}>
            <Text style={styles.portionsText}>{portion}</Text>
        </View>
    )
}

const MealCard = ({ snack }) => {
    //console.log(snack['Macros:'])
    return (
        <View style={styles.mealCardContainer}>
            <MealCalories calories={185} />
            <View style={styles.portionsContainer}>
                <MealPortion portion={snack['Macros:']['Carboidratos']} />
                <MealPortion portion={snack['Macros:']['Gordura']} />
                <MealPortion portion={snack['Macros:']['Proteínas']} />
            </View>
        </View>
    )
}

const SnackList = ({ snacks }) => {
    const snacksList = []
    //console.log(snacks)
    for (let i in snacks) {
        snacksList.push(
            <View key={i} style={styles.mealContainer}>
                <View style={styles.headerMeal}>
                    <Text style={styles.meal}>{i}</Text>
                    {/* Time */}
                    <Text style={styles.mealHour}>Xh</Text>
                </View>
                <MealCard snack={snacks[i]} />
            </View>
        )
    }

    return snacksList
}

const Content = () => {
    const route = useRoute();
    //const { day } = route.params;
    const day = {
        "Almoço": {
            "Ingredientes": "Frango grelhado com quinoa e legumes cozidos",
            "Macros:": {
                "Carboidratos": "30g",
                "Gordura": "10g",
                "Proteínas": "40g",
            },
        },
        "Café da manhã": {
            "Ingredientes": "Omelete de claras com espinafre e queijo cottage",
            "Macros:": {
                "Carboidratos": "5g",
                "Gordura": "8g",
                "Proteínas": "25g",
            },
        },
        "Janta": {
            "Ingredientes": "Salada de folhas verdes com salmão grelhado",
            "Macros:": {
                "Carboidratos": "10g",
                "Gordura": "15g",
                "Proteínas": "30g",
            },
        },
    }
    return (
        <View style={styles.contentConteiner}>
            <ScrollView style={styles.scrollContainer}>
                {SnackList({ snacks: day })}
            </ScrollView>
        </View>
    )
}

const Day = () => {
    return (
        <Layout content={Content()} headerContent={HeaderContent()} />
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
    },
    contentConteiner: {
        marginVertical: '10%',
        flex: 1,
        alignItems: 'center',
    },
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
    mealHour: {
        fontSize: 20,
        color: Theme.colors.lightGreen,
    },
    mealContainer: {
        width: '100%',
        minHeight: 200,
    },
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
    portionsContainer: {
        flex: 1,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '5%',
    },
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
    scrollContainer: {
        width: '95%',
        marginBottom: '21%',
    }
})

export default Day;