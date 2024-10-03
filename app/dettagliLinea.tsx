import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';  // Hook to get route parameters

const DettagliLinea = () => {
  // Get parameters from the route
  const { coloreBackground, numLinea, partenza, arrivo } = useLocalSearchParams();

  return (
    <View style={[styles.container, { backgroundColor: coloreBackground || '#FFF' }]}>
      <Text style={styles.text}>
        <Text style={styles.label}>Linea Numero: </Text>
        {numLinea}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.label}>Partenza: </Text>
        {partenza}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.label}>Arrivo: </Text>
        {arrivo}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginVertical: 10,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default DettagliLinea;
