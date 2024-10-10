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
        await db.execAsync('CREATE TABLE IF NOT EXISTS LineaBus (id INTEGER PRIMARY KEY NOT NULL, idLinea TEXT, nome TEXT, partenza TEXT, arrivo TEXT, orari TEXT,fermate TEXT)');
    } catch (error) {
        console.log(error);
    }
}

export const insertDati = async (dati: [LineaAutobus]) => {
    const db = await openDatabase();
    if (!db) return;

    await initDatabase(db);
 
    const sql = 'INSERT INTO LineaBus (id, nome, partenza, arrivo, orari, fermate) VALUES ($idLinea, $nome, $partenza, $arrivo, $orari, $fermate)';
    db.withTransactionAsync(async () => {
        const stmt = await db.prepareAsync(sql);
        dati.forEach(async (lineaBus: LineaAutobus) => {
            try {
                // Serializza le fermate come stringa JSON
                const fermateJson = JSON.stringify(lineaBus.fermate);

                await stmt.executeAsync({
                    $idLinea: lineaBus.id,
                    $nome: lineaBus.nome,
                    $partenza: lineaBus.partenza,
                    $arrivo: lineaBus.arrivo,
                    $orari: lineaBus.orari,
                    $fermate: fermateJson, // Inserisci la stringa JSON
                });
            } catch (error) {
                console.log(error);
            } finally {
                await stmt.finalizeAsync();
            }
        });
    });
}

export const findDati = async () => {
    const db = await openDatabase();
    if (!db) return;

    await initDatabase(db);

    const sql = 'SELECT * FROM LineaBus';
    const result = await db.getAllAsync(sql, []);

    // Mappa i risultati deserializzando il campo `fermate`
    const platforms = result.map((row: any) => {
        const fermateJson = row.fermate;
        const fermate = JSON.parse(fermateJson);  // Deserializza la stringa JSON in array di fermate
        return {
            ...row,
            fermate: fermate.map((fermataJson: any) => Fermata.fromJson(fermataJson))  // Ricrea gli oggetti Fermata
        };
    });

    console.log('Recupero completato:', platforms);
    return platforms;
}

export const deleteDati = async () => {

    const db = await openDatabase();
    if (!db) return;

    initDatabase(db);

    const sql = 'DROP TABLE IF EXISTS LineaBus';
    await db.execAsync(sql);
}



export const cancellaDB = async () => {
    SQLite.deleteDatabaseAsync(DB_NAME)
    console.log('database cancellato')
}