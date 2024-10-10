let incrementalId = 1;

export default class LineaAutobus {
    
    public id: number | undefined;
    public nome: string | undefined;
    public partenza: string | undefined;
    public arrivo: string | undefined;
    public orari: string | undefined;
    public fermate: Fermata[];  // Aggiunta della proprietà per le fermate

    constructor(nome: string, partenza: string, arrivo: string, fermate: Fermata[]) {
        this.id = incrementalId++;
        this.nome = nome;
        this.partenza = partenza;
        this.arrivo = arrivo;
        this.fermate = fermate;
    }

    // Parse JSON data
    public static fromJson(json: any): LineaAutobus {
        const fermate = json.fermate.map((fermata: any) => Fermata.fromJson(fermata)); // Conversione delle fermate
        return new LineaAutobus(
            json.nome,
            json.partenza,
            json.arrivo,
            fermate
        );
    }
}

// Classe Fermata per gestire le fermate
export class Fermata {
    
    public id: number | undefined;
    public nome: string | undefined;
    public ordine: number | undefined;
    public latitudine: number | undefined;
    public longitudine: number | undefined;

    constructor(id: number, nome: string, ordine: number, latitudine: number, longitudine: number) {
        this.id = id;
        this.nome = nome;
        this.ordine = ordine;
        this.latitudine = latitudine;
        this.longitudine = longitudine;
    }

    // Parse JSON data for fermata
    public static fromJson(json: any): Fermata {
        return new Fermata(
            parseInt(json.id), // Assicurati che id sia un numero
            json.nome,
            parseInt(json.ordine), // Assicurati che ordine sia un numero
            parseFloat(json.latitudine),
            parseFloat(json.longitudine)
        );
    }
}
