import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { IconaArrowBack } from '@/components/utils/Icone';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useRouter } from 'expo-router';

interface HeaderWithBackButtonProps {
    title: string;
}

const NavBar: React.FC<HeaderWithBackButtonProps> = ({ title }) => {
    const router = useRouter();

    const handleGoBack = () => {
        console.log("Going back to previous route");
        router.back(); // Usa solo router.back() per tornare alla schermata precedente
    };

    return (
        <View style={styles.fixedHeader}>
            <View style={styles.containerLogoText}>
                <TouchableOpacity
                    style={styles.logoArrowBack}
                    onPress={() => handleGoBack()}
                >
                    <View>
                        <IconaArrowBack size={30} />
                    </View>
                </TouchableOpacity>
                <ThemedView style={styles.textTitoloPaginaOverlay}>
                    <ThemedText type="title" lightColor="white" style={styles.TextTitoloPagina}>
                        {title}
                    </ThemedText>
                </ThemedView>
            </View>
        </View>
    );
};

export default NavBar;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    TextTitoloPagina: {
        fontSize: 30,
        textAlign: 'center',
    },
    logo: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    logoArrowBack: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        top: 0
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
        height: 100,
    },
    containerLogoText: {
        width: '100%',
        flex: 1,
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }, textTitoloPaginaOverlay: {
        marginRight: 0,
        color: 'white',
        backgroundColor: 'transparent',
    },
});
