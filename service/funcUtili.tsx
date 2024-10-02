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
