import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';  // Hook to get route parameters
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { fetchAllFermate } from '@/service/request';
import NavBar from '@/components/utils/navbar';
import * as Location from 'expo-location'; // Importa la libreria expo-location
import { IconaMarkerFermata } from '@/components/utils/Icone';
import MapViewDirections from 'react-native-maps-directions';

// Funzione per calcolare la distanza tra due coordinate geografiche
const getDistance = (lat1, lon1, lat2, lon2) => {
    console.log("Calcolando distanza tra", { lat1, lon1 }, "e", { lat2, lon2 });

    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Raggio della Terra in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distanza in km

    console.log("Distanza calcolata:", distance, "km");
    return distance;
};

export default function MappaScreen() {
    const [dataFermate, setDataFermate] = useState(null);
    const [userLocation, setUserLocation] = useState(null); // Stato per la posizione dell'utente
    const [closestFermata, setClosestFermata] = useState(null);
    const mapRef = useRef(null); // Referenza per il MapView

    const GOOGLE_MAPS_APIKEY = 'AIzaSyBJMWR_sULOIoKl5M5S6ZubRQgcNCtJ4Ss';

    useEffect(() => {
        console.log("useEffect triggered - fetching data...");
        fetchFermate();
        fetchUserLocation(); // Chiamata per ottenere la posizione dell'utente
    }, []);

    // Funzione per caricare il file GeoJSON dall'URL
    const fetchFermate = async () => {
        try {
            console.log("Fetching fermate...");
            const fermate = await fetchAllFermate();
            console.log("Fermate fetched:", fermate);
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
            findClosestFermata(userLoc);
        } catch (error) {
            console.error('Errore nel recuperare la posizione dell\'utente:', error);
        }
    };

    // Funzione per trovare la fermata più vicina all'utente
    const findClosestFermata = (userLoc) => {
        if (dataFermate && userLoc) {
            console.log("Finding closest fermata...");
            let minDistance = Infinity;
            let closest = null;

            dataFermate.forEach((fermata) => {
                const latFermata = parseFloat(fermata.latitudine);
                const lonFermata = parseFloat(fermata.longitudine);
                const distance = getDistance(
                    userLoc.latitude,
                    userLoc.longitude,
                    lonFermata,
                    latFermata
                );
                console.log(`Distanza dalla fermata ${fermata.nome} [lat: ${latFermata}, lon: ${lonFermata}]:`, distance, "km");

                if (distance < minDistance) {
                    minDistance = distance;
                    closest = fermata;
                }
            });

            console.log("Fermata più vicina:", closest);
            setClosestFermata(closest);
        } else {
            console.log("Dati non disponibili per calcolare la fermata più vicina.");
        }
    };

    // Funzione per spostare la mappa alla fermata più vicina
    const centerOnClosestFermata = () => {
        
        console.log("mappp:", mapRef.current);
        console.log("closestFermata:", closestFermata);
        if (closestFermata && mapRef.current) {
            console.log("Centrando sulla fermata più vicina:", closestFermata);
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

    return (
        <>
            {/* Configurazione della StatusBar */}
            <StatusBar
                barStyle="light-content" // Cambia il colore del testo e delle icone della barra di stato
                backgroundColor="#132A68" // Imposta lo sfondo della barra di stato
            />
            {/* View fissa per logo e titolo */}
            <NavBar title='Fermate' />
            {/* //@ts-ignore */}
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
                            //@ts-ignore
                            dataFermate.map((fermata) => {
                                return <Marker
                                    key={fermata.id}
                                    coordinate={{
                                        latitude: parseFloat(fermata.longitudine),
                                        longitude: parseFloat(fermata.latitudine),
                                    }}
                                    title={fermata.nome}
                                    description={`Autobus: ${fermata.autobus.map(bus => bus.nome).join(', ')}`}
                                // pinColor={fermata === closestFermata ? 'red' : 'green'} // Colore rosso per la fermata più vicina
                                >
                                    <IconaMarkerFermata size={40} />
                                </Marker>
                            })}

                        {/* Aggiunta della direzione tra utente e fermata più vicina */}
                        {/* {userLocation && closestFermata && (
                            <MapViewDirections
                                origin={{
                                    latitude:37.771707,
                                    longitude: -122.0054812,
                                }}
                                destination={{
                                    latitude:37.771707,
                                    longitude: -122.4053769,
                                }}
                                apikey={GOOGLE_MAPS_APIKEY}
                                strokeWidth={3}
                                strokeColor="blue"
                            />
                        )} */}
                    </MapView>
                    {/* Pulsante per centrare la mappa sulla fermata più vicina */}
                    <TouchableOpacity style={styles.button} onPress={centerOnClosestFermata}>
                        <Text style={styles.buttonText}>Mostra Fermata più Vicina</Text>
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
});

