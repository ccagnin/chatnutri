import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, FlatList, Alert, TouchableOpacity } from 'react-native';
import Theme from '../../../constants/Theme';
import { useRoute } from '@react-navigation/native';

import Layout from '../../layout';
import TextHeader from '../../../components/TextHeader'

const ModalMeal = (props: any) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.isActive}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                props.setIsActive(!props.isActive);
            }}>
            <TouchableOpacity style={{ flex: 1, zIndex: 9 }} onPress={() => props.setIsActive(false)}>

            </TouchableOpacity>
            <View style={styles.modalContainer}>
                <TouchableOpacity style={{ width: '100%', height: '10%', alignItems: 'center', justifyContent: 'center' }} onPressIn={() => props.setIsActive(false)}>
                    <View style={{ width: '40%', height: '20%', backgroundColor: '#ccc', borderRadius: 999 }}>
                    </View>
                </TouchableOpacity>
                <View style={styles.modalTextContainer}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{props.activeMeal && props.activeMeal.title}</Text>
                </View>
                <Text style={styles.modalTextItemsMacros}>Calorias: {props.activeMeal && props.activeMeal.calories} kcal</Text>
                <Text style={styles.modalTextItemsMacros}>Carboidratos: {props.activeMeal && props.activeMeal.macros && props.activeMeal.macros.Carboidratos}</Text>
                <Text style={styles.modalTextItemsMacros}>Gordura: {props.activeMeal && props.activeMeal.macros && props.activeMeal.macros.Gordura}</Text>
                <Text style={styles.modalTextItemsMacros}>Proteinas: {props.activeMeal && props.activeMeal.macros && props.activeMeal.macros['Proteínas']}</Text>
                <View>
                    <Text style={styles.modalTextItemsMacros}>Ingredientes: {props.activeMeal && props.activeMeal.ingredients}</Text>
                </View>
            </View>
        </Modal>
    )
}

const HeaderContent = ({ day }) => {
    
    const dailyGoal = day.meals.reduce((prev, cur) => {
        prev += cur.calories

        return prev
    }, 0)
    return (
        <View style={styles.headerContainer}>
            <TextHeader text={day.day.replace(':', '').replace('-feira', '') || ''} />
            <TextHeader text={`Sua meta diaria é`} />
            <TextHeader text={`${dailyGoal} calorias`} />
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

const Content = ({ day }) => {
    
    const [isActive, setIsActive] = useState(false)
    const [activeMeal, setActiveMeal] = useState({})

    const handleActiveMeal = (item: any) => {
        setActiveMeal(item)
        setIsActive(true)
    }
    return (
        <View style={styles.containerFlatList}>
            <FlatList
                data={day.meals}
                renderItem={({ item }) => renderItem({ item, handleActiveMeal })}
                keyExtractor={(item, index) => index.toString()}
            />
            <ModalMeal isActive={isActive} setIsActive={setIsActive} activeMeal={activeMeal} />
        </View>
    )
}

const Day = () => {
    const route = useRoute();
    const { day } = route.params;
    return (
        <Layout content={Content({ day })} headerContent={HeaderContent({ day })} />
    )
}

const styles = StyleSheet.create({
    containerFlatList: {
        flex: 1,
        marginBottom: 10,
        marginTop: 10,
    },
    headerContainer: {
        alignItems: 'center',
    },
    contentConteiner: {
        paddingHorizontal: 10,
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
    modalContainer: {
        height: '50%',
        width: '100%',
        backgroundColor: Theme.colors.primary,
        borderTopEndRadius: 45,
        borderTopStartRadius: 45,
        paddingHorizontal: 10,
    },
    modalTextContainer: {
        width: '100%',
        alignItems: 'center',
    },
    modalTextItemsMacros: {
        fontSize: 16,
        color: Theme.colors.lightGreen,
    }
})

export default Day;