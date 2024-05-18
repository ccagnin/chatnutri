import React, { useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';

import Layout from '../../layout';
import TextHeader from '../../../components/TextHeader'

import ModalMeal from './includes/ModalMeal';
import renderItem from './includes/renderItem';

const HeaderContent = ({ day }:any) => {
    const dailyGoal = day.meals.reduce((prev:any, cur:any) => {
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

const Content = ({ day }:any) => {
    
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
})

export default Day;