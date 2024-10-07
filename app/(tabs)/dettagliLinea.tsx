import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, StatusBar, Text, ActivityIndicator, TouchableOpacity, SafeAreaView, ScrollView, } from 'react-native';
import { useLocalSearchParams } from 'expo-router';  // Hook to get route parameters
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import RowDettagliLinea from '@/components/utils/RowLineaBus';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import MapView, { Geojson, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { fetchPercorso } from '@/service/request';
import { IconaArrowBack, IconaMarkerFermata } from '@/components/utils/Icone';
import NavBar from '@/components/utils/navbar';
import { Image } from 'expo-image';
import ListaFermate from '@/components/utils/ListaFermate';

const { width: screenWidth } = Dimensions.get('window');

type Fermata = {
  id: string;
  nome: string;
  longitudine: string;
  latitudine: string;
  orari: string | null;
  ordine: string;
};

const DettagliLinea = () => {
  // Get parameters from the route
  const { coloreBackground, numLinea, partenza, arrivo, listaFermate, linkImage } = useLocalSearchParams();

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  // Funzione per ottenere l'aspect ratio in base al numero dell'autobus
  const getAspectRatio = (numLinea: string) => {
    switch (numLinea) {
      case '1':
        return 1811 / 2621; // Aspect ratio calcolato
      case '2':
        return 932 / 716;   // Aspect ratio calcolato
      case '4':
        return 934 / 1118;  // Aspect ratio calcolato
      default:
        return 1;           // Valore di default, se il numero non corrisponde
    }
  };

  const aspectRatio = getAspectRatio(numLinea);

  // Effettua il parsing di listaFermate se è una stringa
  let parsedListaFermate: Fermata[] = [];

  if (typeof listaFermate === 'string') {
    try {
      parsedListaFermate = JSON.parse(listaFermate) as Fermata[];
    } catch (e) {
      console.error('Errore nel parsing di listaFermate:', e);
    }
  } else if (Array.isArray(listaFermate)) {
    //@ts-ignore
    parsedListaFermate = listaFermate as Fermata[];
  }

  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    fetchGeojson();
  }, [numLinea]);
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
      <NavBar title={'Linea ' + numLinea} />

      {/* //@ts-ignore */}
      <SafeAreaView style={styles.container}>
        <ScrollView>
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
                strokeColor="#9e1139"   // Colore della linea
                fillColor="red"      // Colore di riempimento (per poligoni)
                strokeWidth={3}      // Spessore della linea
              />
            )}
            {parsedListaFermate && parsedListaFermate.map((fermata: Fermata) => (
              <Marker
                key={fermata.id}
                coordinate={{
                  latitude: parseFloat(fermata.longitudine),
                  longitude: parseFloat(fermata.latitudine),
                }}
                title={fermata.nome}
              >
                <IconaMarkerFermata size={40} color={fermata.nome == arrivo ? '#ffd700' : fermata.nome == partenza ? '#79e51c' : '#fff'} />
              </Marker>
            ))}
          </MapView>

          <View style={styles.separator} />

          <ThemedView style={styles.textTitoloCercaBus}>
            <ThemedText type="title" darkColor="#132A68" lightColor='#132A68' style={styles.TextTitoloPagina}>
              Cerca il tuo Bus
            </ThemedText>
          </ThemedView>

          <Image
            style={[styles.image, { aspectRatio }]}  // Applica aspectRatio dinamico
            source={linkImage}
            placeholder={{ blurhash }}
            contentFit="contain"
            transition={800}
          />

          <View style={styles.separator} />

          <ThemedView style={styles.textTitoloCercaFermata}>
            <ThemedText type="title" darkColor="#132A68" lightColor='#132A68' style={styles.TextTitoloPagina}>
              Cerca la tua Fermata
            </ThemedText>
          </ThemedView>

          <ListaFermate fermate={parsedListaFermate} numLinea={numLinea}/>


        </ScrollView>
      </SafeAreaView>
    </>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: '#fff',
    paddingHorizontal: 5
  },
  textTitoloPercorso: {
    alignItems: 'flex-start',
    backgroundColor: 'transparent'
  },
  textTitoloCercaBus: {
    alignItems: 'flex-end',
    backgroundColor: 'transparent'
  },
  textTitoloCercaFermata: {
    alignItems: 'flex-start',
    backgroundColor: 'transparent'
  },
  text: {
    fontSize: 20,
    marginVertical: 10,
  },
  TextTitoloPagina: {
    fontSize: 30,
    textAlign: 'center',
  },
  separator: {
    height: 3, // Spessore della linea
    width: '100%',
    backgroundColor: '#d3d3d3', // Colore grigio (puoi cambiarlo)
    marginVertical: 10, // Distanza verticale tra gli elementi
    borderRadius: 10, // Bordi arrotondati
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 10, // Bordi arrotondati
    marginTop: 5,
    marginBottom: 0
  },

  image: {
    width: '100%',
    resizeMode: 'contain', // Contiene l'immagine mantenendo le proporzioni
  },

});

export default DettagliLinea;
