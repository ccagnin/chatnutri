import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Easing, Animated, Alert } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomHeaderLong from '../../../components/CustomHeaderLong';
import { useRoute } from '@react-navigation/native';
import Theme from '../../../constants/Theme';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { usePayment } from '../../utils/paymentsMethodsStripe';

const Plans = [
  {
    id: 1,
    title: 'Semanal',
    value: 'R$ 15/semana',
    screen: 'Payments',
    price: 15,
    frequency_type: 'days',
    frequency: '7',
    price_id: 'price_1Or2MeJb0HiN0pQ4TbG4eMiT'
  },
  {
    id: 2,
    title: 'Mensal',
    value: 'R$ 40/mês',
    screen: 'Payments',
    price: 40,
    frequency_type: 'months',
    frequency: '1',
    price_id: 'price_1Or2MeJb0HiN0pQ4rYTyZuZm'
  },
  {
    id: 3,
    title: 'Anual',
    value: 'R$ 350/ano',
    screen: 'Payments',
    price: 399,
    frequency_type: 'months',
    frequency: '12',
    price_id: 'price_1Or2MeJb0HiN0pQ4j8pwoBzv'
  },
];

const textOpacity = new Animated.Value(0);
const translateY = new Animated.Value(-200);

function PlansScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [plan, setPlan] = useState(null); // Inicialize plan como null
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true); // Adicione um novo estado para rastrear quando os dados do usuário estão carregando

  const payment = usePayment(plan, name, email); // Inicialize payment como null

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      const storedName = await SecureStore.getItemAsync('name');
      const storedEmail = await SecureStore.getItemAsync('email');
      if (isMounted) {
        setName(storedName);
        setEmail(storedEmail);
        setLoading(false); // Defina loading como false depois que os dados do usuário são recuperados
        const payment = usePayment(plan, storedName, storedEmail); // Inicialize payment com os dados do usuário
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleItemPress = async (planId: number) => {
    console.log(`Item pressionado: ${planId}`);
    const selectedPlan = Plans.find((p) => p.id === planId);
    if (selectedPlan) {
      console.log(`Plano selecionado: ${selectedPlan.title}`);
      console.log(`Iniciando assinatura para priceId: ${selectedPlan.price_id}`);
      const storedName = await SecureStore.getItemAsync('name');
      console.log(`Nome armazenado: ${storedName}`);
      const storedEmail = await SecureStore.getItemAsync('email');
      console.log(`Email armazenado: ${storedEmail}`);
      if (storedName && storedEmail) {
        setName(storedName);
        setEmail(storedEmail);
        setPlan(selectedPlan); // Atualize o estado do plano com o plano selecionado
        try {
          await payment.createSubscription();
          navigation.navigate('WeightInput', { screen: 'WeightInput' });
        } catch (error) {
          console.log('Erro ao criar assinatura:', error);
          Alert.alert('Erro ao criar assinatura', 'Ocorreu um erro ao criar a assinatura. Por favor, tente novamente.');
        }
      } else {
        console.log('Nome ou email não definidos');
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

  // if (loadingPayment) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Carregando...</Text>
  //     </View>
  //   );
  // }

  // if (!ready) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Preparando pagamento...</Text>
  //     </View>
  //   );
  // }

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
