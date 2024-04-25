import React, { useRef, useEffect, useState } from 'react';
import { View, Button, StyleSheet, Platform, Animated, Easing, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomHeaderLong from '../../../components/CustomHeaderLong';
import { ApiManager } from '../../api/ApiManager';
import Theme from '../../../constants/Theme';

const ObjectiveSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const name = (route.params as { name?: string }).name;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [buttonsOpacity] = useState(new Animated.Value(0));
  const [textOpacity] = useState(new Animated.Value(0));

  const handleObjectiveSelection = (objective: number) => {
    navigation.navigate('WeightInput', {
      name,
      objective,
    });
  };

  useEffect(() => {
    const fadeIn = Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });
    const fadeButtons = Animated.timing(buttonsOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      delay: 500,
    });
    const fadeText = Animated.timing(textOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      delay: 500,
    });

    Animated.sequence([fadeText, fadeIn, fadeButtons]).start();

    return () => {
      opacity.setValue(0);
      buttonsOpacity.setValue(0);
      textOpacity.setValue(0);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
        <CustomHeaderLong text={`Bem vindo, ${name}!`} />
      </Animated.View>
      <Animated.View style={[styles.buttonContainer, { opacity: textOpacity }]}>
        <Animated.Text style={[styles.text, { opacity: opacity }]}>
          Qual é o seu objetivo?
        </Animated.Text>
        <Animated.View style={{ opacity: buttonsOpacity }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleObjectiveSelection(0)}
          >
            <Text style={styles.buttonText}>Ganho de Massa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleObjectiveSelection(1)}
          >
            <Text style={styles.buttonText}>Perda de Peso</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    paddingHorizontal: 20,
    backgroundColor: Theme.colors.background,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  button: {
    borderRadius: 20,
    backgroundColor: '#EB485C',
    paddingVertical: 15,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
    color: Theme.colors.lightBrown,
    textAlign: 'center',
    marginBottom: 20,
  }
});

export default ObjectiveSelectionScreen;
