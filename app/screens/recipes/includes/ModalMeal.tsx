import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';
import Theme from '../../../../constants/Theme';

const ModalMeal = (props: any) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.isActive}>
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

const styles = StyleSheet.create({
    calories: {
        backgroundColor: Theme.colors.lightGreen,
        width: 99,
        height: 99,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',

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

export default ModalMeal;