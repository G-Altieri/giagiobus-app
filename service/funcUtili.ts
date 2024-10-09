// Funzione per ottenere il colore in base al nome (stringa)
export const getColorById = (id: string): string => {
  switch (id) {
    case "1":
      return '#C85C5C'; // Colore per id "1"
    case "2":
      return '#468E70'; // Colore per id "2"
    case "4":
      return '#D9BF44'; // Colore per id "4"
    default:
      return '#D3D3D3'; // Colore di default (grigio) se l'id non corrisponde
  }
};


// Funzione per calcolare la distanza tra due coordinate geografiche
export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (value: number): number => (value * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  return distance;
};

// Funzione per ottenere l'aspect ratio in base al numero dell'autobus
export const getAspectRatio = (numLinea: string) => {
  switch (numLinea) {
    case '1':
      return 1811 / 2621; // Aspect ratio calcolato
    case '2':
      return 932 / 716;   // Aspect ratio calcolato
    case '4':
      return 934 / 1118;  // Aspect ratio calcolato
    default:
      return 1;           // Valore di default, se il numero non corrisponde
  }
};