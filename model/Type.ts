// types.ts

// Definisce il tipo per Fermata
export interface Fermata {
    id: string;
    nome: string;
    latitudine: string;
    longitudine: string;
    orari: Orario[] | null;
    ordine: string | null;
    autobus: { id: string; nome: string; orari: dettagliOrario[] }[];
}

// Definisce il tipo per UserLocation
export interface UserLocation {
    latitude: number;
    longitude: number;
}

// Definisce il tipo per ListaFermateProps
export interface ListaFermateProps {
    fermate: Fermata[];
    numLinea: any
}

// Definisce il tipo per Orario
export type Orario = {
    nomeBus: string;
    orari: dettagliOrario[];
};
export type dettagliOrario = {
    orario: string;
    partenza: string;
    arrivo: string;
};



/*
type Fermata = {
    id: string;
    nome: string;
    longitudine: string;
    latitudine: string;
    orari: string | null;
    ordine: string;
};

type Fermata = {
  id: string;
  nome: string;
  longitudine: string;
  latitudine: string;
  orari: Orario[];
  ordine: string;
};

*/
