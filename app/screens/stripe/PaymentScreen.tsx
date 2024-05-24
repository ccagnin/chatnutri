import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { ApiManager } from '../../api/ApiManager';
import { usePayment } from '../../utils/usePayment';
import { useNavigation } from 'expo-router';
import { saveSubscription } from '../../utils/saveSubscription';
import Theme from '../../../constants/Theme';
import { ActivityIndicator, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-swiper';
import CustomHeaderLong from '../../../components/CustomHeaderLong';

type Plan = {
    priceId: string;
    title: string;
    value: string;
};

interface User {
    name: string;
    email: string;
    id: number;
}

const plans: Plan[] = [
    {
        priceId: 'price_1Or2MeJb0HiN0pQ4TbG4eMiT',
        title: 'Semanal',
        value: 'R$ 14,90',
    },
    {
        priceId: 'price_1Or2MeJb0HiN0pQ4rYTyZuZm',
        title: 'Mensal',
        value: 'R$ 39,90',
    },
    {
        priceId: 'price_1Or2MeJb0HiN0pQ4j8pwoBzv',
        title: 'Anual',
        value: 'R$ 399,90',
    },
];

const PaymentScreen = () => {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const navigation = useNavigation();
    const [token, setToken] = useState<string | null>("");

    useEffect(() => {
        const fetchUser = async () => {
            const token = await SecureStore.getItemAsync('token');
            console.log('Token:', token);
            setToken(token);
            if (!token) {
                console.error('Erro: token não encontrado');
                setLoading(false);
                return;
            }
            try {
                const response = await ApiManager.get('/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const name = user?.name || '';
    const email = user?.email || '';
    const userId = user?.id || -1;
    const saveUserId = SecureStore.setItemAsync('userId', userId.toString()); // Armazene o userId como uma string

    console.log('Usuário:',
        '\nNome:', name,
        '\nEmail:', email,
        '\nId:', userId
    );

    const { ready, loadingPayment, createSubscription, initPayment, subscriptionId } = usePayment({ name, email });

    const handleSaveSubscription = async () => {
        if (userId === -1 || subscriptionId === null) {
            console.error('Erro: userId ou subscriptionId é null');
            return;
        }

        console.log('Salvando inscrição para o usuário:', userId);
        try {
            await saveSubscription(subscriptionId, userId, token);
        } catch (error) {
            throw error;
        }
        console.log('Inscrição salva com sucesso!');
    };

    const handlePayment = async (plan: Plan) => {
        if (loading || paymentLoading) {
            console.log('Perfil do usuário ou folha de pagamento ainda está carregando.');
            return;
        }

        if (userId === -1) {
            console.error('Erro: userId é null');
            return;
        }

        setSelectedPlan(plan);
        setPaymentLoading(true);
        await initPayment(plan);

        if (ready) {
            try {
                const sub = await createSubscription();
                console.log('subscription', sub);
                await handleSaveSubscription();

                const status = await ApiManager.patch('change-subscription-status', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (status.status < 200 || status.status >= 300) {
                    console.error('Erro ao mudar o status da inscrição');
                    return;
                }

                const userIdKey = `isSubscribed_${userId}`; // Cria uma chave única para cada usuário
                await SecureStore.setItemAsync(userIdKey, 'true');
                console.log('Chave de inscrição salva com sucesso:', userIdKey);
                console.log('Pagamento realizado com sucesso!');
                navigation.navigate('HomeRecepes');
            } catch (error) {
                console.error('Erro ao criar a inscrição ou salvar a inscrição:', error);
            } finally {
                setPaymentLoading(false);
            }
        } else {
            console.log('Erro ao inicializar a folha de pagamento');
            setPaymentLoading(false);
        }
    };

    if (loading) {
        return <Text>Carregando...</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Animated.View style={styles.header}>
                    <CustomHeaderLong text="Hora de escolher o seu plano:" />
                </Animated.View>
            </View>
            <View style={styles.carouselContainer}>
                <Swiper>
                    {plans.map((plan) => (
                        <TouchableOpacity
                            key={plan.priceId}
                            style={styles.item}
                            onPress={() => handlePayment(plan)}
                            disabled={paymentLoading}
                        >
                            <Text style={styles.title}>{plan.title}</Text>
                            <Text style={styles.subtext}>7 dias de teste grátis!</Text>
                            <Text style={styles.value}>{plan.value}</Text>
                        </TouchableOpacity>
                    ))}
                </Swiper>
                {paymentLoading && <ActivityIndicator size="large" color={Theme.colors.primary} />}
            </View>
        </View>
    );
};

export default PaymentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
        flexDirection: 'column',
    },
    headerContainer: {
        width: '100%',
    },
    header: {
        paddingTop: 20,
        paddingHorizontal: 20,
        backgroundColor: Theme.colors.primary,
        borderBottomLeftRadius: 45,
        borderBottomRightRadius: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselContainer: {
        flex: 1,
        marginTop: 180,
        alignItems: 'center',
        justifyContent: 'center',
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
        fontFamily: 'Poppins-Bold',
        color: Theme.colors.lightBrown,
    },
    subtext: {
        fontSize: 16,
        color: Theme.colors.lightBrown,
        fontFamily: 'Poppins-Regular',
    },
    value: {
        fontSize: 32,
        color: Theme.colors.lightBrown,
        fontFamily: 'Poppins-Bold',
    },
    headerText: {
        color: Theme.colors.lightGreen,
        fontSize: 24,
        marginTop: 20,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
    },
    logo: {
        width: 50,
        height: 50,
    },
});
