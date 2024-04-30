import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';  // Importe o ícone

import Theme from '../constants/Theme';

const BottomNavigationBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { screen: 'EditProfile' });
  };

  const handleRecipes = () => {
    navigation.navigate('HomeRecepes', { screen: 'HomeRecepes' });
  };



  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Icon name="user" size={30} color="#004236" style={[styles.icon, route.name == 'EditProfile' && styles.selectedItem]} />
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRecipes}>
        <Icon name="book" size={30} color="#004236" style={[styles.icon, route.name == 'HomeRecepes' && styles.selectedItem]} />
        <Text style={styles.buttonText}>Receitas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRecipes}>
        <Icon name="calendar" size={30} color="#004236" style={styles.icon} />
        <Text style={styles.buttonText}>Refazer Plano</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Icon name="cutlery" size={30} color={route.name == 'WeekDay' && "white"} style={styles.icon} />
        <Text style={styles.buttonText}>Refeições</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.primary,
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
  },
  buttonText: {
    fontSize: 8,
    color: '#004236',
  },
  icon: {
    marginBottom: 5,
  },
  selectedItem: {
    color: 'white',
  },
});

export default BottomNavigationBar;
