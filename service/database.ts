import LineaAutobus from '@/model/LineaAutobus';
import * as SQLite from 'expo-sqlite';

// Funzione per aprire o creare il database
const openDatabase = async () => {
  console.log('Opening database...');
  return await SQLite.openDatabaseAsync('giagiobusDB');
}

const initDatabase = async (db: SQLite.SQLiteDatabase) => {
  try {
    console.log('Inizializzazione del database...');
    await db.withTransactionAsync(async () => {
      await db.execAsync(
        'CREATE TABLE IF NOT EXISTS corse (id INTEGER PRIMARY KEY NOT NULL, nome TEXT, partenza TEXT, arrivo TEXT)'
      );
      await db.execAsync(
        'CREATE TABLE IF NOT EXISTS fermate (id INTEGER PRIMARY KEY NOT NULL, nome TEXT, latitudine REAL, longitudine REAL, ordine INTEGER, corsa_id INTEGER, FOREIGN KEY (corsa_id) REFERENCES corse (id))'
      );
    });
  } catch (error) {
    console.log(error);
  }
}

// Funzione per inserire le corse e le loro fermate nel database
export const insertCorse = async (corse: [LineaAutobus]) => {
  const db = await openDatabase();
  if (!db) return;

  await initDatabase(db);
  console.log('Database inizializzato correttamente');

  // SQL per inserire una corsa
  const sqlCorsa = 'INSERT INTO corse (id, nome, partenza, arrivo) VALUES (?, ?, ?, ?)';
  const sqlFermata = 'INSERT INTO fermate (id, nome, latitudine, longitudine, ordine, corsa_id) VALUES (?, ?, ?, ?, ?, ?)';

  try {
    await db.withTransactionAsync(async () => {
      for (const corsa of corse) {
        // Log dettagliato della corsa che si sta inserendo
       // console.log(`Inserimento della corsa: ID: ${corsa.id}, Nome: ${corsa.nome}, Partenza: ${corsa.partenza}, Arrivo: ${corsa.arrivo}`);

        // Inserisci la corsa
        await db.execAsync(sqlCorsa, [corsa.id, corsa.nome, corsa.partenza, corsa.arrivo]);

        // Inserisci le fermate associate a questa corsa
        for (const fermata of corsa.fermate) {
          // Log dettagliato della fermata che si sta inserendo
        //  console.log(`Inserimento fermata: ID: ${fermata.id}, Nome: ${fermata.nome}, Latitudine: ${fermata.latitudine}, Longitudine: ${fermata.longitudine}, Ordine: ${fermata.ordine}, CorsaID: ${corsa.id}`);

          await db.execAsync(sqlFermata, [
            fermata.id,
            fermata.nome,
            fermata.latitudine,
            fermata.longitudine,
            fermata.ordine,
            corsa.id
          ]);
        }
      }
    });
    console.log('Tutte le corse e le fermate sono state inserite correttamente.');
  } catch (error) {
    console.error('Errore durante l\'inserimento delle corse e fermate:', error);
  }
}

// Funzione per recuperare tutte le corse e le loro fermate dal database
export const findCorse = async (): Promise<LineaAutobus[]> => {
  const db = await openDatabase();
  if (!db) return [];

  await initDatabase(db);

  try {
    // Recuperiamo tutte le corse
    const resultCorse = await db.execAsync('SELECT * FROM corse');

    // Verifichiamo se resultCorse è nullo o se non ha righe
    if (!resultCorse || resultCorse.length === 0 || !resultCorse[0].rows) {
      console.log('Nessuna corsa trovata.');
      return [];
    }

    const corse = resultCorse[0].rows._array; // Accediamo alle corse
    const resultWithFermate: LineaAutobus[] = [];

    // Per ogni corsa, recuperiamo le fermate associate
    for (const corsa of corse) {
      const resultFermate = await db.execAsync(
        'SELECT * FROM fermate WHERE corsa_id = ? ORDER BY ordine ASC',
        [corsa.id]
      );

      // Controlliamo se ci sono fermate associate
      if (!resultFermate || resultFermate.length === 0 || !resultFermate[0].rows) {
        console.log(`Nessuna fermata trovata per la corsa con id: ${corsa.id}`);
        continue;  // Se non ci sono fermate, passiamo alla prossima corsa
      }

      const fermate = resultFermate[0].rows._array.map((fermataJson: any) =>
        Fermata.fromJson(fermataJson)
      );

      // Creiamo l'oggetto LineaAutobus con le fermate
      const linea = new LineaAutobus(corsa.nome, corsa.partenza, corsa.arrivo, fermate);
      linea.id = corsa.id;  // Assegniamo l'id della corsa
      resultWithFermate.push(linea);
    }

    return resultWithFermate;
  } catch (error) {
    console.error('Errore nel recupero delle corse:', error);
    return [];
  }
}

// Funzione per eliminare tutte le corse e le fermate
export const deleteAllCorse = async () => {
  const db = await openDatabase();
  if (!db) return;

  await initDatabase(db);

  try {
    await db.withTransactionAsync(async () => {
      // Prima eliminiamo tutte le fermate
      await db.execAsync('DELETE FROM fermate');
      // Poi eliminiamo tutte le corse
      await db.execAsync('DELETE FROM corse');
    });
    console.log('Tutte le corse e le fermate sono state eliminate.');
  } catch (error) {
    console.error('Errore durante l\'eliminazione delle corse:', error);
  }
}