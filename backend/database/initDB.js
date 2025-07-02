// backend/initDB.js
import { openDb } from './database.js';

const seedPhotos = async () => {
    const db = await openDb();

    await db.exec(`
        CREATE TABLE IF NOT EXISTS photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            src TEXT,
            location TEXT,
            year INTEGER,
            description TEXT
        )
    `);

    const existing = await db.all(`SELECT * FROM photos`);
    if (existing.length === 0) {
        await db.run(`
            INSERT INTO photos (title, src, location, year, description)
            VALUES
            ('Golden Eagle', '/images/jeremy-hynes-2VsPnDt2SQs-unsplash.jpg', 'Scottish Highlands', 2024, 'The Golden Eagle soars over the misty Scottish Highlands at dawn.')

        `);
        console.log('Seeded photo data!');
    } else {
        console.log('Photos already exist in DB!');
    }

    const rows = await db.all(`SELECT * FROM photos`);
    console.log('Current photos:', rows);
};

seedPhotos();

// ('Hummingbird', '/images/vicky-hladynets-uyaTT9u6AvI-unsplash.jpg', 'Costa Rica', 2023, 'A vibrant hummingbird captured mid-flight.')
