import axios from 'axios';

export const fetchFromAPI = async () => {
  try {
    const response = await axios.get('https://giagiobus.altervista.org/api/listaAutobus.php');
    const dati = response.data;
    return dati;
  } catch (error) {
    console.error('Errore nella richiesta API:', error);
    return [];
  }
};