import LineaAutobus, { Fermata } from '@/model/LineaAutobus';
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'GiaGioBusTest';

const openDatabase = async () => {

    console.log('Opening database...');
    return await SQLite.openDatabaseAsync(DB_NAME);
}

const initDatabase = async (db: SQLite.SQLiteDatabase) => {

    try {
        console.log('Initializing database...');
        await db.execAsync('CREATE TABLE IF NOT EXISTS LineaBus (id INTEGER PRIMARY KEY NOT NULL, idLinea TEXT, nome TEXT, partenza TEXT, arrivo TEXT, orari TEXT,fermate TEXT,percorso TEXT)');
    } catch (error) {
        console.log(error);
    }
}

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

export const deleteDati = async () => {

    const db = await openDatabase();
    if (!db) return;

    initDatabase(db);

    const sql = 'DROP TABLE IF EXISTS LineaBus';
    await db.execAsync(sql);
    console.log('Tutti i dati nel database sono stati cancellati.');
}

export const cancellaDB = async () => {
    SQLite.deleteDatabaseAsync(DB_NAME)
    console.log('DatabaseCancellato.');
}


/*
export const inserisciPercorso = async (nomeLinea: any, percorsoGeoJson: string) => {
    const db = await openDatabase();
    if (!db) {
        console.error('Errore nell\'apertura del database');
        return;
    }

    await initDatabase(db);

    // Assicurati che il percorso sia una stringa JSON valida
    const percorsoGeoJsonParsed = typeof percorsoGeoJson === 'string' ? percorsoGeoJson : JSON.stringify(percorsoGeoJson);

    // Verifica prima se esiste la linea con quel nome
    const checkSql = 'SELECT * FROM LineaBus WHERE nome = ?';
    const resultCheck = await db.getAllAsync(checkSql, [nomeLinea]);

    console.log('Linee trovate:', resultCheck);

    if (resultCheck.length === 0) {
        console.log(`Nessuna linea trovata con il nome: ${nomeLinea}`);
        return;
    }

    // Procedi con l'aggiornamento del percorso
    const sql = `UPDATE LineaBus SET percorso = '${percorsoGeoJsonParsed}' WHERE nome = '${nomeLinea}'`;

    try {
        // Esegui la query di aggiornamento
        await db.execAsync(sql);
        console.log(`Percorso aggiornato per la linea: ${nomeLinea}`);
    } catch (error) {
        console.error('Errore durante l\'aggiornamento del percorso:', error);
    }
};

export const recuperaPercorso = async (nomeLinea: any) => {
    const db = await openDatabase();
    if (!db) return;
    await initDatabase(db);
    const sql = 'SELECT * FROM LineaBus';
    const result = await db.getAllAsync(sql, []);
    // Filtra i risultati per trovare la linea corrispondente
    const linea = result.find((row: any) => row.nome === nomeLinea);
    if (linea) {
        //@ts-ignore
        const percorso = linea.percorso;
        console.log(`Percorso recuperato per la linea: ${nomeLinea}`);
        const percorsoGeoJson = JSON.parse(percorso);  
        return percorsoGeoJson;  // Restituisce il percorso come stringa (GeoJSON)
    } else {
        console.log(`Nessun percorso trovato per la linea: ${nomeLinea}`);
        return null;
    }
};
*/