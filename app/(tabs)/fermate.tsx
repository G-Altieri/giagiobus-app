import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';  // Hook to get route parameters
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { fetchAllFermate } from '@/service/request';
import NavBar from '@/components/utils/navbar';
import * as Location from 'expo-location'; // Importa la libreria expo-location
import { IconaMarkerFermata } from '@/components/utils/Icone';
import MapViewDirections from 'react-native-maps-directions';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { getDistance } from '@/service/funcUtili';
import { Fermata, UserLocation } from '@/model/Type';
import { GOOGLE_MAPS_APIKEY_DIRECTION } from '@/constants/Key';

export default function MappaScreen() {
    const [dataFermate, setDataFermate] = useState<Fermata[] | null>(null); // Specifica il tipo
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null); // Stato della posizione dell'utente
    const [closestFermata, setClosestFermata] = useState<Fermata | null>(null); // Stato della fermata più vicina
    const [travelTime, setTravelTime] = useState<number | null>(null); // Stato del tempo di viaggio
    const [loading, setLoading] = useState<boolean>(true); // Stato di caricamento
    const [buttonEnabled, setButtonEnabled] = useState<boolean>(false); // Stato del pulsante
    const mapRef = useRef<MapView | null>(null); // Riferimento per MapView
    const navigation = useNavigation();

    //Chiave Api Di Google per calcolare i percorsi 
    const GOOGLE_MAPS_APIKEY = GOOGLE_MAPS_APIKEY_DIRECTION || '';

    // Effettua il fetch delle fermate e la posizione utente all'inizio
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchFermate();
            await fetchUserLocation();
            setLoading(false);
            setButtonEnabled(true); // Abilita il pulsante quando tutto è caricato
        };

        fetchData();
    }, []);

    // Funzione per caricare il file GeoJSON dall'URL
    const fetchFermate = async () => {
        try {
            console.log("Fetching fermate...");
            const fermate = await fetchAllFermate();
            // console.log("Fermate fetched:", fermate);
            setDataFermate(fermate);
        } catch (error) {
            console.error('Errore nel caricamento del GeoJSON:', error);
        }
    };

    // Funzione per ottenere la posizione dell'utente
    const fetchUserLocation = async () => {
        try {
            console.log("Requesting location permissions...");
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permesso per l\'accesso alla posizione negato');
                return;
            }

            console.log("Getting current position...");
            let location = await Location.getCurrentPositionAsync({});
            const userLoc = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
            console.log("User location:", userLoc);
            setUserLocation(userLoc);
        } catch (error) {
            console.error('Errore nel recuperare la posizione dell\'utente:', error);
        }
    };

    // Funzione per trovare la fermata più vicina all'utente
    const findClosestFermata = () => {
        if (dataFermate && userLocation) {
            console.log("Finding closest fermata...");
            let minDistance = Infinity;
            let closest = null;

            dataFermate.forEach((fermata) => {
                const latFermata = parseFloat(fermata.latitudine);
                const lonFermata = parseFloat(fermata.longitudine);
                const distance = getDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    lonFermata,
                    latFermata
                );
                //console.log(`Distanza dalla fermata ${fermata.nome} [lat: ${latFermata}, lon: ${lonFermata}]:`, distance, "km");
                if (distance < minDistance) {
                    minDistance = distance;
                    closest = fermata;
                }
            });
            //console.log("Fermata più vicina:", closest);
            setClosestFermata(closest);
            if (closest) {
                centerOnClosestFermata(closest);
            }
        } else {
            console.log("Dati non disponibili per calcolare la fermata più vicina.");
        }
    };

    // Funzione per spostare la mappa alla fermata più vicina
    const centerOnClosestFermata = (closestFermata: Fermata) => {
        if (closestFermata && mapRef.current) {
            //  console.log("Centrando sulla fermata più vicina:", closestFermata);
            mapRef.current.animateToRegion({
                latitude: parseFloat(closestFermata.longitudine),
                longitude: parseFloat(closestFermata.latitudine),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        } else {
            console.log("Nessuna fermata più vicina trovata o mapRef non disponibile.");
        }
    };

    const handlePressChangePage = (idFermata: string) => {
        //@ts-ignore
        navigation.navigate('dettagliFermata', { idFermata });
    };

    return (
        <>
            {/* Configurazione della StatusBar */}
            <StatusBar
                barStyle="light-content" // Cambia il colore del testo e delle icone della barra di stato
                backgroundColor="#132A68" // Imposta lo sfondo della barra di stato
            />
            {/* View fissa per logo e titolo */}
            <NavBar title='Fermate' />
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={{
                            latitude: userLocation ? userLocation.latitude : 42.3498,
                            longitude: userLocation ? userLocation.longitude : 13.3995,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        showsUserLocation={true}
                        followsUserLocation={true}
                        showsMyLocationButton={true}
                    >
                        {/* Aggiunta dei Marker per le fermate */}
                        {dataFermate &&
                            dataFermate.map((fermata) => {
                                return <Marker
                                    key={fermata.id}
                                    coordinate={{
                                        latitude: parseFloat(fermata.longitudine),
                                        longitude: parseFloat(fermata.latitudine),
                                    }}
                                    title={fermata.nome}
                                >
                                    <IconaMarkerFermata size={40} />
                                    <Callout onPress={() => handlePressChangePage(fermata.id)}>
                                        <TouchableOpacity style={{ width: 150 }} >
                                            <ThemedText type='titoloInfoMarker' >{fermata.nome}</ThemedText>
                                            <Text>{`Autobus: ${fermata.autobus.map(bus => bus.nome).join(', ')}`}</Text>
                                            <Text style={{ color: 'blue', fontWeight: 'bold' }}>Dettagli</Text>
                                        </TouchableOpacity>
                                    </Callout>
                                </Marker>
                            })}

                        {/* Aggiunta della direzione tra utente e fermata più vicina */}
                        {userLocation && closestFermata && (
                            <MapViewDirections
                                origin={{
                                    latitude: userLocation.latitude,
                                    longitude: userLocation.longitude,
                                }}
                                destination={{
                                    latitude: parseFloat(closestFermata.longitudine),
                                    longitude: parseFloat(closestFermata.latitudine),
                                }}
                                apikey={GOOGLE_MAPS_APIKEY}
                                strokeWidth={3}
                                strokeColor="blue"
                                onReady={(result) => {
                                    console.log(`Durata del percorso: ${result.duration} minuti`);// @ts-ignore
                                    setTravelTime(result.duration);  // Imposta il tempo di viaggio in minuti
                                }}
                            />
                        )}
                    </MapView>
                    {/* Label per il tempo di viaggio */}
                    {travelTime !== null && (
                        <Text style={styles.travelTimeText}>
                            Tempo stimato a piedi: {Math.round(travelTime)} minuti
                        </Text>
                    )}
                    {/* Pulsante per trovare la fermata più vicina */}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: buttonEnabled ? '#132A68' : '#ccc' }]}
                        onPress={findClosestFermata}
                        disabled={!buttonEnabled}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Loading...' : 'Trova Fermata più Vicina'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 100,
    },
    map: {
        width: '100%',
        height: 500,
        borderRadius: 10,
        marginTop: 0,
        marginBottom: 0
    },
    button: {
        backgroundColor: '#132A68',
        padding: 15,
        borderRadius: 10,
        marginVertical: 20,
        alignItems: 'center',
        marginHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    travelTimeText: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 10,
        color: '#333',
    },
});
