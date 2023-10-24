import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Platform, Button, Text, Modal, Animated, Easing } from 'react-native';
import Theme from '../../../constants/Theme';
import { useRoute } from '@react-navigation/native';
import { ApiManager } from '../../api/ApiManager';
import LoadingScreen from '../loading/LoadingScreen';
import { isSunday } from 'date-fns';
import { TouchableOpacity } from 'react-native-gesture-handler'
import { CustomHeader } from '../../../components/CustomHeader'
import NavBar from '../../../components/NavBar'

const HomeRecepes = () => {
  const route = useRoute();
  const { token, user } = route.params as { token: string; user: any };
  const [loading, setLoading] = useState(true);
  const [weeklyMenu, setWeeklyMenu] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const translateY = useRef(new Animated.Value(-200)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const fetchWeeklyMenu = async () => {
    try {
      const response = await ApiManager.get('menu/weekly-menu', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const weeklyMenu = response.data.weeklyMenu;
      setWeeklyMenu(weeklyMenu);
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

    console.log(intervalId);

    return () => clearInterval(intervalId);
  }, [token]);

  const handleDayButtonClick = (index: any) => {
    const selectedDayMenu = weeklyMenu[index];
    setSelectedDay(selectedDayMenu);
    setModalVisible(true);
  };

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
    <View style={styles.container}>
      {loading && <LoadingScreen />}

      {!loading && weeklyMenu && (
        <><Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
          <CustomHeader />
        </Animated.View>
        <View style={styles.cardapioContainer}>
          <Text style={styles.text}>Cardápio da semana:</Text>
            {weeklyMenu.map((day, index) => (
              <View key={index} style={styles.dayButton}>
                <TouchableOpacity onPress={() => handleDayButtonClick(index)}>
                  <Text style={styles.dayText}>{day.day}</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
        <NavBar /></>
      )}

      {selectedDay && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={isModalVisible}
          onRequestClose={() => {
            setModalVisible(!isModalVisible);
          }}
        >
          <View>
            <Text style={styles.cardapioTitle}>
              Cardápio para o dia {selectedDay.day}:
            </Text>
            <Text>Café da manhã: {selectedDay.cafeDaManha}</Text>
            <Text>Almoço: {selectedDay.almoco}</Text>
            <Text>Jantar: {selectedDay.jantar}</Text>
            <Button
              title="Fechar"
              onPress={() => {
                setModalVisible(!isModalVisible);
                setSelectedDay(null);
              }}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
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
    marginBottom: 35,

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
