// backend/database/seedEvents.js
import { openDb } from './database.js';

// Check for --verbose flag
const isVerbose = process.argv.includes('--verbose');

const eventSeedData = [
    {
        title: 'Wildlife Conservation Exhibition',
        description: 'A comprehensive exhibition showcasing endangered species photography from around the world, aimed at raising awareness for wildlife conservation.',
        image: '/images/conservation.jpg',
        year: 2024,
        venue: 'National Geographic Gallery'
    },
    {
        title: 'Bird Photography Workshop',
        description: 'Educational workshop teaching advanced techniques for bird photography, including ethical practices and conservation awareness.',
        image: '/images/birdphoto.jpg',
        year: 2023,
        venue: 'Audubon Society'
    },
    {
        title: 'African Wildlife Documentary',
        description: 'Collaboration with BBC Wildlife for a documentary series about African conservation efforts and endangered species.',
        image: '/images/africa.jpg',
        year: 2023,
        venue: 'BBC Studios'
    }
];

async function seedEvents() {
    const db = await openDb();

    await db.exec(`
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            image TEXT,
            year INTEGER,
            venue TEXT,
            UNIQUE(title, year)
        );
    `);

    await db.run(`DELETE FROM events`);
    if (isVerbose) console.log('🧹 Cleared old event data');

    for (const event of eventSeedData) {
        try {
            await db.run(
                `INSERT INTO events (title, description, image, year, venue)
                 VALUES (?, ?, ?, ?, ?)`,
                [event.title, event.description, event.image, event.year, event.venue]
            );
            if (isVerbose) console.log(`🆕 Inserted: ${event.title}`);
        } catch (err) {
            if (isVerbose) console.error(`❌ Failed to insert ${event.title}:`, err.message);
        }
    }

    if (isVerbose) {
        const allEvents = await db.all('SELECT * FROM events');
        console.log('\n📅 Current Events in DB:');
        console.table(allEvents);
    }
}

seedEvents().catch(console.error);
