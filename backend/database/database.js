
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open SQLite database (auto-creates file if not exists)
export async function openDb() {
    return open({
        filename: './data/wildlife.db',   // Your SQLite DB file
        driver: sqlite3.Database
    });
}
