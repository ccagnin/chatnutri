import React, { useState } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from 'expo-router';
import Theme from '../../../../constants/Theme';

import ModalCancelPlan from './ModalCancelPlan';

import * as SecureStore from 'expo-secure-store';

const PlanContent = ({ subscription }: any) => {
    const navigation = useNavigation();
    const [isCancel, setCancel] = useState(false);

    const handlerPayment = async () => {
      const name = await SecureStore.getItemAsync('name');
      const email = await SecureStore.getItemAsync('email');
      navigation.navigate('PaymentScreen', { name, email, isSignup: false });
    }
  
    return (
      <View style={styles.containerPlan}>
        <Text style={styles.textPlan}>Plano</Text>
        <View style={[styles.row, styles.containerInput]}>
          <View style={{ justifyContent: 'center' }}>
            {subscription === null ? (
              <View>
                <ActivityIndicator size={26} color="white" style={{ position: 'absolute', backgroundColor: 'rgba(52, 52, 52, 0)' }} />
                <Icon name="trash" size={26} color="#D4FFDC50" style={{ marginEnd: 20 }} />
              </View>
            ) : subscription !== '' ? (
              <Icon onPress={() => setCancel(true)} name="trash" size={26} color="#D4FFDC" style={{ marginEnd: 20 }} />
            ) : (
              <Icon name="trash" size={26} color="#D4FFDC50" style={{ marginEnd: 20 }} />
            )}
          </View>
          <Icon onPress={handlerPayment} name="edit" size={26} color="#D4FFDC" />
        </View>
        <ModalCancelPlan isActive={isCancel} setIsActive={setCancel} subscriptionId={subscription} />
      </View>
    );
  };

  const styles = StyleSheet.create({
    containerPlan: {
      marginTop: '5%',
      borderRadius: 20,
      backgroundColor: Theme.colors.secondary,
      width: '100%',
      height: 120,
      alignItems: 'center',
      paddingVertical: '5%',
    },
    textPlan: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 24,
      marginBottom: '2%',
    },
    row: {
      flexDirection: 'row',
    },
    containerInput: {
      width: '65%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  export default PlanContent;