import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconaArrowDown, IconaMarkerListaFermate } from '@/components/utils/Icone'; // Importiamo un'icona freccia verso il basso
import { getColorById } from '@/service/funcUtili';
import { useNavigation } from '@react-navigation/native';
import { ListaFermateProps } from '@/model/Type';


const ListaFermate = ({ fermate, numLinea }: ListaFermateProps) => {
    const navigation = useNavigation();

    const handlePressChangePage = (idFermata: string) => {
        // @ts-ignore
        navigation.navigate('dettagliFermata', {
            idFermata,
        });
    };

    return (
        <View style={styles.container}>
            {fermate.map((fermata, index) => {
                const isLast = index === fermate.length - 1; // Verifica se è l'ultima fermata
                const isEven = index % 2 === 0; // Alterna tra sinistra e destra

                return (
                    <View
                        key={fermata.id}
                        style={[styles.rowContainer, isEven ? styles.row : styles.rowReverse]} // Alterna la direzione della riga
                    >
                        {/* Riquadro con il nome della fermata */}
                        <TouchableOpacity style={styles.fermataContainer} onPress={() => handlePressChangePage(fermata.id)} >
                            <Text style={styles.fermataText}>{fermata.nome}</Text>
                            <IconaMarkerListaFermate size={30} colore={getColorById(numLinea)} />
                        </TouchableOpacity>

                        {/* Se non è l'ultima fermata, mostra la freccia */}
                        {
                            !isLast && (
                                <View style={styles.arrowContainer}>
                                    <IconaArrowDown
                                        size={30}
                                        color="#000"
                                        style={[isEven ? styles.arrowRight : styles.arrowLeft]} // Cambia la direzione della freccia
                                    />
                                </View>
                            )
                        }
                    </View>
                );
            })}
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        marginHorizontal: 10
    },
    rowContainer: {
        alignItems: 'center',  // Centra verticalmente il contenuto
        marginVertical: 5,    // Spazio tra le righe
        gap: 10
    },
    row: {
        flexDirection: 'row',  // Layout normale (sinistra a destra)
        justifyContent: 'flex-start', // Mantiene gli elementi attaccati
    },
    rowReverse: {
        flexDirection: 'row-reverse',  // Layout inverso (destra a sinistra)
    },
    fermataContainer: {
        width: '50%',          // Larghezza del riquadro fermata
        padding: 10,           // Spaziatura interna del riquadro
        backgroundColor: '#f0f0f0',  // Colore di sfondo del riquadro
        borderRadius: 10,      // Bordi arrotondati
        justifyContent: 'center',
        alignItems: 'center',  // Centra il testo nel riquadro
        flexDirection: "row"
    },
    fermataText: {
        fontSize: 16,          // Dimensione del testo
        color: '#132A68',      // Colore del testo
        fontWeight: 'bold',    // Testo in grassetto
    },
    arrowContainer: {
        // flex: 1,               // Occupa lo spazio rimanente
        alignItems: 'center',  // Centra la freccia orizzontalmente
        // backgroundColor: '#f435',
    },

    arrowRight: {
        transform: [{ scaleX: 1 }], // NO Flip horizontally
    },
    arrowLeft: {
        transform: [{ scaleX: -1 }], // Flip horizontally
    },
});

export default ListaFermate;
