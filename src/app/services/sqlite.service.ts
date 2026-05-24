import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection
} from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class SqliteService {

  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private dbReady = false;

  async initDB(): Promise<void> {
    if (this.dbReady) return;

    if (Capacitor.getPlatform() === 'web') {
      await CapacitorSQLite.initWebStore();
    }

    this.db = await this.sqlite.createConnection(
      'favoritosDB', false, 'no-encryption', 1, false
    );

    await this.db.open();

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS favoritos (
        id TEXT PRIMARY KEY NOT NULL
      );
    `);

    this.dbReady = true;
  }

  async addFavorito(id: string): Promise<void> {
  if (!this.dbReady || !this.db) return;
  await this.db.run(`INSERT OR IGNORE INTO favoritos (id) VALUES (?);`, [id]);
}

  async removeFavorito(id: string): Promise<void> {
  if (!this.dbReady || !this.db) return;
  await this.db.run(`DELETE FROM favoritos WHERE id = ?;`, [id]);
}

  async isFavorito(id: string): Promise<boolean> {
  if (!this.dbReady || !this.db) return false;
  const result = await this.db.query(`SELECT id FROM favoritos WHERE id = ?;`, [id]);
  return result.values ? result.values.length > 0 : false;
}

  async getFavoritosIds(): Promise<string[]> {
  if (!this.dbReady || !this.db) return [];
  const result = await this.db.query(`SELECT id FROM favoritos;`);
  return result.values ? result.values.map((r: any) => r.id) : [];
}


  async toggleFavorito(id: string): Promise<boolean> {
    const esFavorito = await this.isFavorito(id);
    if (esFavorito) {
      await this.removeFavorito(id);
      return false;
    } else {
      await this.addFavorito(id);
      return true;
    }
  }
}