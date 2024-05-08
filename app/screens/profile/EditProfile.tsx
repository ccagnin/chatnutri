import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, TextInput, Modal, TouchableOpacity, ActivityIndicator } from 'react-native'

import Layout from '../../layout'
import TextHeader from '../../../components/TextHeader'
import logo from '../../../assets/images/logo.png';
import Theme from '../../../constants/Theme';
import { ApiManager } from '../../api/ApiManager';

import * as SecureStore from 'expo-secure-store';

import Meansures from './Measures';
import NameEmail from './NameEmail';

import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from 'expo-router';

import checkAuth from '../../utils/checkAuth';


const HeaderContent = () => {
  return (
    <View style={styles.headerContainer}>
      <Image source={logo} />
      <TextHeader text={'Meu perfil'} />
    </View>
  )
}

async function getSubscription(token: any, userId: any) {
  try {
    return await ApiManager.get(`/subscription`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {

    console.log(error.response.data);
  }
}

const ModalCalcelPlan = (props: any) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false)
  const cancelPlan = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await ApiManager.post('/cancel', {subscriptionId: props.subscriptionId}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false)
      // Redirect to the initial screen
      navigation.navigate('Auth', {});
    } catch (error) {
      console.error(error);
    }
    setLoading(true)
    cancelPlan()
    // setTimeout(() => {
    //   setLoading(false)
    //   closeModal()
    // }, 2000);
  };

  const closeModal = () => {
    if (!loading) {
      props.setIsActive(false)
    }
  }


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.isActive}>
      <TouchableOpacity style={{ flex: 1, zIndex: 9 }} onPress={() => closeModal()}>

      </TouchableOpacity>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={{ width: '100%', height: '10%', alignItems: 'center', justifyContent: 'center' }} onPressIn={() => closeModal()}>
          <View style={{ width: '40%', height: '20%', backgroundColor: '#ccc', borderRadius: 999 }}>
          </View>
        </TouchableOpacity>
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Você esta prestes a cancelar o seu plano...</Text>
          <Text style={{ fontSize: 16 }}>Deseja realmente fazer isso?</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <TouchableOpacity disabled={loading} onPress={() => closeModal()} style={{ backgroundColor: Theme.colors.secondary, padding: 10, borderRadius: 5, width: '45%' }}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: 'white' }}>Não</Text>
              )}

            </TouchableOpacity>
            <TouchableOpacity disabled={loading} onPress={() => cancelPlan()} style={{ backgroundColor: '#D4FFDC', padding: 10, borderRadius: 5, width: '45%' }}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: 'black' }}>Sim, cancelar</Text>
              )}

            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const PlanContent = ({ subscription }: any) => {
  const navigation = useNavigation();
  const [isCancel, setCancel] = useState(false);
  
  return (
    <View style={styles.containerPlan}>
      <Text style={styles.textPlan}>Plano</Text>
      <View style={[styles.row, styles.containerInput]}>
        <View style={{ justifyContent: 'center' }}>
          {
            subscription == null ?
              <View>
                <ActivityIndicator size={26} color="white" style={{ position: 'absolute', backgroundColor: 'rgba(52, 52, 52, 0)' }} />
                <Icon name="trash" size={26} color="#D4FFDC50" style={{ marginEnd: 20 }} />
              </View> :
              subscription != "" ?
                <Icon onPress={() => { setCancel(true) }} name="trash" size={26} color="#D4FFDC" style={{ marginEnd: 20 }} /> :
                <Icon name="trash" size={26} color="#D4FFDC50" style={{ marginEnd: 20 }} />
          }
        </View>
        <Icon onPress={() => navigation.navigate('PaymentScreen', {})} name="edit" size={26} color="#D4FFDC" />
      </View>
      <ModalCalcelPlan isActive={isCancel} setIsActive={setCancel} subscriptionId={subscription} />
    </View>
  )
}

const Content = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    id: null,
    name: null,
    email: null,
  })

  const [plan, setPlan] = useState({ userID: null, planID: null, planName: '' })
  const [subscription, setSubscription] = useState(null)

  const fetchProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await ApiManager.get('users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForm({ id: response.data.id, email: response.data.email, name: response.data.name });
      userGetSubscription(token, response.data.id)
    } catch (error) {
      console.error(error);
    }
  };

  const userGetSubscription = async (token: any, userId: any) => {
    const response = await getSubscription(token, userId);
    setSubscription(response.data)
  }

  useEffect(() => {
    checkAuth({ navigation });
    fetchProfile();
  }, []);


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
  )
}

const EditProfile = () => {
  return (
    <Layout content={Content()} headerContent={HeaderContent()} />
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '2%',

  },
  headerContainer: {
    alignItems: 'center',
  },
  constainerText: {
    marginTop: '5%',
    alignItems: 'center',
  },
  textName: {
    color: Theme.colors.lightBrown,
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    fontWeight: 'bold',
  },
  textEmail: {
    color: 'white',
    fontSize: 16,
  },
  containerPlan: {
    marginTop: '5%',
    borderRadius: 20,
    backgroundColor: Theme.colors.secondary,
    width: '100%',
    height: 120,
    alignItems: 'center',
    paddingVertical: '5%',

  },
  textPlan: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: '2%',
  },
  planInput: {
    width: 200,
    height: 40,
    borderRadius: 30,
    paddingHorizontal: '5%',
    backgroundColor: '#B51A32',
  },
  row: {
    flexDirection: 'row',
  },
  containerInput: {
    width: '65%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    height: '50%',
    width: '100%',
    backgroundColor: Theme.colors.primary,
    borderTopEndRadius: 45,
    borderTopStartRadius: 45,
    paddingHorizontal: 10,
  },
})

export default EditProfile


