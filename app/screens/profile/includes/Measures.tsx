import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'

import Theme from '../../../../constants/Theme';
import { ApiManager } from '../../../api/ApiManager';
import Icon from 'react-native-vector-icons/FontAwesome5';

import * as SecureStore from 'expo-secure-store';

function sendMensures({ form }) {
    const token = SecureStore.getItemAsync('token');
    token.then((t) => {
        ApiManager.patch('users/measures/edit/' + form.measureId, form, {
            headers: {
                Authorization: `Bearer ${t}`,
                "Content-Type": "application/json",
            },
        })
            .then(r => {
                console.log(r.data)
                //console.log('success')
            })
            .catch(e => {
                console.log(e.response.data)
            })
    })
}

const Meansures = () => {
    const [form, setForm] = useState({
        userId: null,
        height: 0,
        updatedWeight: 0,
        measureId: null,
        age: null,
    });

    const heightRef = useRef(null);
    const initWeightRef = useRef(null);

    const [disabledInitWeight, setDisabledInitWeight] = useState(false);
    const [disabledheight, setDisabledheight] = useState(false);

    

    const handlerBlur = (setState) => {
        sendMensures({ form })
        setState(false)
    }

    const handlerFocus = ({ inputRef, setDisable }) => {
        setDisable(true)
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }

    useEffect(() => {
        const token = SecureStore.getItemAsync('token');
        token.then((t) => {
            ApiManager.get('users/measures/measure', {
                headers: {
                    Authorization: `Bearer ${t}`,
                },
            })
                .then(r => {

                    setForm({ userId: r.data.userId, measureId: r.data.measureId, age: r.data.age, height: r.data.height, updatedWeight: (r.data.initWeight ? r.data.initWeight : "") && r.data.updatedWeight ? r.data.updatedWeight : ""})
                })
        })
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.headerLabel}>Minhas medidas</Text>
            <View>
                <View style={[styles.row, styles.containerInput]}>
                    <Text style={styles.labelInput}>
                        Peso
                    </Text>
                    <View>
                        <TextInput
                            ref={initWeightRef}
                            value={form.updatedWeight?.toString()}
                            style={styles.planInput}
                            placeholder={'Digite o peso'}
                            placeholderTextColor={'#047460'}
                            onChangeText={val => setForm({ ...form, updatedWeight: Number(val) })}
                            editable={disabledInitWeight}
                            onBlur={() => handlerBlur(setDisabledInitWeight)}
                            keyboardType={'numeric'}
                        />
                        <Text style={styles.textInInput}>kg</Text>
                    </View>
                    <Icon onPress={() => handlerFocus({ inputRef: initWeightRef, setDisable: setDisabledInitWeight })} name="edit" size={26} color="#D4FFDC" />
                </View>
                <View style={[styles.row]}>
                    <Text style={styles.labelAltura}>
                        Altura
                    </Text>
                    <View>
                        <TextInput
                            ref={heightRef}
                            value={form.height?.toString()}
                            style={styles.planInput}
                            placeholderTextColor={'#047460'}
                            onChangeText={val => setForm({ ...form, height: Number(val) })}
                            editable={disabledheight}
                            onBlur={() => handlerBlur(setDisabledheight)}
                            keyboardType={'numeric'}
                        />
                        <Text style={styles.textInInput}>cm</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    row:{
        flexDirection: 'row',
    },
    containerInput: {
        justifyContent: 'space-between',
    },
    headerLabel: {
        color: Theme.colors.lightBrown,
        fontSize: 24,
        fontFamily: 'Poppins-Medium',
        fontWeight: 'bold',
        marginBottom: '10%',
    },
    labelAltura: {
        width: '29%',
        color: Theme.colors.lightBrown,
        fontSize: 24,
        fontFamily: 'Poppins-Medium',
        fontWeight: 'bold',
        marginBottom: '5%',
    },
    labelInput: {
        width: '25%',
        color: Theme.colors.lightBrown,
        fontSize: 24,
        fontFamily: 'Poppins-Medium',
        fontWeight: 'bold',
        marginBottom: '5%',
    },
    planInput: {
        width: 164,
        height: 35,
        borderRadius: 30,
        paddingHorizontal: '5%',
        backgroundColor: '#D4FFDC',
        color: '#047460',
        fontSize: 20,

        textAlign: 'center',
    },
    textInInput: {
        position: 'absolute',
        color: '#047460',
        fontSize: 18,
        right: '10%',
        bottom: '40%',
    }
})

export default Meansures;