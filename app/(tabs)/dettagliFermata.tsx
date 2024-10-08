import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, StatusBar, Text, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';  // Hook to get route parameters
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import NavBar from '@/components/utils/navbar';
import axios from 'axios';
import { fetchDettagliFermati } from '@/service/request'; // Assumendo che tu abbia definito questa funzione nel file request
import { Fermata } from '@/model/Type';

const { width: screenWidth } = Dimensions.get('window');


const DettagliLinea = () => {
  // Get parameters from the route
  const { idFermata } = useLocalSearchParams();
  const [fermata, setFermata] = useState<Fermata | null>(null); // Stato per i dettagli della fermata
  const [loading, setLoading] = useState(true); // Stato per indicare se i dati sono in fase di caricamento

  // Funzione per ottenere i dettagli della fermata
  const getDettagliFermata = async () => {
    try {
      const dettagli = await fetchDettagliFermati(idFermata); // Chiamata API
      console.log(dettagli)
      setFermata(dettagli); // Imposta lo stato con i dettagli della fermata
      setLoading(false); // Fine del caricamento
    } catch (error) {
      console.error('Errore nel caricamento dei dettagli della fermata:', error);
      setLoading(false); // Fine del caricamento anche in caso di errore
    }
  };

  // useEffect per chiamare la funzione quando il componente viene montato
  useEffect(() => {
    getDettagliFermata();
  }, [idFermata]);

  return (
    <>
      {/* Configurazione della StatusBar */}
      <StatusBar
        barStyle="light-content" // Cambia il colore del testo e delle icone della barra di stato
        backgroundColor="#132A68" // Imposta lo sfondo della barra di stato
      />

      {/* View fissa per logo e titolo */}
      <NavBar title={fermata ? fermata.nome : 'Caricamento...'} />
      {/* Mostra il nome della fermata se disponibile */}

      {/* SafeAreaView principale */}
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* Mostra un indicatore di caricamento finché i dati non sono stati caricati */}
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            fermata && (
              <View>
                {/* Dettagli della fermata */}
                <View style={styles.section}>
                  <Text style={styles.textTitolo}>{fermata.nome}</Text>
                  <Text style={styles.textInfo}>ID Fermata: {fermata.id}</Text>
                  <Text style={styles.textInfo}>
                    Coordinate: {fermata.latitudine}, {fermata.longitudine}
                  </Text>
                </View>

                {/* Divider */}
                <View style={styles.separator} />

                {/* Lista orari per ogni autobus che passa per la fermata */}
                <View style={styles.section}>
                  <Text style={styles.sottotitolo}>Autobus:</Text>
                  {fermata.autobus.map((autobus) => (
                    <View key={autobus.id} style={styles.autobusContainer}>
                      <Text style={styles.autobusNome}>{autobus.nome}</Text>
                      <Text style={styles.sottotitolo}>Orari:</Text>
                      {autobus.orari.map((orario, index) => (
                        <Text key={index} style={styles.orarioText}>
                          {orario} {/* Adatta il formato dell'orario se necessario */}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            )
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: '#fff',
    paddingHorizontal: 5
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  textTitolo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textInfo: {
    fontSize: 16,
    color: '#333',
  },
  busOrari: {
    marginTop: 10,
  },
  busNome: {
    fontSize: 18,
    fontWeight: '600',
  },
  busOrariText: {
    fontSize: 16,
    color: '#555',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#d3d3d3',
    marginVertical: 15,
  },
  TextTitoloPagina: {
    fontSize: 30,
    textAlign: 'center',
  },
  sottotitolo: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  autobusContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '100%',
  },
  autobusNome: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  orarioText: {
    fontSize: 16,
    color: '#555',
  },
});

export default DettagliLinea;
