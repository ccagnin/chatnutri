import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler'
import Theme from '../constants/Theme';

export default ({ props }: any) => {
    const navigation = useNavigation();
    const handleDayButtonClick = () => {
        navigation.navigate('WeekDay', { day: props, weekDay: props.day.replace('-feira', '').replace(':', '') });
    };

    return (
        <View style={styles.dayButton}>
            <TouchableOpacity onPress={() => handleDayButtonClick()}>
                <Text style={styles.dayText}>{props.day.replace('-feira', '').replace(':', '')}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    dayButton: {
        width: 360,
        height: 58,
        backgroundColor: Theme.colors.secondary,
        marginBottom: 10,
        color: Theme.colors.lightBrown,
        justifyContent: 'center',
        borderRadius: 20,
    },
    dayText: {
        marginLeft: 33,
        color: 'white',
        fontFamily: 'Poppins-Medium',
        fontSize: 20,
    }
});