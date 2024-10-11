import LineaAutobus, { Fermata } from '@/model/LineaAutobus';
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'GiaGioBusTest';

//Funzione che apre il Database
const openDatabase = async () => {
    console.log('Opening database...');
    return await SQLite.openDatabaseAsync(DB_NAME);
}

//Inizializzazione nel caso il database non esistesse
const initDatabase = async (db: SQLite.SQLiteDatabase) => {
    try {
        console.log('Initializing database...');
        await db.execAsync('CREATE TABLE IF NOT EXISTS LineaBus (id INTEGER PRIMARY KEY NOT NULL, idLinea TEXT, nome TEXT, partenza TEXT, arrivo TEXT, orari TEXT,fermate TEXT,percorso TEXT)');
    } catch (error) {
        console.log(error);
    }
}

//Inserimento dei dati base nel database
export const insertDatiLineaBus = async (dati: [LineaAutobus]) => {
    const db = await openDatabase();
    if (!db) return;

    await initDatabase(db);

    const sql = 'INSERT INTO LineaBus (id, nome, partenza, arrivo, orari, fermate) VALUES ($idLinea, $nome, $partenza, $arrivo, $orari, $fermate)';

    // Inizia una transazione
    await db.withTransactionAsync(async () => {
        // Prepara lo statement una sola volta
        const stmt = await db.prepareAsync(sql);

        try {
            // Cicla sui dati e inserisci le righe
            for (const lineaBus of dati) {
                try {
                    // Serializza le fermate come stringa JSON
                    const fermateJson = JSON.stringify(lineaBus.fermate);

                    // Esegui l'inserimento per ogni riga
                    await stmt.executeAsync({ //@ts-ignore
                        $idLinea: lineaBus.id,
                        $nome: lineaBus.nome,
                        $partenza: lineaBus.partenza,
                        $arrivo: lineaBus.arrivo,
                        $orari: lineaBus.orari,
                        $fermate: fermateJson, // Inserisci la stringa JSON
                    });
                } catch (error) {
                    console.error('Errore durante l\'inserimento di una riga:', error);
                }
            }
        } finally {
            // Finalizza lo statement una sola volta dopo il ciclo
            await stmt.finalizeAsync();
        }
    });
};

//Recupero di tutti i dati nel database
export const findDati = async () => {
    const db = await openDatabase();
    if (!db) return;

    await initDatabase(db);

    const sql = 'SELECT * FROM LineaBus';
    const result = await db.getAllAsync(sql, []);

    // Mappa i risultati deserializzando il campo `fermate`
    const datiLineaBus = result.map((row: any) => {
        const fermateJson = row.fermate;
        const fermate = JSON.parse(fermateJson);  // Deserializza la stringa JSON in array di fermate
        return {
            ...row,
            fermate: fermate.map((fermataJson: any) => Fermata.fromJson(fermataJson))  // Ricrea gli oggetti Fermata
        };
    });

    //console.log('Recupero completato:', datiLineaBus);
    return datiLineaBus;
}

//Cancellazione di tutti i dati nel database ma non del database stesso
export const deleteDati = async () => {
    const db = await openDatabase();
    if (!db) return;

    initDatabase(db);

    const sql = 'DROP TABLE IF EXISTS LineaBus';
    await db.execAsync(sql);
    console.log('Tutti i dati nel database sono stati cancellati.');
}
//Cancella il database, IMPORTANTE il db deve essere chiuso
export const cancellaDB = async () => {
    SQLite.deleteDatabaseAsync(DB_NAME)
    console.log('DatabaseCancellato.');
}
