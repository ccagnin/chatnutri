import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Theme from '../../../constants/Theme';

const NameEmail = ({ showform }) => {
    return (
        <View style={styles.constainerText}>
            <View>
                <Text style={styles.textName}>{showform.name}</Text>
            </View>
            <View>
                <Text style={styles.textEmail}>{showform.email}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    constainerText: {
        marginTop: '10%',
        alignItems: 'center',
    },
    textName: {
        color: Theme.colors.lightBrown,
        fontSize: 24,
        fontFamily: 'Poppins-Medium',
        fontWeight: 'bold',
    },
    textEmail: {
        color: 'white',
        fontSize: 16,
    },
})

export default NameEmail;