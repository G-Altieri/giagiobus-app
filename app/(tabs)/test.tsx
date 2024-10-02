import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { insertCorse, findCorse } from '@/service/database';
import { fetchFromAPI } from '@/service/request';

const HomeScreen = () => {
    const [dati, setDati] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
             
                // Prova a recuperare i dati dal database
                const datiDB = await findCorse(); // Usa la funzione per trovare le corse
                if (datiDB.length > 0) {
                    console.log('ho uso i dati del db')
                    setDati(datiDB); // Usa i dati dal DB se esistono
                } else {
                    // Se il database è vuoto, fai la richiesta all'API
                    const datiAPI = await fetchFromAPI(); // Usa la funzione per recuperare i dati dall'API
                    await insertCorse(datiAPI); // Salva i dati nel DB
                    setDati(datiAPI); // Imposta i dati dalla API
                }
            } catch (error) {
                console.error('Errore nel recupero o salvataggio dei dati: ', error);
            } finally {
                setLoading(false); // Disattiva il caricamento
            }
        };

        fetchData();
    }, []);

    // Funzione per renderizzare una singola fermata
    const renderFermata = ({ item }) => (
        <View style={styles.fermataContainer}>
            <Text style={styles.fermataText}>Nome: {item.nome}</Text>
            <Text style={styles.fermataText}>Ordine: {item.ordine}</Text>
            <Text style={styles.fermataText}>Latitudine: {item.latitudine}</Text>
            <Text style={styles.fermataText}>Longitudine: {item.longitudine}</Text>
        </View>
    );

    // Funzione per renderizzare una singola corsa con le fermate
    const renderCorsa = ({ item }) => (
        <View style={styles.corsaContainer}>
            <Text style={styles.corsaTitle}>Corsa {item.nome}</Text>
            <Text>Partenza: {item.partenza}</Text>
            <Text>Arrivo: {item.arrivo}</Text>

            <FlatList
                data={item.fermate}  // Le fermate per ogni corsa
                renderItem={renderFermata}  // Renderizza ogni fermata
                keyExtractor={(fermata) => fermata.id.toString()}  // Chiave unica per ogni fermata
            />
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={dati}  // Array di corse
                renderItem={renderCorsa}  // Renderizza ogni corsa
                keyExtractor={(item) => item.id.toString()}  // Chiave unica per ogni corsa
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    corsaContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
    },
    corsaTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    fermataContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#eaeaea',
        borderRadius: 8,
    },
    fermataText: {
        fontSize: 16,
    },
});

export default HomeScreen;
