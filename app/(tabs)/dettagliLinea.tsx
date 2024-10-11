import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, StatusBar, Text, ActivityIndicator, TouchableOpacity, SafeAreaView, ScrollView, } from 'react-native';
import { useLocalSearchParams } from 'expo-router';  // Hook to get route parameters
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import RowDettagliLinea from '@/components/utils/RowLineaBus';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import MapView, { Geojson, PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { fetchPercorso } from '@/service/request';
import { IconaArrowBack, IconaMarkerFermata } from '@/components/utils/Icone';
import NavBar from '@/components/utils/navbar';
import { Image } from 'expo-image';
import ListaFermate from '@/components/utils/ListaFermate';
import { useNavigation } from '@react-navigation/native';
import { Fermata } from '@/model/Type';
import { getAspectRatio } from '@/service/funcUtili';
import { useRouter } from 'expo-router';
import { inserisciPercorso, recuperaPercorso } from '@/service/database';

const { width: screenWidth } = Dimensions.get('window');


const DettagliLinea = () => {
  const navigation = useNavigation();
  // Get parameters from the route
  const { coloreBackground, numLinea, partenza, arrivo, listaFermate, linkImage } = useLocalSearchParams();
  const router = useRouter();

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const aspectRatio = getAspectRatio(String(numLinea));

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
      // Controlla se il percorso è già presente nel database
      // const percorsoDaDB = await recuperaPercorso(numLinea);
      var percorsoDaDB = false
      if (percorsoDaDB) {
        // Se il percorso esiste, imposta i dati direttamente
        console.log('Percorso Recuperaro dal DB')
        setGeojsonData(percorsoDaDB);
      } else {
        // Altrimenti, effettua la richiesta per ottenere il GeoJSON
        const filePercorso = await fetchPercorso(numLinea);
        //console.log('Percorso Recuperaro dal Internet')
        // inserisciPercorso(numLinea, filePercorso)
        setGeojsonData(filePercorso);
      }
    } catch (error) {
      console.error('Errore nel caricamento del GeoJSON:', error);
    }
  };


  const handlePressChangePage = (idFermata: string) => {

    // navigation.navigate('dettagliFermata', { idFermata });
    router.push({
      pathname: '/dettagliFermata',
      params: { idFermata, }
    });
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
            showsUserLocation={true}
            followsUserLocation={true}
            showsMyLocationButton={true}
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
                <Callout onPress={() => handlePressChangePage(fermata.id)}>
                  <TouchableOpacity style={{ width: 150 }} >
                    <ThemedText type='titoloInfoMarker' >{fermata.nome}</ThemedText>
                    <Text style={{ color: 'blue', fontWeight: 'bold' }}>Dettagli</Text>
                  </TouchableOpacity>
                </Callout>
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

          <ListaFermate fermate={parsedListaFermate} numLinea={numLinea} />


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
