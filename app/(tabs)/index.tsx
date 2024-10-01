import { Image, StyleSheet, Dimensions, View, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import Svg, { Path, G, Defs, ClipPath, SvgProps } from 'react-native-svg';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import DettagliLinea from '@/components/utils/DettagliLinea';
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Marquee } from '@animatereactnative/marquee';



const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
// Creiamo i componenti SVG animati
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

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



    // Valori animati per X e Y
    const translateY = useSharedValue(5);

    // Proprietà animate per il gruppo G dell'SVG
    const animatedPropsBus = useAnimatedProps(() => {
        return {
            transform: [
                { translateY: translateY.value },
            ],
        };
    });

    React.useEffect(() => {
        // Animazione Y (oscillazione su e giù)
        translateY.value = withRepeat(
            withTiming(-10, { duration: 3000, easing: Easing.linear }), // 50px su e giùEasing.bezier(0.68, 0.55, 0.27, 1.55)
            -1, // ripeti all'infinito
            true // avanti e indietro
        );
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
                    <Svg
                        width={430}
                        height={134}
                        viewBox="0 0 430 120"
                        style={styles.imgBus}
                        fill="none">
                        <Path d="M-3 82l435-1" stroke="#fff" strokeWidth={3} />
                        <AnimatedG animatedProps={animatedPropsBus} clipPath="url(#clip0_381_99)">
                            <Path d="M168.255 71.966h-52.54v34.114h52.54V71.966z" fill="#FF725E" />
                            <Path
                                opacity={0.3}
                                d="M168.255 71.966h-52.54v34.114h52.54V71.966z"
                                fill="#000"
                            />
                            <Path
                                d="M332.689 71.966h-52.541v34.114h52.541V71.966z"
                                fill="#FF725E"
                            />
                            <Path
                                opacity={0.3}
                                d="M332.689 71.966h-52.541v34.114h52.541V71.966z"
                                fill="#000"
                            />
                            <Path
                                d="M385.814 11.64h-8.283v3.327s5.447-.04 9.363.106c5.306.195 6.084 7.024 6.084 7.024h1.807v-1.796c0-4.747-4.217-8.66-8.971-8.66z"
                                fill="#FF725E"
                            />
                            <Path
                                d="M392.807 20.195v1.606h-1.39a1.706 1.706 0 00-1.573 1.05 1.71 1.71 0 00-.129.651V34.37a1.445 1.445 0 001.446 1.445h2.394a1.448 1.448 0 001.446-1.445V20.125l-2.194.07z"
                                fill="#FF725E"
                            />
                            <Path
                                d="M392.806 27.832a21.751 21.751 0 01-.13-3.337 21.56 21.56 0 01.13-3.331c.136 1.105.181 2.22.136 3.331.045 1.114 0 2.23-.136 3.337z"
                                fill="#263238"
                            />
                            <Path
                                d="M345.115 4.516l-1.912-2.55A4.9 4.9 0 00339.302 0h-86.396a5.18 5.18 0 00-4.463 2.549l-1.225 2.092-181.989.793a5.438 5.438 0 00-5.407 5.324L58 101.238l32.23 5.454h30.677a23.62 23.62 0 012.274-22.094 23.632 23.632 0 0119.614-10.442 23.644 23.644 0 0119.613 10.442 23.61 23.61 0 012.274 22.094h119.981a23.611 23.611 0 012.271-22.101 23.648 23.648 0 0139.238 0 23.615 23.615 0 012.271 22.101h45.207l5.732-6.819v-89.04c0-2.97-3.313-6.282-6.285-6.282l-27.982-.035z"
                                fill="#FF725E"
                            />
                            <Path
                                d="M66.121 17.35v41.515a7.915 7.915 0 004.904 7.321c.964.397 1.996.6 3.038.597h99.097V18.459L66.121 17.351z"
                                fill="#263238"
                            />
                            <Path
                                d="M69.758 20.602v23.371l5.763 3.743h42.937V20.642l-48.7-.04zM122.359 51.735V20.627h48.148v42.594l-8.343-8.34a10.909 10.909 0 00-7.726-3.2l-32.079.054z"
                                fill="#455A64"
                            />
                            <Path
                                opacity={0.2}
                                d="M126.93 51.725l34.578-31.088 8.996-.035-33.951 31.108-9.623.015z"
                                fill="#fff"
                            />
                            <Path d="M332.606 17.35h-98.821v49.433h98.821V17.351z" fill="#263238" />
                            <Path
                                d="M281.008 19.669h-44.875v44.229h44.875v-44.23zM329.75 19.669h-44.875v44.229h44.875v-44.23z"
                                fill="#455A64"
                            />
                            <Path
                                d="M272.44 106.682v-.467-1.334c0-1.174 0-2.88-.03-5.048 0-4.345-.03-10.537-.055-18.033l.11.11h-30.753l.131-.13v24.882l-.116-.115 22.199.055 6.3.03h2.109-2.069l-6.27.03-22.279.06h-.115v-.115-25.012H272.596v.19c0 7.526-.04 13.738-.056 18.103 0 2.158 0 3.854-.025 5.018v1.314c0 .311-.075.462-.075.462zM116.81 106.692v-.17-.502-1.982c0-1.741 0-4.255-.04-7.396 0-6.317 0-15.163-.046-25.343l.126.13h-11.426l-33.103-.035-10.04-.045h-2.73l2.74-.1 10.04-.04 33.103-.04h11.516v.125c0 10.18-.035 19.026-.05 25.343 0 3.141 0 5.655-.035 7.396v2.483a.72.72 0 01-.055.176z"
                                fill="#263238"
                            />
                            <Path
                                d="M91.533 71.966c.075 0 .13 7.772.13 17.35 0 9.579-.055 17.351-.13 17.351-.075 0-.13-7.767-.13-17.35 0-9.584.06-17.35.13-17.35zM67.095 71.554c.07 0 .13 6.97.13 15.555s-.06 15.554-.13 15.554-.13-6.964-.13-15.554.07-15.555.13-15.555zM113.332 99.086v-.422-1.204c0-1.064 0-2.594-.03-4.516 0-3.888-.035-9.408-.06-15.99l.116.115H94.115l.131-.13v22.157l-.11-.11 13.935.054 3.911.03h1.059-1.004l-3.89.03-14.001.056h-.11v-.11-10.397-11.76l.13-.136H113.528v.115c0 6.613-.04 12.157-.055 16.056 0 1.927 0 3.447-.03 4.516V98.925c0 .08-.106.16-.111.16z"
                                fill="#263238"
                            />
                            <Path
                                d="M96.435 76.938c.07 0 .13 4.957.13 11.074 0 6.116-.06 11.073-.13 11.073s-.13-4.957-.13-11.073c0-6.117.06-11.074.13-11.074zM99.345 76.938c.07 0 .13 4.957.13 11.074 0 6.116-.06 11.073-.13 11.073s-.13-4.957-.13-11.073c0-6.117.06-11.074.13-11.074zM102.256 76.938c.07 0 .13 4.957.13 11.074 0 6.116-.06 11.073-.13 11.073-.071 0-.131-4.957-.131-11.073 0-6.117.05-11.074.131-11.074zM105.189 76.938c.07 0 .131 4.957.131 11.074 0 6.116-.061 11.073-.131 11.073s-.13-4.957-.13-11.073c0-6.117.035-11.074.13-11.074zM108.076 76.938c.075 0 .135 4.957.135 11.074 0 6.116-.06 11.073-.135 11.073-.075 0-.131-4.957-.131-11.073 0-6.117.061-11.074.131-11.074zM110.986 76.938c.075 0 .131 4.957.131 11.074 0 6.116-.056 11.073-.131 11.073-.075 0-.131-4.957-.131-11.073 0-6.117.061-11.074.131-11.074zM229.525 23.286h-52.56v83.411h52.56v-83.41z"
                                fill="#263238"
                            />
                            <Path
                                d="M199.883 29.001h-19.985V94.25h19.985V29zM226.2 29.001h-19.985V94.25H226.2V29zM203.162 23.286c.07 0 .13 18.535.13 41.394 0 22.86-.06 41.4-.13 41.4-.071 0-.131-18.535-.131-41.4 0-22.864.05-41.394.131-41.394z"
                                fill="#455A64"
                            />
                            <Path
                                opacity={0.3}
                                d="M99.901 20.602L70.594 44.535l4.925 3.181 31.787-27.114h-7.405zM81.219 47.716l31.717-27.079h1.807l-31.607 27.08H81.22zM236.137 50.02l33.715-30.316 8.991-.035-42.812 39.227.106-8.877zM179.898 69.131v8.79l19.985-18.313v-8.445l-19.985 17.968zM206.215 79.593v8.79L226.2 70.07v-8.444l-19.985 17.968z"
                                fill="#fff"
                            />
                            <Path
                                opacity={0.2}
                                d="M214.779 29.001l-8.564 7.697v8.79l17.992-16.487h-9.428z"
                                fill="#fff"
                            />
                            <Path
                                opacity={0.3}
                                d="M179.895 81.278l-.036 2.88 20.026-18.128v-2.538l-19.99 17.786z"
                                fill="#fff"
                            />
                            <Path d="M369.137 23.286h-31.41v83.411h31.41v-83.41z" fill="#263238" />
                            <Path d="M365.704 29.001h-25.04V94.25h25.04V29z" fill="#455A64" />
                            <Path
                                opacity={0.2}
                                d="M365.703 29.001h-9.699v52.197h9.699V29.001z"
                                fill="#000"
                            />
                            <Path
                                opacity={0.3}
                                d="M340.672 69.131v8.79l25.03-18.313v-8.445l-25.03 17.968zM340.661 81.278l-.04 2.88 25.081-18.128v-2.538l-25.041 17.786z"
                                fill="#fff"
                            />
                            <Path
                                opacity={0.2}
                                d="M285.652 50.306l34.072-30.637h9.463l-43.64 39.513.105-8.877z"
                                fill="#fff"
                            />
                            <Path
                                opacity={0.3}
                                d="M284.875 64.139l43.063-39.97h1.812l-42.957 39.97h-1.918z"
                                fill="#fff"
                            />
                            <Path
                                d="M170.893 23.728H69.758v.883h101.135v-.883zM331.822 23.728h-96.556v.883h96.556v-.883z"
                                fill="#263238"
                            />
                            <Path
                                d="M332.726 77.922h-2.239a1.33 1.33 0 00-1.331 1.33v.09c0 .734.596 1.33 1.331 1.33h2.239a1.33 1.33 0 001.33-1.33v-.09a1.33 1.33 0 00-1.33-1.33z"
                                fill="#FF9A6C"
                            />
                            <Path
                                d="M278.64 94.239h-2.239a1.33 1.33 0 00-1.331 1.33v.09c0 .734.596 1.33 1.331 1.33h2.239a1.33 1.33 0 001.33-1.33v-.09a1.33 1.33 0 00-1.33-1.33z"
                                fill="#fff"
                            />
                            <Path
                                d="M236.604 94.239h-2.239a1.33 1.33 0 00-1.33 1.33v.09c0 .734.596 1.33 1.33 1.33h2.239a1.33 1.33 0 001.331-1.33v-.09a1.33 1.33 0 00-1.331-1.33zM171.827 94.013h-2.239a1.33 1.33 0 00-1.33 1.33v.09c0 .734.595 1.33 1.33 1.33h2.239a1.33 1.33 0 001.33-1.33v-.09a1.33 1.33 0 00-1.33-1.33zM72.429 96.757h-2.24a1.33 1.33 0 00-1.33 1.33v.09c0 .735.596 1.33 1.33 1.33h2.24a1.33 1.33 0 001.33-1.33v-.09a1.33 1.33 0 00-1.33-1.33z"
                                fill="#FF9A6C"
                            />
                            <Path
                                opacity={0.2}
                                d="M349.791 29.001v30.903h-9.117l-.01-30.903h9.127z"
                                fill="#000"
                            />
                            <Path d="M379.35 15.253h-6.28v61.8h6.28v-61.8z" fill="#263238" />
                            <Path
                                d="M379.359 71.785s-3.193.818-4.017-2.037c-.823-2.855 0-52.397 0-52.397h4.017v54.434z"
                                fill="#455A64"
                            />
                            <Path
                                opacity={0.3}
                                d="M374.984 48.574l4.373-3.236v-5.77c0-.472-4.373 2.509-4.373 2.509v6.497z"
                                fill="#fff"
                            />
                            <Path
                                opacity={0.2}
                                d="M260.335.251h-1.124v2.684h1.124V.251zM262.48.251h-1.125v2.684h1.125V.251zM264.617.251h-1.125v2.684h1.125V.251zM266.757.251h-1.124v2.684h1.124V.251zM268.894.251h-1.124v2.684h1.124V.251zM271.039.251h-1.125v2.684h1.125V.251zM273.175.251h-1.124v2.684h1.124V.251zM275.316.251h-1.125v2.684h1.125V.251zM277.453.251h-1.125v2.684h1.125V.251zM279.597.251h-1.124v2.684h1.124V.251zM281.738.251h-1.125v2.684h1.125V.251zM283.874.251h-1.124v2.684h1.124V.251zM286.015.251h-1.124v2.684h1.124V.251zM288.156.251h-1.125v2.684h1.125V.251z"
                                fill="#000"
                            />
                            <Path
                                d="M345.294 4.516c0 .07-21.993.13-49.116.13-27.124 0-49.127-.085-49.127-.13s21.993-.13 49.127-.13c27.133 0 49.116.034 49.116.13z"
                                fill="#000"
                            />
                            <Path
                                d="M379.359 14.235c0 .075-71.551.13-159.795.13-88.243 0-159.81-.055-159.81-.13 0-.076 71.536-.13 159.81-.13s159.795.06 159.795.13z"
                                fill="#263238"
                            />
                            <Path
                                d="M143.99 117.61c10.04 0 18.178-8.134 18.178-18.168 0-10.034-8.138-18.169-18.178-18.169-10.039 0-18.178 8.135-18.178 18.169s8.139 18.168 18.178 18.168z"
                                fill="#455A64"
                            />
                            <Path d="M376.957 87.962h-3.328v5.755h3.328v-5.755z" fill="#FF9A6C" />
                            <Path d="M379.367 87.962h-2.41v5.755h2.41v-5.755z" fill="#fff" />
                            <Path d="M231.471 4.827h-55.909v14.842h55.909V4.827z" fill="#263238" />
                            <Path
                                opacity={0.2}
                                d="M229.524 6.417h-52.219v11.656h52.219V6.417z"
                                fill="#000"
                            />
                            <Path
                                d="M163.651 99.017c.493-11.514-8.447-21.248-19.967-21.74-11.521-.493-21.26 8.441-21.752 19.956-.493 11.514 8.446 21.248 19.967 21.741 11.52.492 21.259-8.443 21.752-19.957z"
                                fill="#263238"
                            />
                            <Path
                                d="M121.923 97.781a20.858 20.858 0 005.944 14.821 20.883 20.883 0 0029.44.425 20.862 20.862 0 006.368-14.589v-.055l-41.752-.602z"
                                fill="#263238"
                            />
                            <Path
                                d="M128.134 97.927a14.647 14.647 0 008.854 13.663 14.673 14.673 0 0016.019-2.946 14.646 14.646 0 00-1.896-22.571 14.663 14.663 0 00-21.781 6.263 14.657 14.657 0 00-1.196 5.59z"
                                fill="#FAFAFA"
                            />
                            <Path
                                d="M143.006 83.486a14.67 14.67 0 00-10.426 4.143 14.654 14.654 0 00-4.443 10.297l29.312.422a14.646 14.646 0 00-4.142-10.42 14.662 14.662 0 00-10.301-4.442z"
                                fill="#E0E0E0"
                            />
                            <Path
                                d="M133.864 98.007a8.93 8.93 0 1017.223-3.182 8.932 8.932 0 00-17.223 3.182zM307.833 118.971c11.521-.479 20.472-10.202 19.994-21.717-.479-11.515-10.207-20.462-21.728-19.983-11.521.479-20.473 10.201-19.994 21.716.479 11.515 10.207 20.462 21.728 19.984z"
                                fill="#263238"
                            />
                            <Path
                                d="M286.083 97.781v.055a20.862 20.862 0 005.944 14.766 20.883 20.883 0 0029.44.425 20.862 20.862 0 006.368-14.589v-.055l-41.752-.602z"
                                fill="#263238"
                            />
                            <Path
                                d="M292.298 97.927a14.647 14.647 0 008.854 13.663 14.673 14.673 0 0016.019-2.946 14.646 14.646 0 00-1.896-22.571 14.664 14.664 0 00-13.734-1.554 14.658 14.658 0 00-8.048 7.816 14.642 14.642 0 00-1.195 5.592z"
                                fill="#FAFAFA"
                            />
                            <Path
                                d="M307.166 83.486a14.66 14.66 0 00-13.673 8.85 14.638 14.638 0 00-1.196 5.59l29.312.422a14.642 14.642 0 00-4.142-10.42 14.662 14.662 0 00-10.301-4.442z"
                                fill="#E0E0E0"
                            />
                            <Path
                                d="M298.028 98.007a8.93 8.93 0 1017.223-3.182 8.932 8.932 0 00-17.223 3.182z"
                                fill="#263238"
                            />
                            <Path
                                opacity={0.2}
                                d="M118.463 20.602H69.758v1.375h48.705v-1.375zM170.507 20.602h-48.148v1.375h48.148v-1.375zM226.199 29.001h-46.301v1.375h46.301v-1.375zM329.743 19.669h-93.61v1.375h93.61v-1.375z"
                                fill="#000"
                            />
                            <Path
                                d="M90.68 5.324l1.822-1.661a5.589 5.589 0 013.775-1.465h23.675a5.6 5.6 0 014.061 1.74l1.315 1.386H90.68z"
                                fill="#FF725E"
                            />
                            <Path
                                d="M126.925 5.324c0 .07-8.258.13-18.449.13-10.19 0-18.449-.06-18.449-.13s8.258-.13 18.449-.13c10.191 0 18.449.06 18.449.13z"
                                fill="#263238"
                            />
                            <Path
                                d="M60.887 97.781H58l.422-17h4.518v14.943a2.062 2.062 0 01-2.053 2.057z"
                                fill="#fff"
                            />
                            <Path
                                d="M58.611 71.289c.013.101.013.204 0 .306v.873c0 .792-.03 1.881-.055 3.21l-.116 10.588c-.045 4.12-.095 7.877-.19 10.572-.05 1.354-.096 2.453-.14 3.211 0 .356-.046.642-.061.868 0 .103-.012.206-.035.306a1.205 1.205 0 010-.306v-.873c0-.793.03-1.882.055-3.206l.115-10.592c.046-4.12.1-7.878.196-10.587.045-1.355.095-2.454.14-3.211.026-.352.04-.643.056-.868a1.5 1.5 0 01.035-.291zM379.359 77.054c.07 0 .12 1.28.145 3.341.025 2.063.041 4.918.025 8.069a873.65 873.65 0 01-.07 8.068c0 1.003-.035 1.826-.05 2.443.004.3-.013.6-.05.898a5.505 5.505 0 01-.05-.898c0-.617 0-1.445-.036-2.443v-8.069c.041-5.935.076-10.05.086-11.41z"
                                fill="#263238"
                            />
                            <Path
                                d="M308.688 58.843c3.171-6.369 12.687-10.479 12.687-19.106 0-7.034-5.68-12.737-12.687-12.737C301.68 27 296 32.703 296 39.737c0 8.627 9.516 12.737 12.688 19.106z"
                                stroke="#FF725E"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <Path
                                d="M304.357 32.473c-2.122 0-2.91.669-2.91 2.468v10.18c0 .42.129.722.323.945v.906c0 .51.436.925.97.925h1.294c.534 0 .97-.416.97-.925v-.309h7.115v.309c0 .51.436.925.97.925h1.294c.534 0 .97-.416.97-.925v-.906c.195-.223.324-.526.324-.945v-9.872c0-1.343-.175-2.776-2.264-2.776h-9.056zm.971 1.234h6.791c.18 0 .324.139.324.309v.617c0 .17-.144.308-.324.308h-6.791a.317.317 0 01-.324-.309v-.616c0-.17.146-.309.324-.309zm-1.294 2.16h9.055c.647 0 .971.308.971.925v3.702c0 .617-.632.906-.971.906l-9.055.02c-.647 0-.97-.31-.97-.926v-3.702c0-.617.323-.926.97-.926zm-2.911.308c-.356 0-.646.277-.646.617v2.468c0 .34.29.617.646.617v-3.702zm14.877 0v3.702c.358 0 .647-.278.647-.617v-2.468c0-.34-.289-.617-.647-.617zm-11.804 6.787c.625 0 1.132.483 1.132 1.08 0 .596-.507 1.079-1.132 1.079-.626 0-1.132-.483-1.132-1.08 0-.596.506-1.08 1.132-1.08zm8.732 0c.625 0 1.132.483 1.132 1.08 0 .596-.507 1.079-1.132 1.079-.626 0-1.132-.483-1.132-1.08 0-.596.506-1.08 1.132-1.08z"
                                fill="#fff"
                            />
                        </AnimatedG>
                    </Svg>
                    {/* </Animated.View> */}
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
        zIndex: 10
    },
    trattini: {
        bottom: 0,
    },
    containerTrattini: {
        width: screenWidth,
        bottom: 35,
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
