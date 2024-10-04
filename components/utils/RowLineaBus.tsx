import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconaFrecceAvantiDietro, IconaBandierina } from './Icone';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface DettagliLineaProps {
    coloreBackground: string;
    numLinea: number | string;
    partenza: string;
    arrivo: string;
    type: number;
    listaFermate: Array<{ id: string; latitudine: string; longitudine: string; nome: string; orari?: string | null; ordine: string }>;
}

const RowLineaBus: React.FC<DettagliLineaProps> = ({ coloreBackground, numLinea, partenza, arrivo, listaFermate, type = 0 }) => {
    const navigation = useNavigation();
    const handlePress = () => {
        // @ts-ignore
        navigation.navigate('dettagliLinea', {
            coloreBackground,
            numLinea,
            partenza,
            arrivo,
            listaFermate: JSON.stringify(listaFermate) 
        });
    };

    // Stile condizionale per il container
    const containerStyle = [
        styles.container,
        type === 2 && styles.containerType2 // Aggiunge lo stile extra se type è 2
    ];

    const infoContainerStyle = [
        styles.infoContainer,
        type === 2 && styles.infoContainerType2 // Aggiunge lo stile extra se type è 2
    ];

    return (<>
        <TouchableOpacity style={containerStyle} onPress={handlePress} disabled={type === 2 ? true : false}>
            {/* Prima parte con bordi sinistri smussati */}
            <View style={[styles.leftPart, { backgroundColor: coloreBackground }]}>
                <ThemedText style={styles.spacer}></ThemedText>
            </View>

            {/* Parte centrale con partenza e arrivo */}
            <View style={styles.centerPart}>
                {/* Sezione Informazioni Linea */}
                <View style={infoContainerStyle}>
                    {/* Icona e partenza */}
                    <View style={styles.iconContainer}>
                        <IconaBandierina />
                        <ThemedText type="fermateLineaDettagliComponent" darkColor="#000000">{partenza}</ThemedText>
                    </View>

                    {/* Freccia al centro */}
                    <View style={styles.arrowContainer}>
                        <IconaFrecceAvantiDietro width={25} />
                    </View>

                    {/* Icona e arrivo */}
                    <View style={styles.iconContainer}>
                        <IconaBandierina />
                        <ThemedText type="fermateLineaDettagliComponent" darkColor="#000000">{arrivo}</ThemedText>
                    </View>
                </View>
                {/* Pulsante Dettagli */}
                {type == 0 ?
                    <View style={styles.buttonContainer}>
                        <View style={styles.button}>
                            <ThemedText type="dettagliLineaDettagliComponent" darkColor="#FFFFFF">Dettagli</ThemedText>
                        </View>
                    </View> : null}
            </View>

            {/* Ultima parte con bordi destri smussati */}
            <View style={[styles.rightPart, { backgroundColor: coloreBackground }]}>
                <ThemedText type='numLineaDettagliComponent'>{numLinea}</ThemedText>
            </View>
        </TouchableOpacity>
    </>);
};
const heightScheda = 100;
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        width: '100%', // Imposta la larghezza del contenitore al 100%
    },
    containerType2: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        width: '100%', // Imposta la larghezza del contenitore al 100%
        borderColor: '#132A68',
        borderWidth: 3,
        borderRadius: 23,
    },
    leftPart: {
        width: 30,
        height: heightScheda,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    centerPart: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        height: heightScheda,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative', // Aggiunto per posizionare il pulsante in overlay
    },
    iconContainer: {
        alignItems: 'center',
        marginHorizontal: 10, // Spazio tra icone
    },
    arrowContainer: {
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 3, // Posiziona il pulsante in basso
        // left: '50%',
        //transform: [{ translateX: -50 }], // Centra orizzontalmente il pulsante
    },
    button: {
        backgroundColor: '#132A68',
        paddingVertical: 2,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignItems: 'center',
    },
    textCenter: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginHorizontal: 5, // Spazio tra le frecce e i testi
    },
    rightPart: {
        width: 75,
        height: heightScheda,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    spacer: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20, // Margine di default
    },
    infoContainerType2: {
        marginBottom: 0, // Margine per quando il type è 2
    },
});

export default RowLineaBus;
