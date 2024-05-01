import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SkeletonLoader = ({ width, height, borderRadius }:any) => {
  const shimmerAnimation = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            width: width,
            height: height,
            borderRadius: borderRadius,
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shimmer: {
    backgroundColor: '#E0E0E0',
  },
});

export default SkeletonLoader;
