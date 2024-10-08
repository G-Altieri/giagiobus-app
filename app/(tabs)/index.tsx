import { Image, StyleSheet, Dimensions, View, StatusBar, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Svg, { Path } from 'react-native-svg';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import DettagliLinea from '@/components/utils/RowLineaBus';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, interpolate, Easing } from 'react-native-reanimated';
import { Marquee } from '@animatereactnative/marquee';
import { insertCorse, findCorse } from '@/service/database';
import { fetchFromAPI } from '@/service/request';
import { getColorById } from '@/service/funcUtili';

const { width: screenWidth } = Dimensions.get('window');

// Creiamo i componenti SVG animati
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function HomeScreen() {
    // Stato per la scritta dinamica
    const [dynamicText, setDynamicText] = useState('L\'Aquila');
    const [dati, setDati] = useState([]);
    const [loading, setLoading] = useState(true);

    //Recupero Informazioni
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Prova a recuperare i dati dal database
                const datiDB = await findCorse(); // Usa la funzione per trovare le corse
                if (datiDB.length > 0) {
                    console.log('uso i dati del db')
                    //@ts-ignore
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


    // Stato animato per il top del bus (oscillazione su e giù)
    const topBus = useSharedValue(10);

    // Animazione per spostare il bus a destra durante lo scroll
    const translateXBus = useSharedValue(0);

    // Stile animato per il movimento su e giù del bus
    const animatedStyleBus = useAnimatedStyle(() => {
        return {
            top: topBus.value,
            transform: [{ translateX: translateXBus.value }],
        };
    });

    // Stato animato per gestire lo scroll
    const scrollOffset = useSharedValue(0);

    // Animazione opacità per il Path (linea della strada)
    const pathOpacityStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(scrollOffset.value, [0, 200], [1, 0], 'clamp'),
        };
    });

    // Animazione opacità per Marquee (trattini)
    const marqueeOpacityStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(scrollOffset.value, [0, 200], [1, 0], 'clamp'),
        };
    });
    // Animazione opacità per il testo dinamico
    const textOpacityStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(scrollOffset.value, [0, 200], [1, 0], 'clamp'),
        };
    });

    // Oscillazione del bus da top 10 a top 40
    useEffect(() => {
        topBus.value = withRepeat(
            withTiming(35, { duration: 3000, easing: Easing.linear }),
            -1,
            true
        );
    }, []);


    return (
        <>
            {/* Configurazione della StatusBar */}
            <StatusBar
                barStyle="light-content" // Cambia il colore del testo e delle icone della barra di stato
                backgroundColor="#132A68" // Imposta lo sfondo della barra di stato
            />
            {/* View fissa per logo e titolo */}
            <View style={styles.fixedHeader}>
                <View style={styles.containerLogoText}>
                    <Image source={require('@/assets/images/logoConTesto.png')} style={styles.logo} />
                    <ThemedView style={styles.textTitoloPaginaOverlay}>
                        <ThemedText type="title" lightColor="white" style={styles.TextTitoloPagina}>
                            Linee Autobus
                        </ThemedText>
                    </ThemedView>
                </View>
            </View>
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#132A68', dark: '#132A68' }}
                headerImage={
                    <View style={styles.headerContainer}>
                        {/* Città di Riferimento */}
                        <Animated.View style={[styles.textCittaOverlay, textOpacityStyle]}>
                            <ThemedText type="title" lightColor="white" style={styles.Textcitta}>
                                {dynamicText}
                            </ThemedText>
                        </Animated.View>
                        <Svg
                            width={430}
                            height={134}
                            viewBox="0 0 430 120"
                            style={styles.svgContainerBus}
                            fill="none"
                        >
                            {/* Animazione per il Path */}
                            <AnimatedPath
                                d="M-3 82l435-1"
                                stroke="#fff"
                                strokeWidth={3}
                                // @ts-ignore
                                style={pathOpacityStyle} // Stile animato direttamente sull'elemento Path
                            />
                            <Animated.Image
                                source={require('@/assets/images/autobus.png')}
                                style={[styles.imgBus, animatedStyleBus]}
                            />
                        </Svg>
                        {/* Animazione per il Marquee */}
                        <Animated.View style={marqueeOpacityStyle}>
                            <Marquee spacing={20} speed={1} style={styles.containerTrattini}>
                                <Svg
                                    style={styles.trattini}
                                    width={25}
                                    height={3}
                                    viewBox="0 0 25 3"
                                    fill="none"
                                >
                                    <Path
                                        d="M2 1.5h21"
                                        stroke="#fff"
                                        strokeWidth={3}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </Svg>
                            </Marquee>
                        </Animated.View>
                    </View>
                }
                onScroll={(scrollY: number) => {
                    scrollOffset.value = scrollY; // Aggiorniamo lo scrollOffset durante lo scroll
                    translateXBus.value = interpolate(
                        scrollY,
                        [0, 300], // Intervallo di scorrimento
                        [0, 600] // Intervallo di movimento a destra
                    );
                }}
            >


                {
                    loading ?
                        <View style={styles.containerLoading}>
                            <ActivityIndicator size="large" color="#ffffff" />
                            <ThemedText type="subtitle" lightColor="white">
                                Caricamento Dati
                            </ThemedText>
                        </View> :
                        <>
                            {/* Content Page */}
                            <View style={styles.contentContainer}>
                                {dati.map((linea, index) => {
                                    return <DettagliLinea
                                        key={index} //@ts-ignore
                                        coloreBackground={getColorById(linea.nome)}  //@ts-ignore
                                        arrivo={linea.arrivo} //@ts-ignore
                                        partenza={linea.partenza} //@ts-ignore
                                        numLinea={linea.nome} //@ts-ignore
                                        listaFermate={linea.fermate}//@ts-ignore
                                        linkImage={linea.orari}
                                        type={0}
                                    />
                                })}
                                {/* INITULE MA INSERITO PER LO SCORRIMENTO */}
                                {dati.map((linea, index) => {
                                    return <DettagliLinea
                                        key={index} //@ts-ignore
                                        coloreBackground={getColorById(linea.nome)} //@ts-ignore
                                        arrivo={linea.arrivo} //@ts-ignore
                                        partenza={linea.partenza} //@ts-ignore
                                        numLinea={linea.nome}//@ts-ignore
                                        listaFermate={linea.fermate}//@ts-ignore
                                        linkImage={linea.orari}
                                        type={0}
                                    />
                                })}
                            </View>
                        </>}
            </ParallaxScrollView>
        </>
    );
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
        backgroundColor: 'transparent',
    },
    svgContainerBus: {
        height: undefined,
        width: screenWidth,
        aspectRatio: 2.71,
        marginBottom: 20,
        resizeMode: 'contain',
        zIndex: 10,
    },
    imgBus: {
        height: undefined,
        width: '80%',
        aspectRatio: 2.83,
        alignSelf: 'center',
        top: 25,
    },
    trattini: {
        bottom: 0,
    },
    fixedHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: '#132A68',
        paddingTop: 25, // Adjust based on the status bar height
        paddingBottom: 8,
        paddingHorizontal: 10,
    },
    containerTrattini: {
        width: screenWidth,
        bottom: 35,
    },
    containerLogoText: {
        width: '100%',
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
        marginRight: 0,
        color: 'white',
        backgroundColor: 'transparent',
    },
    TextTitoloPagina: {
        fontSize: 30,
        textAlign: 'center',
    },
    contentContainer: {
        width: '100%',
    },
    containerLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
});
