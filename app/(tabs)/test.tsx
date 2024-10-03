import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Geojson } from 'react-native-maps';
import axios from 'axios';

export default function MappaScreen() {
  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    // Funzione per caricare il file GeoJSON dall'URL
    const fetchGeojson = async () => {
      try {
        const response = await axios.get('https://giagiobus.altervista.org/api/percorsi/percorsoTest.geojson');
        setGeojsonData(response.data);
      } catch (error) {
        console.error('Errore nel caricamento del GeoJSON:', error);
      }
    };

    fetchGeojson();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 42.3498,
          longitude: 13.3995,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {geojsonData && (
          <Geojson
            geojson={geojsonData}
            strokeColor="blue"   // Colore della linea
            fillColor="red"      // Colore di riempimento (per poligoni)
            strokeWidth={3}      // Spessore della linea
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
