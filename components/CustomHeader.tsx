import React, { useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Modal, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import Theme from '../constants/Theme';

function ModalLogout(props:any) {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if(isLoading){
      return
    }
    setIsLoading(true);
    await SecureStore.deleteItemAsync('token');
    props.setIsActive(false)
    navigation.navigate('Onboarding', { screen: 'Onboarding' });
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.isActive}
        onRequestClose={() => props.setIsActive(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Deseja realmente sair?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => props.setIsActive(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleLogout}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.modalButtonText}>Sim</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export const CustomHeader = ({ content }) => {
  const [isActive, setIsActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogout = () => {
    setIsActive(true)
  };
  
  const checkIfLoged = async () => {
    const token = await SecureStore.getItemAsync('token');
    if(token){
      setIsLoggedIn(true)
    }else{
      setIsLoggedIn(false)
    }
  }

  useEffect(() => {
    checkIfLoged()
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {isLoggedIn && <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={36} color="white" />
      </TouchableOpacity>}
      <View style={styles.content}>
        {content && content}
      </View>
      <ModalLogout isActive={isActive} setIsActive={setIsActive} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 132,
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomStartRadius: 45,
    borderBottomEndRadius: 45,

  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',

  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  btnLogout: {
    position: 'absolute',
    top: 20,
    right: -10,
  },
});