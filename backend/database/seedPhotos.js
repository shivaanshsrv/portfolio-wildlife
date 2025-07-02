


// backend/database/seedPhotos.js
import { openDb } from './database.js';

// Check if --verbose flag is passed
const isVerbose = process.argv.includes('--verbose');

const photoSeedData = [
    {
        src: '/images/snow.jpg',
        title: 'Snow Leopard',
        location: 'Himalayas',
        year: 2025,
        tags: 'mammal,endangered',
        animal: 'Snow Leopard',
        description: 'Rare sighting in the remote mountains.'
    },
    {
        src: '/images/tiger.jpg',
        title: 'Royal Bengal Tiger',
        location: 'Sundarbans',
        year: 2024,
        tags: 'mammal,endangered',
        animal: 'Tiger',
        description: 'Elusive tiger seen near the river bank.'
    },
    {
        src: '/images/redpanda.jpg',
        title: 'Red Panda',
        location: 'Eastern Himalayas',
        year: 2023,
        tags: 'mammal,endangered',
        animal: 'Red Panda',
        description: 'Shy red panda peeking through bamboo leaves.'
    },
    {
        src: '/images/panda.jpg',
        title: 'Giant Panda',
        location: 'Eastern Himalayas',
        year: 2023,
        tags: 'mammal,endangered',
        animal: 'Giant Panda',
        description: 'Giant panda in its natural habitat.'
    },
    {
        src: '/images/racoon.jpg',
        title: 'racoon',
        location: 'Eastern Himalayas',
        year: 2023,
        tags: 'mammal,endangered',
        animal: 'Giant Panda',
        description: 'Giant panda in its natural habitat.'
    }
];

async function seedPhotos() {
    const db = await openDb();

    await db.exec(`
        CREATE TABLE IF NOT EXISTS photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            src TEXT NOT NULL UNIQUE,
            title TEXT NOT NULL,
            location TEXT,
            year INTEGER,
            tags TEXT,
            animal TEXT,
            description TEXT
        );
    `);

    await db.run(`DELETE FROM photos`);
    if (isVerbose) console.log('🧹 All existing photo data cleared.');

    for (const photo of photoSeedData) {
        try {
            await db.run(
                `INSERT INTO photos (src, title, location, year, tags, animal, description)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [photo.src, photo.title, photo.location, photo.year, photo.tags, photo.animal, photo.description]
            );
            if (isVerbose) console.log(`🆕 Inserted: ${photo.title}`);
        } catch (err) {
            if (isVerbose) console.error(`❌ Error inserting ${photo.title}:`, err.message);
        }
    }

    if (isVerbose) {
        const allPhotos = await db.all('SELECT * FROM photos');
        console.log('\n📸 Current photos in DB:');
        console.table(allPhotos);
    }
}

seedPhotos().catch(console.error);
