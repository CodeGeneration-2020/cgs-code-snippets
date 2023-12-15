import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import TrackPlayer, { useTrackPlayerProgress } from 'react-native-track-player';
​
import { Colors } from 'src/constants';
import { usePlayer } from 'src/provider';
​
const window = Dimensions.get('window');
​
interface Props {}
​
export const Position: React.FC<Props> = () => {
  const { track, isPlaying } = usePlayer();
  const { position, duration } = useTrackPlayerProgress();
​
  const width = useSharedValue(0);
​
  useEffect(() => {
    width.value = withTiming((position / duration) * 100, {
      duration: 1000,
      easing: Easing.linear,
    });
  }, [position, duration]);
​
  useEffect(() => {
    if (isPlaying) {
      TrackPlayer.updateOptions({
        stopWithApp: false,
      });
    }
  }, [isPlaying]);
​
  const opacity = interpolate(width.value, [0, 80], [1, 0]);
​
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
    opacity,
  }));
​
  return <Animated.View style={[styles.container, animatedStyle]} />;
};
​
const styles = StyleSheet.create({
  container: {
    top: -3,
    left: 0,
    height: 3,
    position: 'absolute',
    backgroundColor: Colors.primary,
  },
});
​
export default Position;
