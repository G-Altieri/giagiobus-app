import axios from 'axios';


//Funzione per il recupero delle linee degli autobus
export const fetchFromApiLineaBus = async () => {
  try {
    const response = await axios.get('https://giagiobus.altervista.org/api/listaAutobus.php');
    const dati = response.data;
    return dati;
  } catch (error) {
    console.error('Errore nella richiesta API:', error);
    return [];
  }
};


// Funzione per ottenere un file geojson in base al numero del percorso
//@ts-ignore
export const fetchPercorso = async (numero) => {
  try {
    const url = `https://giagiobus.altervista.org/api/percorsi/percorso_${numero}.geojson`;
    //console.log('Richiesta URL:', url);
    const response = await axios.get(url);
    //console.log('response:', response);
    const fileGeoJson = response.data;
    return fileGeoJson;
  } catch (error) {
    console.error('Errore nella richiesta API del percorso:', error);
    return null;
  }
};

// Funzione per ottenere tutte le fermate
export const fetchAllFermate = async () => {
  try {
    const response = await axios.get('https://giagiobus.altervista.org/api/fermateMappa.php');
    const fermate = response.data;
    return fermate;
  } catch (error) {
    console.error('Errore nella richiesta API delle fermate:', error);
    return [];
  }
};


// Funzione per ottenere i dettagli di una Fermata
//@ts-ignore
export const fetchDettagliFermati = async (numero) => {
  try {
    const url = `https://giagiobus.altervista.org/api/dettagliFermata.php?idfermata=${numero}`;
    //console.log('Richiesta URL:', url);
    const response = await axios.get(url);
    //console.log('response:', response);
    const fileGeoJson = response.data;
    return fileGeoJson;
  } catch (error) {
    console.error('Errore nella richiesta API del percorso:', error);
    return null;
  }
};

//INVIO NOTIFICHE
export const sendPushNotificationToServer = async (title: string, body: string, expoPushToken: any) => {
  try {

    // Controlla che il token sia disponibile
    if (!expoPushToken) {
      console.error("NOTIFICATION Expo Push Token is not available");
      return;
    }

    // Costruisci la richiesta con il titolo e il contenuto dinamici
    console.log('expo notification token', expoPushToken)
    const response = await fetch(`https://giagiobus.altervista.org/api/testNotifiche.php?expoToken=${expoPushToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,  // Il titolo dinamico
        body    // Il contenuto dinamico
      })
    });

    // Gestisci la risposta del server
    if (response.ok) {
      const data = await response.text();
      console.log("Server response:", data);
    } else {
      console.error("Error from server:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};