import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'

import Theme from '../../../constants/Theme';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ApiManager } from '../../api/ApiManager';

import * as SecureStore from 'expo-secure-store';

function sendForm({ form }) {
    const token = SecureStore.getItemAsync('token');
    token.then((t) => {
        ApiManager.patch('users/profile/edit', form, {
            headers: {
                Authorization: `Bearer ${t}`,
                "Content-Type": "application/json",
            },
        })
            .then(r => {
                // console.log(r.data)
                //console.log('success')
            })
            .catch(e => {
                console.log(e.response.data)
            })
    })
}

const NameEmail = ({ showform }) => {
    const [form, setForm] = useState({ name: '', id: null });
    const [disabledName, setDisabledName] = useState(false);
    const inputRef = useRef(null)

    const handlerBlur = (setState) => {
        sendForm({ form })
        setState(false)
    }

    useEffect(() => {
        setForm({ name: showform.name, id: showform.id })
    }, [showform])

    const handlerFocus = ({ inputRef }) => {
        setDisabledName(true)
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }

    return (
        <View style={styles.constainerText}>
            <View style={styles.nameContainer}>
                <TextInput
                    ref={inputRef}
                    value={form.name}
                    style={styles.planInput}
                    placeholder={'Digite o nome'}
                    placeholderTextColor={Theme.colors.lightBrown}
                    onChangeText={(val) => setForm({ ...form, name: val })}
                    editable={disabledName}
                    onBlur={() => handlerBlur(setDisabledName)}
                />
                <Icon onPress={() => handlerFocus({ inputRef })} name="edit" size={26} color={Theme.colors.lightGreen} />
            </View>
            <View>
                <Text style={styles.textEmail}>{showform.email}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    constainerText: {
        marginTop: '12%',
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
    nameContainer: {
        flexDirection: 'row',
    },
    planInput: {
        width: 164,
        height: 35,
        borderRadius: 30,
        paddingHorizontal: '5%',
        color: Theme.colors.lightBrown,
        fontSize: 20,
        textAlign: 'center',
        marginEnd: '2%',
        marginLeft: '10%',
        borderWidth: 1,
        borderColor: 'white',
    },
})

export default NameEmail;