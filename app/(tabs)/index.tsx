import { Image, StyleSheet, Dimensions, View, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import DettagliLinea from '@/components/utils/DettagliLinea';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;

export default function HomeScreen() {
    // Stato per la scritta dinamica
    const [dynamicText, setDynamicText] = useState('Lentella');

    // Aggiorna la scritta dinamica dopo un po' di tempo
    useEffect(() => {
        const timer = setTimeout(() => {
            setDynamicText('L\'Aquila');
        }, 3000); // Aggiorna la scritta dopo 3 secondi
        return () => clearTimeout(timer);
    }, []);

    return (<>
        {/* Configurazione della StatusBar */}
        <StatusBar
            barStyle="light-content" // Cambia il colore del testo e delle icone della barra di stato
            backgroundColor="#132A68" // Imposta lo sfondo della barra di stato
        />
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#132A68', dark: '#132A68' }}
            headerImage={
                <View style={styles.headerContainer}>
                    <View style={styles.containerLogoText}>
                        {/* Logo con Descrizione */}
                        <Image
                            source={require('@/assets/images/logoConTesto.png')}
                            style={styles.logo}
                        />
                        {/* Titolo dinamico della pagina */}
                        <ThemedView style={styles.textTitoloPaginaOverlay}>
                            <ThemedText type="title" lightColor='white' style={styles.TextTitoloPagina}>
                                Linee Autobus
                            </ThemedText>
                        </ThemedView>
                    </View>
                    {/* Citta di Riferimento */}
                    <ThemedView style={styles.textCittaOverlay}>
                        <ThemedText type="title" lightColor='white' style={styles.Textcitta}>
                            {dynamicText}
                        </ThemedText>
                    </ThemedView>
                    {/* Imagine del Bus */}
                    <Image
                        source={require('@/assets/images/autobus.png')}
                        style={styles.imgBus}
                    />
                </View>
            }
        >
            {/* Content Page */}
            <View style={styles.contentContainer}>
                <DettagliLinea coloreBackground='#C85C5C' arrivo='Finanza' partenza='Terminal-Bus' numLinea={1}></DettagliLinea>
                <DettagliLinea coloreBackground='#468E70' arrivo='Finanza' partenza='Terminal-Bus' numLinea={2}></DettagliLinea>
                <DettagliLinea coloreBackground='#D9BF44' arrivo='Finanza' partenza='Terminal-Bus' numLinea={4}></DettagliLinea>
                <DettagliLinea coloreBackground='#C85C5C' arrivo='Finanza' partenza='Terminal-Bus' numLinea={4}></DettagliLinea>
                <DettagliLinea coloreBackground='#C85C5C' arrivo='Finanza' partenza='Terminal-Bus' numLinea={4}></DettagliLinea>
                <DettagliLinea coloreBackground='#C85C5C' arrivo='Finanza' partenza='Terminal-Bus' numLinea={4}></DettagliLinea>
            </View>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">My Home</ThemedText>
            </ThemedView>
        </ParallaxScrollView>
    </>);
}

const styles = StyleSheet.create({
    headerContainer: {
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 0,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
        backgroundColor: "transparent",
    },
    imgBus: {
        height: undefined,
        width: screenWidth,
        aspectRatio: 2.71,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    containerLogoText: {
        width: screenWidth,
        flex: 1,
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        width: 60,
        height: 60,

        resizeMode: 'contain',
    },
    textCittaOverlay: {
        color: 'white',
        backgroundColor: 'transparent',
    },
    Textcitta: {
        fontSize: 20,
        textAlign: 'center',
    },
    textTitoloPaginaOverlay: {
        marginRight: 5,
        color: 'white',
        backgroundColor: 'transparent',
    },
    TextTitoloPagina: {
        fontSize: 30,
        textAlign: 'center',
    },
    contentContainer: {
        width: "100%",
      //  backgroundColor: 'black',
    },
});
