import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Dimensions, View, StatusBar, Text, ActivityIndicator, TouchableOpacity, SafeAreaView, ScrollView, } from 'react-native';
import { useLocalSearchParams } from 'expo-router';  // Hook to get route parameters
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import RowDettagliLinea from '@/components/utils/RowLineaBus';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { fetchAllFermate, fetchPercorso } from '@/service/request';
import { IconaArrowBack, IconaMarkerFermata } from '@/components/utils/Icone';
import { useNavigation } from '@react-navigation/native';
import NavBar from '@/components/utils/navbar';

export default function MappaScreen() {

    const [dataFermate, setDataFermate] = useState(null);

    useEffect(() => {
        fetchFermate();
    }, []);
    // Funzione per caricare il file GeoJSON dall'URL
    const fetchFermate = async () => {
        try {
            const fermate = await fetchAllFermate();
            setDataFermate(fermate);
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
            <NavBar title='Fermate' />
            {/* //@ts-ignore */}
            <SafeAreaView style={styles.container}>
                <ScrollView >
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={{
                            latitude: 42.3498,
                            longitude: 13.3995,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}>
                        {/* Aggiunta dei Marker */}
                        {dataFermate && dataFermate.map((fermata) => {
                            return <Marker
                                key={fermata.id}
                                coordinate={{
                                    latitude: parseFloat(fermata.longitudine),
                                    longitude: parseFloat(fermata.latitudine),
                                }}
                                title={fermata.nome}
                                //@ts-ignore
                                description={`Autobus: ${fermata.autobus.map(bus => bus.nome).join(', ')}`}
                            >
                                <IconaMarkerFermata size={30} />
                            </Marker>
                        })}
                    </MapView>
                    {/* <ThemedView style={styles.textTitoloPercorso}>
                        <ThemedText type="title" darkColor="#132A68" lightColor='#132A68' style={styles.TextTitoloPagina}>
                            Lista
                        </ThemedText>
                    </ThemedView> */}
                </ScrollView>
            </SafeAreaView>
        </>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 100,
    },
    TextTitoloPagina: {
        fontSize: 30,
        textAlign: 'center',
        marginVertical: 5,
    },
    textTitoloPercorso: {
        alignItems: 'flex-start',
        marginLeft: 10,
        backgroundColor: 'transparent'
    },
    map: {
        width: '100%',
        height: 500,
        borderRadius: 10, // Bordi arrotondati
        marginTop: 0,
        marginBottom: 0
    },
});
