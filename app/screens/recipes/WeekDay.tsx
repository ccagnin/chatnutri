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
    const [isExpanded, setIsExpanded] = useState(false);
    const height = useRef(new Animated.Value(0)).current;

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        Animated.timing(height, {
            toValue: isExpanded ? 0 : 200, // Altura final quando expandido
            duration: 300, // Duração da animação em milissegundos
            useNativeDriver: false, // useNativeDriver deve ser false para propriedades não suportadas pelo driver nativo
        }).start();
    };

    return (
        <View style={styles.cardCollapseContainer}>
            <View style={styles.mealCardContainer}>
                <MealCalories calories={185} />
                <View style={styles.portionsContainer}>
                    <MealPortion portion={snack['Macros:']['Carboidratos']} />
                    <MealPortion portion={snack['Macros:']['Gordura']} />
                    <MealPortion portion={snack['Macros:']['Proteínas']} />
                </View>

            </View>
            {/* <View>
                <Animated.View style={[styles.contentCollapse, { height }, { overflow: 'hidden' }]}>
                    <Text>Refeição</Text>
                </Animated.View>
                <View style={styles.buttonCollapseContainer}>
                    <TouchableOpacity onPress={toggleExpand} style={styles.buttonCollapse}>
                        <Text style={styles.buttonTextCollapse}>{isExpanded ? 'Fechar refeição' : 'Ver refeição'}</Text>
                    </TouchableOpacity>
                </View>
            </View> */}
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
    const { day } = route.params;
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
        // borderTopEndRadius: 20,
        // borderTopStartRadius: 20,
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
        flex:1,
    },
    cardCollapseContainer: {
        flexDirection: 'column',
    },
    buttonCollapseContainer: {
        flex: 1,
        alignItems: 'center',
    },
    buttonCollapse: {
        height: 26,
        backgroundColor: Theme.colors.lightGreen,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginTop: -12,
    },
    buttonTextCollapse: {
        color: Theme.colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    contentCollapse: {
        borderTopEndRadius: 0,
        borderTopStartRadius: 0,
        width: '100%',
        backgroundColor: Theme.colors.primary,
        padding: 20,
        borderRadius: 5,
    },
})

export default Day;