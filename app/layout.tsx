import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Platform, Animated, Easing } from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import Theme from '../constants/Theme'
import NavBar from '../components/NavBar'

const Layout = ({ content, headerContent }) => {
    const translateY = useRef(new Animated.Value(-200)).current;
    const opacity = useRef(new Animated.Value(0)).current;

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
            <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
                <CustomHeader content={headerContent} />
            </Animated.View>
            <View style={styles.contentContainer}>
                <View style={styles.contentBody}>
                    {content && content}
                </View>
            </View>
            <NavBar />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    contentContainer: {
        flex: 1,
    },
    contentBody: {
        flex:1,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 50 : 10,
        paddingHorizontal: 20,
        backgroundColor: Theme.colors.primary,
        borderBottomStartRadius: 45,
        borderBottomEndRadius: 45,
        
    },
    textContainer: {
        flex: 1,
        alignItems: "center",
    },
    navBarContainer: {
        height: '7%',
    },
});

export default Layout;