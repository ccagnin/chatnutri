import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Easing, Animated } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomHeaderLong from '../../../components/CustomHeaderLong';
import { useRoute } from '@react-navigation/native';
import Theme from '../../../constants/Theme';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Measurements: undefined;
  Payments: undefined;
};

type PlansNavigationProp = StackNavigationProp<RootStackParamList>;

interface PlansProps {
  navigation: PlansNavigationProp;
}

const Plans: React.FC<PlansProps> = ({ navigation }) => {
  const data = [
    {
      title: "Quero testar por 7 dias",
      value: "",
      screen: "MeasuresChat",
    },
    {
      title: "Semanal",
      value: "R$ 15/semana",
      screen: "Payments",
    },
    {
      title: "Mensal",
      value: "R$ 40/mês",
      screen: "Payments",
    },
    {
      title: "Anual",
      value: "R$ 350/ano",
      screen: "Payments",
    },
  ];

  const route = useRoute();
  const textOpacity = useState(new Animated.Value(0))[0];
  const translateY = useState(new Animated.Value(-200))[0];
  const name = (route.params as { name?: string }).name;
  const email = (route.params as { email?: string }).email;
  const password = (route.params as { password?: string }).password;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1500,
        easing: Easing.bezier(0.5, 0, 0.25, 1),
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1500,
        easing: Easing.bezier(0.5, 0, 0.25, 1),
        delay: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleItemPress = (screen: string) => {
    if (screen === 'MeasuresChat') {
      navigation.navigate('MeasuresChat', { screen: 'MeasuresChat', name, email, password });
    } else if (screen === 'Payments') {
      navigation.navigate('Payments');
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item.screen)}>
        <Icon name="circle" size={244} color={Theme.colors.primary} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.value}>{item.value}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomHeaderLong text={`Hora de escolher o seu plano:`} />
      </View>
      <View style={styles.carouselContainer}>
        <Animated.View style={{ opacity: textOpacity, transform: [{ translateY }] }}>
          <Carousel
            data={data}
            renderItem={renderItem}
            sliderWidth={300}
            itemWidth={300}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,

  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  item: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
    borderRadius: 10,
    marginTop: 314,
    width: "100%",
  },
  title: {
    fontSize: 24,
    marginVertical: 10,
    fontFamily: "Poppins-Bold",
    color: Theme.colors.lightBrown,
  },
  value: {
    fontSize: 32,
    color: Theme.colors.lightBrown,
    fontFamily: "Poppins-Bold",
  },
  carouselContainer: {
    flex: 1,
    alignItems: 'center', // Centraliza horizontalmente
    justifyContent: 'center', // Centraliza verticalmente
  },
});

export default Plans;
