import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Dimensions, View, StatusBar, Text, ActivityIndicator, TouchableOpacity, SafeAreaView, ScrollView, } from 'react-native';
import { useLocalSearchParams } from 'expo-router';  // Hook to get route parameters
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import RowDettagliLinea from '@/components/utils/RowLineaBus';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import MapView, { Geojson, PROVIDER_GOOGLE } from 'react-native-maps';
import { fetchPercorso } from '@/service/request';

const { width: screenWidth } = Dimensions.get('window');

const DettagliLinea = () => {
  // Get parameters from the route
  const { coloreBackground, numLinea, partenza, arrivo } = useLocalSearchParams();

  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    fetchGeojson();
  }, []);
  // Funzione per caricare il file GeoJSON dall'URL
  const fetchGeojson = async () => {
    try {
      const filePercorso = await fetchPercorso(numLinea);
      setGeojsonData(filePercorso);
    } catch (error) {
      console.error('Errore nel caricamento del GeoJSON:', error);
    }
  };
  return (
    <>
      {/* Configurazione della StatusBar */}
      <StatusBar
        barStyle="light-content" // Cambia il colore del testo e delle icone della barra di stato
        backgroundColor="#132A68" // Imposta lo sfondo della barra di stato
      />
      {/* View fissa per logo e titolo */}
      <View style={styles.fixedHeader}>
        <View style={styles.containerLogoText}>
          <Image source={require('@/assets/images/logoConTesto.png')} style={styles.logo} />
          <ThemedView style={styles.textTitoloPaginaOverlay}>
            <ThemedText type="title" lightColor="white" style={styles.TextTitoloPagina}>
              Linea {numLinea}
            </ThemedText>
          </ThemedView>
        </View>
      </View>
      {/* //@ts-ignore */}
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <RowDettagliLinea     //@ts-ignore
            coloreBackground={coloreBackground}  //@ts-ignore
            arrivo={arrivo} //@ts-ignore
            partenza={partenza} //@ts-ignore
            numLinea={numLinea}
            type={2} />

          <View style={styles.separator} />
          <ThemedView style={styles.textTitoloPercorso}>
            <ThemedText type="title" darkColor="#132A68" lightColor='#132A68' style={styles.TextTitoloPagina}>
              Percorso
            </ThemedText>
          </ThemedView>
          <MapView
            provider={PROVIDER_GOOGLE}
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
          <View style={styles.separator} />
          <ThemedView style={styles.textTitoloCercaBus}>
            <ThemedText type="title" darkColor="#132A68" lightColor='#132A68' style={styles.TextTitoloPagina}>
              Cerca il tuo Bus
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.textTitoloCercaBus}>
            <ThemedText type="title" darkColor="#132A68" lightColor='#132A68' style={styles.TextTitoloPagina}>
              Cerca il tuo Bus
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.textTitoloCercaBus}>
            <ThemedText type="title" darkColor="#132A68" lightColor='#132A68' style={styles.TextTitoloPagina}>
              Cerca il tuo Bus
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.textTitoloCercaBus}>
            <ThemedText type="title" darkColor="#132A68" lightColor='#132A68' style={styles.TextTitoloPagina}>
              Cerca il tuo Bus
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.textTitoloCercaBus}>
            <ThemedText type="title" darkColor="#132A68" lightColor='#132A68' style={styles.TextTitoloPagina}>
              Cerca il tuo Bus
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.textTitoloCercaBus}>
            <ThemedText type="title" darkColor="#132A68" lightColor='#132A68' style={styles.TextTitoloPagina}>
              Cerca il tuo Bus
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.textTitoloCercaBus}>
            <ThemedText type="title" darkColor="#132A68" lightColor='#132A68' style={styles.TextTitoloPagina}>
              Cerca il tuo Bus
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.textTitoloCercaBus}>
            <ThemedText type="title" darkColor="#132A68" lightColor='#132A68' style={styles.TextTitoloPagina}>
              Cerca il tuo Bus
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.textTitoloCercaBus}>
            <ThemedText type="title" darkColor="#132A68" lightColor='#132A68' style={styles.TextTitoloPagina}>
              Cerca il tuo Bus
            </ThemedText>
          </ThemedView>



        </ScrollView>
      </SafeAreaView>
    </>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 118,
    backgroundColor: '#fff',
    padding: 5,
    /*    padding: 5,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        marginTop: 120 */
  },
  scrollView: {

  },
  textTitoloPercorso: {
    alignItems: 'flex-start',
    backgroundColor: 'transparent'
  },
  textTitoloCercaBus: {
    alignItems: 'flex-end',
    backgroundColor: 'transparent'
  },
  text: {
    fontSize: 20,
    marginVertical: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#132A68',
    paddingTop: 25, // Adjust based on the status bar height
    paddingBottom: 8,
    paddingHorizontal: 10,
  },
  containerTrattini: {
    width: screenWidth,
    bottom: 35,
  },
  containerLogoText: {
    width: '100%',
    flex: 1,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textTitoloPaginaOverlay: {
    marginRight: 0,
    color: 'white',
    backgroundColor: 'transparent',
  },
  TextTitoloPagina: {
    fontSize: 30,
    textAlign: 'center',
  }, logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  separator: {
    height: 5, // Spessore della linea
    width: '100%',
    backgroundColor: '#d3d3d3', // Colore grigio (puoi cambiarlo)
    marginVertical: 10, // Distanza verticale tra gli elementi
    borderRadius: 10, // Bordi arrotondati
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 10, // Bordi arrotondati
    marginTop: 10,
    marginBottom: 0
  },
});

export default DettagliLinea;
