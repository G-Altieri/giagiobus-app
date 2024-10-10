import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, StatusBar, Text, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native'; import { useLocalSearchParams } from 'expo-router';
import NavBar from '@/components/utils/navbar';
import { fetchDettagliFermati } from '@/service/request'; // Funzione che recupera i dettagli
import { dettagliOrario, Fermata } from '@/model/Type';
import { sendPushNotificationToServer } from '@/service/request'; // Funzione di invio notifica
import { useNotification } from "@/context/NotificationContext";
import { IconaArrowBack, IconaBusStopFill } from '@/components/utils/Icone';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { getColorById } from '@/service/funcUtili';

const { width: screenWidth } = Dimensions.get('window');

const DettagliLinea = () => {
  const { idFermata } = useLocalSearchParams();
  const [fermata, setFermata] = useState<Fermata | null>(null);
  const [loading, setLoading] = useState(true);
  const { expoPushToken } = useNotification();
  const [modalVisible, setModalVisible] = useState(false); // Stato per la visibilità del modale

  // Funzione per ottenere i dettagli della fermata
  const getDettagliFermata = async () => {
    try {
      const dettagli = await fetchDettagliFermati(idFermata);
      setFermata(dettagli);
      setLoading(false);
    } catch (error) {
      console.error('Errore nel caricamento dei dettagli della fermata:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDettagliFermata();
  }, [idFermata]);

  // Funzione per gestire il click sugli orari
  const handleSendNotification = (orario: string, nomeBus: string) => {
    const title = `Il tuo Bus delle ${orario.slice(0, 5)} sta arrivando`;
    const body = `Non dimenticare di prepararti! L'autobus ${nomeBus} è in arrivo per te.`;

    sendPushNotificationToServer(title, body, expoPushToken);  // Invia la notifica con titolo e contenuto dinamici
    setModalVisible(true); // Mostra il modale dopo aver inviato la notifica
  };

  // Funzione per ottenere tutti gli orari da tutti gli autobus
  const getAllOrari = () => {
    if (!fermata) return [];

    const allOrari = fermata.autobus.flatMap((autobus) =>
      autobus.orari.map((orario) => ({
        orario: orario.orario.slice(0, 5), // Solo le prime 5 cifre (HH:MM)
        arrivo: orario.arrivo,
        nomeBus: autobus.nome,
        colore: getColorById(autobus.nome) // Aggiungi il colore per il bus
      }))
    );

    // Ottieni l'orario attuale
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Dividi gli orari in due gruppi: futuri e passati
    const orariFuturi = allOrari
      .filter((orario) => orario.orario > currentTime)
      .sort((a, b) => {
        const [oreA, minutiA] = a.orario.split(':').map(Number);
        const [oreB, minutiB] = b.orario.split(':').map(Number); //@ts-ignore
        return new Date(0, 0, 0, oreA, minutiA) - new Date(0, 0, 0, oreB, minutiB);
      });

    const orariPassati = allOrari
      .filter((orario) => orario.orario <= currentTime)
      .sort((a, b) => {
        const [oreA, minutiA] = a.orario.split(':').map(Number);
        const [oreB, minutiB] = b.orario.split(':').map(Number); //@ts-ignore
        return new Date(0, 0, 0, oreA, minutiA) - new Date(0, 0, 0, oreB, minutiB);
      });

    // Unisci i due gruppi: futuri seguiti dai passati
    return [...orariFuturi, ...orariPassati];
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#132A68" />
      <NavBar title={fermata ? 'Fermata' : 'Caricamento...'} />

      <SafeAreaView style={styles.container}>
        <ScrollView>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            fermata && (
              <View>
                <View style={styles.section}>
                  <IconaBusStopFill size={40} />
                  <ThemedText type='title2' >{fermata.nome}</ThemedText>

                </View>

                <View style={styles.separator} />

                <Text style={styles.descrizioneText}>Seleziona un bus e ti ricordiamo noi!</Text>

                <View style={styles.contanierOrari}>
                  {getAllOrari().map((orario, index) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.5}
                      style={styles.containerElementoOrario}
                      onPress={() => handleSendNotification(orario.orario, orario.nomeBus)} // Associa la funzione di notifica al click
                    >
                      <Text style={styles.orarioText}>{orario.orario}</Text>
                      <IconaArrowBack size={30} color={Colors.primario} style={styles.arrow} />
                      <Text style={styles.orarioText}>{orario.arrivo}</Text>
                      <View style={[styles.contanierNumero, { backgroundColor: orario.colore }]}>
                        <Text style={styles.numText}>{orario.nomeBus}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Modale di conferma */}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => setModalVisible(false)} // Chiudi il modale con il tasto indietro
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalText}>Notifica registrata con successo!</Text>
                      <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButtonText}>X</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>

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
    paddingHorizontal: 5,
  },
  section: {
    marginTop: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section2: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  contanierOrari: {
    flexDirection: 'column',
    paddingHorizontal: 15,
  },
  arrow: {
    //backgroundColor:'red',
    marginVertical: -4,
    transform: [{ scaleX: -1 }],
  },
  containerElementoOrario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    width: '100%', // Imposta la larghezza del contenitore al 100%
    borderColor: '#132A68',
    borderWidth: 3,
    borderRadius: 23,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 1
  },
  contanierNumero: {
    borderRadius: 10,
    backgroundColor: 'red',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35
  },
  numText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
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
  separator: {
    height: 3, // Spessore della linea
    width: '100%',
    backgroundColor: '#d3d3d3', // Colore grigio (puoi cambiarlo)
    marginVertical: 10, // Distanza verticale tra gli elementi
    borderRadius: 10, // Bordi arrotondati
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
  orariGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Dispone i pulsanti in più righe
    justifyContent: 'space-between',
  },
  orarioButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 8,
    width: '30%', // Imposta una larghezza del 30% per i pulsanti nella griglia
    alignItems: 'center',
  },
  orarioText: {
    color: Colors.primario,
    fontSize: 20,
    fontWeight: 'bold',
  },
  descrizioneText: {
    color: Colors.primario,
    fontSize: 20,
    fontWeight: '500',
    marginHorizontal: 'auto',
    marginBottom: 10
  },
  // Stili per il modale
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Sfondo semi-trasparente
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'green', // Colore verde del modale
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
  },  
});

export default DettagliLinea;
