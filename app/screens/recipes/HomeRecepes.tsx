import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Platform, Button, Text, Modal, Animated, Easing } from 'react-native';
import Theme from '../../../constants/Theme';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ApiManager } from '../../api/ApiManager';
import LoadingScreen from '../loading/LoadingScreen';
import { isSunday } from 'date-fns';
import { TouchableOpacity } from 'react-native-gesture-handler'
import { CustomHeader } from '../../../components/CustomHeader'
import NavBar from '../../../components/NavBar'

import * as SecureStore from 'expo-secure-store';

import Layout from '../../layout';

const ModalDay = ({ props }) => {
  console.log(props.selectedDay)
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.isModalVisible}
      onRequestClose={() => {
        props.setModalVisible(!props.isModalVisible);
      }}
    >
      <View>
        <Text style={styles.cardapioTitle}>
          Cardápio para o dia {props.selectedDay?.day || ''}:
        </Text>
        <Text>Café da manhã: {props.selectedDay?.cafeDaManha || ''}</Text>
        <Text>Almoço: {props.selectedDay?.almoco || ''}</Text>
        <Text>Jantar: {props.selectedDay?.jantar || ''}</Text>
        <Button
          title="Fechar"
          onPress={() => {
            props.setModalVisible(!props.isModalVisible);
            props.setSelectedDay(null);
          }}
        />
      </View>
    </Modal>
  )
}

const RenderList = ({ props }) => {
  const navigation = useNavigation();
  const handleDayButtonClick = (index: any) => {
    props.setSelectedDay(props.weeklyMenu[index]);
    navigation.navigate('WeekDay', { day: props.selectedDay, weekDay: index.replace('-feira', '').replace(':', '')});
  };

  const list = []
  for (let i in props.weeklyMenu) {
    list.push(<View key={i} style={styles.dayButton}>
      <TouchableOpacity onPress={() => handleDayButtonClick(i)}>
        <Text style={styles.dayText}>{i.replace('-feira', '').replace(':', '')}</Text>
      </TouchableOpacity>
    </View>)
  }
  return list
}

const Content = () => {
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [weeklyMenu, setWeeklyMenu] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const translateY = useRef(new Animated.Value(-200)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const fetchWeeklyMenu = async () => {
    try {
      // const token = await SecureStore.getItemAsync('token');
      // const response = await ApiManager.get('menu/weekly-menu', {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      // const weeklyMenu = response.data;
      // setWeeklyMenu(weeklyMenu);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weekly menu:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyMenu();

    const intervalId = setInterval(() => {
      if (isSunday(new Date())) {
        fetchWeeklyMenu();
      }
    }, 86400000);

    //console.log(intervalId);

    return () => clearInterval(intervalId);
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
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1500,
        easing: Easing.bezier(0.5, 0, 0.25, 1),
        delay: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <>
      {loading && <LoadingScreen />}
      {!loading && weeklyMenu && (
        <>
          {/* <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
          <CustomHeader content={null} />
        </Animated.View> */}
          <View style={styles.cardapioContainer}>
            <Text style={styles.text}>Cardápio da semana:</Text>
            {RenderList({ props: { weeklyMenu, setSelectedDay, selectedDay } })}
          </View>
          {/* <NavBar /> */}
        </>
      )}
      {/* <ModalDay props={{ isModalVisible, selectedDay, setModalVisible, setSelectedDay }} /> */}
    </>
  )
}

const HomeRecepes = () => {


  return (
    <Layout content={Content()} headerContent={null} />
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    marginBottom: 20,
    color: Theme.colors.lightBrown,
    fontFamily: 'Poppins-Medium',
  },
  cardapioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    color: Theme.colors.lightBrown,
    flex: 1,
    marginBottom: 40,
  },
  cardapioTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    justifyContent: 'center',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    paddingHorizontal: 20,
    backgroundColor: Theme.colors.primary,
  },
  dayButton: {
    width: 360,
    height: 58,
    backgroundColor: Theme.colors.secondary,
    marginBottom: 10,
    color: Theme.colors.lightBrown,
    justifyContent: 'center',
    borderRadius: 20,
  },
  dayText: {
    marginLeft: 33,
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
  }
});

export default HomeRecepes;
