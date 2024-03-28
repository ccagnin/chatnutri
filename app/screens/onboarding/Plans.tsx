import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Easing, Animated } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomHeaderLong from '../../../components/CustomHeaderLong';
import { useRoute } from '@react-navigation/native';
import Theme from '../../../constants/Theme';
import { useNavigation } from '@react-navigation/native';

const Plans = [
  {
    id: 1,
    title: 'Quero testar por 7 dias',
    value: '',
    screen: 'MeasuresChat',
  },
  {
    id: 2,
    title: 'Semanal',
    value: 'R$ 15/semana',
    screen: 'Payments',
    price: 15,
    frequency_type: 'days',
    frequency: '7',
    planId: '2c9380848bade28c018baf8157700138'
  },
  {
    id: 3,
    title: 'Mensal',
    value: 'R$ 40/mês',
    screen: 'Payments',
    price: 40,
    frequency_type: 'months',
    frequency: '1',
    planId: '2c9380848bade28c018baf80d78c0134'
  },
  {
    id: 4,
    title: 'Anual',
    value: 'R$ 350/ano',
    screen: 'Payments',
    price: 350,
    frequency_type: 'months',
    frequency: '12',
    planId: '2c9380848bade28c018baf811b3f0135'
  },
];

const textOpacity = new Animated.Value(0);
const translateY = new Animated.Value(-200);

function PlansScreen() {
  const route = useRoute();
  const name = (route.params as { name?: string }).name;
  const email = (route.params as { email?: string }).email;
  const password = (route.params as { password?: string }).password;
  const navigation = useNavigation();
  const [plan, setPlan] = useState(1);

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

  const handleItemPress = (planId: number) => {
    if (planId === 1) {
      navigation.navigate('MeasuresChat', { screen: 'MeasuresChat', name, email, password });
    } else {
      const selectedPlan = Plans.find((plan) => plan.id === planId);
      if (selectedPlan) {
        navigation.navigate('Payments', {
          screen: 'Payments',
          selectedPlan,
          name,
          email,
          password,
        });
      }
    }
  };


  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item.id)}>
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
            data={Plans}
            renderItem={renderItem}
            sliderWidth={300}
            itemWidth={300}
          />
        </Animated.View>
      </View>
    </View>
  );
}

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
    width: '100%',
  },
  title: {
    fontSize: 24,
    marginVertical: 10,
    fontFamily: 'Poppins-Bold',
    color: Theme.colors.lightBrown,
  },
  value: {
    fontSize: 32,
    color: Theme.colors.lightBrown,
    fontFamily: 'Poppins-Bold',
  },
  carouselContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlansScreen;
