import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Layout from '../../layout';
import TextHeader from '../../../components/TextHeader';
import logo from '../../../assets/images/logo.png';
import { ApiManager } from '../../api/ApiManager';
import * as SecureStore from 'expo-secure-store';
import Meansures from './includes/Measures';
import NameEmail from './includes/NameEmail';
import { useNavigation } from 'expo-router';
import checkAuth from '../../utils/checkAuth';

import PlanContent from './includes/PlanContent';

async function getSubscription(token: string | null) {
  try {
    const response = await ApiManager.get('/subscription', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response?.data);
  }
}

const HeaderContent = () => (
  <View style={styles.headerContainer}>
    <Image source={logo} />
    <TextHeader text={'Meu perfil'} />
  </View>
);

const Content = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({ id: null, name: null, email: null });
  const [subscription, setSubscription] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      console.log(token); // Adicione esta linha
      const response = await ApiManager.get('users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForm({ id: response.data.id, email: response.data.email, name: response.data.name });
      userGetSubscription(token);
    } catch (error) {
      console.error(error);
    }
  };

  const userGetSubscription = async (token: string | null) => {
    const response = await getSubscription(token);
    setSubscription(response);
    console.log(subscription);
  };

  useEffect(() => {
    checkAuth({ navigation });
    fetchProfile();
  }, [navigation]);

  useEffect(() => {
    console.log('useffecdt', subscription);
  }, [subscription]);

  return (
    <View style={styles.container}>
      <NameEmail showForm={form} />
      <View>
        {/* Edit Plan */}
        <PlanContent subscription={subscription} />
      </View>
      <View style={{ marginTop: '5%' }}>
        <Meansures />
      </View>
    </View>
  );
};

const EditProfile = () => {
  return (
    <Layout content={<Content />} headerContent={<HeaderContent />} />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '2%',
  },
  headerContainer: {
    alignItems: 'center',
  },
});

export default EditProfile;
