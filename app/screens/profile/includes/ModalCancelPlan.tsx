import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { ApiStripe } from '../../../api/ApiManager';
import Theme from '../../../../constants/Theme';

const ModalCancelPlan = ({ isActive, setIsActive, subscriptionId }: any) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const cancelPlan = async () => {
        try {
            setLoading(true);
            const token = await SecureStore.getItemAsync('token');
            await ApiStripe.post('/cancel', { subscriptionId }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLoading(false);
            const name = await SecureStore.getItemAsync('name');
            const email = await SecureStore.getItemAsync('email');
            navigation.navigate('PaymentScreen', { name, email, isSignup:false });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const closeModal = () => {
        if (!loading) {
            setIsActive(false);
        }
    };

    return (
        <Modal animationType="slide" transparent={true} visible={isActive}>
            <TouchableOpacity style={{ flex: 1, zIndex: 9 }} onPress={closeModal} />
            <View style={styles.modalContainer}>
                <TouchableOpacity style={{ width: '100%', height: '10%', alignItems: 'center', justifyContent: 'center' }} onPressIn={closeModal}>
                    <View style={{ width: '40%', height: '20%', backgroundColor: '#ccc', borderRadius: 999 }} />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Você está prestes a cancelar o seu plano...</Text>
                    <Text style={{ fontSize: 16 }}>Deseja realmente fazer isso?</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <TouchableOpacity disabled={loading} onPress={closeModal} style={{ backgroundColor: Theme.colors.secondary, padding: 10, borderRadius: 5, width: '45%' }}>
                            {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white' }}>Não</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity disabled={loading} onPress={cancelPlan} style={{ backgroundColor: '#D4FFDC', padding: 10, borderRadius: 5, width: '45%' }}>
                            {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'black' }}>Sim, cancelar</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        height: '50%',
        width: '100%',
        backgroundColor: Theme.colors.primary,
        borderTopEndRadius: 45,
        borderTopStartRadius: 45,
        paddingHorizontal: 10,
    },
});

export default ModalCancelPlan;