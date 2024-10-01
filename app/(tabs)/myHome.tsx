import { Image, StyleSheet, Dimensions, View, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width: screenWidth } = Dimensions.get('window');


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
                    <Image
                        source={require('@/assets/images/logoConTesto.png')}
                        style={styles.logo}
                    />
                    {/* Testo dinamico sopra l'immagine */}
                    <ThemedView style={styles.textOverlay2}>
                        <ThemedText type="title" lightColor='white' style={styles.dynamicText2}>
                            Linee Autobus
                        </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.textOverlay}>
                        <ThemedText type="title" lightColor='white' style={styles.dynamicText}>
                            {dynamicText}
                        </ThemedText>
                    </ThemedView>
                    <Image
                        source={require('@/assets/images/autobus.png')}
                        style={styles.reactLogo}
                    />

                </View>
            }
        >
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
                <ThemedText type="subtitle">My Home</ThemedText>
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
    },
    reactLogo: {
        height: undefined,
        width: screenWidth,
        aspectRatio: 2.71,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    logo: {
        width: 50,
        height: 50,
        position: 'absolute',
        left: 15,
        top: 50,
        resizeMode: 'contain',
    },
    textOverlay: {
        // position: 'absolute',
        // top: 50,
        left: 0,
        right: 0,
        color: 'white',
        backgroundColor: 'transparent',
    },
    dynamicText: {
        fontSize: 20,
        textAlign: 'center',
    },
    textOverlay2: {
        alignSelf: 'flex-end',
        marginRight: 20,
        color: 'white',
        backgroundColor: 'transparent',
    },
    dynamicText2: {
        fontSize: 30,
        textAlign: 'center',
    },
});
