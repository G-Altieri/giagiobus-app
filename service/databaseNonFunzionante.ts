import LineaAutobus from '@/model/LineaAutobus';
import * as SQLite from 'expo-sqlite';

// Funzione per aprire o creare il database
const openDatabase = async () => {
  try {
    console.log('Apertura del database...');
    const db = await SQLite.openDatabaseAsync('giagiobusDB');
    console.log('Database aperto correttamente:', db);
    return db;
  } catch (error) {
    console.error('Errore durante l\'apertura del database:', error);
  }
}

// Funzione per inizializzare il database con la creazione delle tabelle
const initDatabase = async (db) => {
  try {
    console.log('Inizializzazione del database...');
    await db.withTransactionAsync(async () => {
      console.log('Creazione della tabella "corse" se non esiste...');
      await db.execAsync(
        'CREATE TABLE IF NOT EXISTS corse (id INTEGER PRIMARY KEY NOT NULL, nome TEXT, partenza TEXT, arrivo TEXT)'
      );
      console.log('Tabella "corse" creata o già esistente.');

      console.log('Creazione della tabella "fermate" se non esiste...');
      await db.execAsync(
        'CREATE TABLE IF NOT EXISTS fermate (id INTEGER PRIMARY KEY NOT NULL, nome TEXT, latitudine REAL, longitudine REAL, ordine INTEGER, corsa_id INTEGER, FOREIGN KEY (corsa_id) REFERENCES corse (id))'
      );
      console.log('Tabella "fermate" creata o già esistente.');
    });
    console.log('Inizializzazione del database completata.');
  } catch (error) {
    console.error('Errore durante l\'inizializzazione del database:', error);
  }
}

// Funzione per inserire le corse e le loro fermate nel database
export const insertCorse = async (corse) => {
  try {
    console.log('Inserimento delle corse...');
    const db = await openDatabase();
    if (!db) {
      console.error('Database non aperto, uscita...');
      return;
    }

    await initDatabase(db);
    console.log('Database inizializzato correttamente.');

    // SQL per inserire una corsa e le fermate
    const sqlCorsa = 'INSERT INTO corse (id, nome, partenza, arrivo) VALUES (?, ?, ?, ?)';
    const sqlFermata = 'INSERT INTO fermate (id, nome, latitudine, longitudine, ordine, corsa_id) VALUES (?, ?, ?, ?, ?, ?)';

    await db.withTransactionAsync(async () => {
      for (const corsa of corse) {
        console.log(`Inserimento della corsa: ID: ${corsa.id}, Nome: ${corsa.nome}, Partenza: ${corsa.partenza}, Arrivo: ${corsa.arrivo}`);
        await db.execAsync(sqlCorsa, [corsa.id, corsa.nome, corsa.partenza, corsa.arrivo]);

        for (const fermata of corsa.fermate) {
          console.log(`Inserimento fermata: ID: ${fermata.id}, Nome: ${fermata.nome}, Latitudine: ${fermata.latitudine}, Longitudine: ${fermata.longitudine}, Ordine: ${fermata.ordine}, CorsaID: ${corsa.id}`);
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
  try {
    const db = await openDatabase();
    if (!db) {
      console.error('Errore: impossibile aprire il database.');
      return [];
    }

    // Inizializziamo il database (crea le tabelle se non esistono)
    await initDatabase(db);
    console.log('Database inizializzato.');

    // Recuperiamo tutte le corse
    console.log('Recupero delle corse dal database...');
    const resultCorse = await db.execAsync('SELECT * FROM corse');

    // Verifichiamo se ci sono risultati
    if (!resultCorse || resultCorse.length === 0 || !resultCorse[0].rows) {
      console.log('Nessuna corsa trovata.');
      return [];
    }

    const corse = resultCorse[0].rows._array; // Lista di corse
    console.log(`${corse.length} corse trovate.`); // Log del numero di corse trovate

    const resultWithFermate: LineaAutobus[] = [];

    // Per ogni corsa, recuperiamo le fermate associate
    for (const corsa of corse) {
      console.log(`Recupero delle fermate per la corsa con ID: ${corsa.id}`);

      const resultFermate = await db.execAsync(
        'SELECT * FROM fermate WHERE corsa_id = ? ORDER BY ordine ASC',
        [corsa.id]
      );

      // Controlliamo se ci sono fermate associate
      if (!resultFermate || resultFermate.length === 0 || !resultFermate[0].rows) {
        console.log(`Nessuna fermata trovata per la corsa con ID: ${corsa.id}`);
        continue;  // Se non ci sono fermate, passiamo alla prossima corsa
      }

      const fermate = resultFermate[0].rows._array.map((fermataJson: any) =>
        Fermata.fromJson(fermataJson)
      );
      console.log(`${fermate.length} fermate trovate per la corsa con ID: ${corsa.id}`);

      // Creiamo l'oggetto LineaAutobus con le fermate
      const linea = new LineaAutobus(corsa.nome, corsa.partenza, corsa.arrivo, fermate);
      linea.id = corsa.id;  // Assegniamo l'id della corsa
      resultWithFermate.push(linea);
    }

    console.log('Recupero delle corse completato.');
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