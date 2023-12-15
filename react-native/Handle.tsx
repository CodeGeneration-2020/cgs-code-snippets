import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

const WIDTH = 300;
const HANDLE_HEIGHT = 50;
const MINI_CONTROL_WIDTH = 30;

interface Props {
  onMove: (percent: number) => void;
}

const Handle: React.FC<Props> = ({ onMove }: Props) => {
  const translationX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>(
    {
      onStart: (_, context) => {
        context.startX = translationX.value;
      },
      onActive: (event, context) => {
        translationX.value = context.startX + event.translationX;
        const percent = (translationX.value / (WIDTH - MINI_CONTROL_WIDTH)) * 100;
        onMove(percent);
      },
      onEnd: () => {
        translationX.value = withSpring(0);
      },
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translationX.value }],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.container, animatedStyle]} />
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    width: MINI_CONTROL_WIDTH,
    height: HANDLE_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99,
    backgroundColor: 'blue',
  },
});

export default Handle;
