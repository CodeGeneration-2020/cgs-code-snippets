import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { COLORS, GOOGLE_API_KEY, SIZES } from '../../constants';
import { GoogleMapDirections } from 'react-native-google-maps-directions';
​
type OrderDeliveryMapProps = {
  mapRegion: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | undefined;
  destination: { latitude: number; longitude: number };
  origin: { latitude: number; longitude: number };
  updateOrigin: (loc: { latitude: number; longitude: number }) => void;
  updateDuration: (duration: number) => void;
};
​
const OrderDeliveryMap = ({
  mapRegion,
  destination,
  origin,
  updateOrigin,
  updateDuration,
}: OrderDeliveryMapProps) => {
  const mapViewRef = useRef<MapView>(null);
​
  const [carAngle, setCarAngle] = useState<number>(0);
​
  const calculateCarAngle = (coords: { latitude: number; longitude: number }[]) => {
    const [start, end] = coords;
    const deltaLat = start.latitude - end.latitude;
    const deltaLon = start.longitude - end.longitude;
​
    return Math.atan2(deltaLon, deltaLat) * (180 / Math.PI);
  };
​
  const onDirectionReady = (result: { coordinates: { latitude: number; longitude: number }[]; duration: number }) => {
    const { coordinates, duration } = result;
    updateDuration(duration);
​
    const [nextLoc] = coordinates;
​
    if (coordinates.length >= 2) {
      setCarAngle(calculateCarAngle(coordinates));
    }
​
    updateOrigin(nextLoc);
  };
​
  useEffect(() => {
    if (mapRegion) {
      mapViewRef.current?.animateToRegion(mapRegion, 200);
    }
  }, [mapRegion]);
​
  return (
    <View style={styles.container}>
      {mapRegion && (
        <MapView
          ref={mapViewRef}
          style={styles.map}
          initialRegion={mapRegion}
          showsUserLocation
          followsUserLocation
        >
          <GoogleMapDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeWidth={5}
            strokeColor={COLORS.primary}
            optimizeWaypoints
            onReady={result => onDirectionReady(result)}
          />
          <Marker coordinate={destination} title="Destination" />
          <Marker coordinate={origin} title="Origin" />
        </MapView>
      )}
    </View>
  );
};
​
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
​
export default OrderDeliveryMap;
