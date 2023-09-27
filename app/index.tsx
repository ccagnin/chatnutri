import React, { useCallback } from 'react';
import { StyleSheet, View, Text, StatusBar, Image } from 'react-native';
import Theme from '../constants/Theme';
import Animated, { FadeIn, FadeInUp, FadeOut } from "react-native-reanimated";
import logo from '../assets/images/ChatNutri_logo.png'


// SplashScreen.preventAutoHideAsync();

const Page = () => {
  // const [fontsLoaded] = useFonts({
  //   regular: Poppins_400Regular,
  //   bold: Poppins_700Bold,
  //   medium: Poppins_500Medium,
  //   light: Poppins_100Thin_Italic,
  // });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);

  // if (!fontsLoaded) {
  //   return null;
  // }


  // const Stack = createNativeStackNavigator();

  const animationIn = FadeInUp.springify()
  .damping(30)
  .mass(5)
  .stiffness(10)
  .restDisplacementThreshold(0.1)
  .restSpeedThreshold(5);

  const animationOut = FadeOut.springify()

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View entering={animationIn} exiting={animationOut}>
        <Image style={styles.logo} source={logo} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',

  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 164,
    height: 189,
  },
});


export default Page;
