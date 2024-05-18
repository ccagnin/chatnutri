import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Animated, Easing, FlatList, Platform } from 'react-native';
import Theme from '../../../constants/Theme';
import { ApiManager } from '../../api/ApiManager';
import { isSunday } from 'date-fns';
import tempData from '../../utils/tempData';
import Layout from '../../layout';
import RenderDay from '../../../components/RenderDayList';

const Content = () => {
  const [loading, setLoading] = useState(true);
  const [weeklyMenu, setWeeklyMenu] = useState<any>(null);
  const translateY = useRef(new Animated.Value(-200)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const fetchWeeklyMenu = async () => {
    try {
      setLoading(true);
      // const token = await SecureStore.getItemAsync('token');
      // const response = await ApiManager.get('menu/weekly-menu', {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      // const weeklyMenu = response.data;
      // setWeeklyMenu(weeklyMenu);
      // setLoading(false);
      setTimeout(() => {
        const weeklyMenu = tempData;
        setWeeklyMenu(weeklyMenu);
        setLoading(false);
      }, 3000);
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
  }, [translateY, opacity]);

  const renderItem = ({ item }: any) => {
    return <RenderDay props={item} />;
  };

  const toArray = (data: any) => {
    return Object.entries(data).map(([day, meals]) => ({
      day,
      meals: Object.entries(meals).map(([meal, details]) => ({
        title: `${meal}`,
        ingredients: details.Ingredientes,
        macros: details['Macros:'],
        calories: details.Calorias,
      })),
    }));
  };

  const ordenByWeekDay = (dataArray: any) => dataArray.sort((a: any, b: any) => {
    const daysOfWeek = ['Segunda-feira:', 'Terça-feira:', 'Quarta-feira:', 'Quinta-feira:', 'Sexta-feira:', 'Sábado:', 'Domingo:'];
    return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
  });

  return (
    <View style={styles.cardapioContainer}>
      <Text style={styles.text}>Cardápio da semana:</Text>
      <FlatList
        data={weeklyMenu && ordenByWeekDay(toArray(weeklyMenu))}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const HomeRecepes = () => {
  return (
    <Layout content={<Content />} headerContent={null} />
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
});

export default HomeRecepes;
