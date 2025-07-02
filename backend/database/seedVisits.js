// backend/database/seedVisits.js
import { openDb } from './database.js';

// Check if --verbose flag is passed
const isVerbose = process.argv.includes('--verbose');

const visitSeedData = [
    {
        title: 'Highland Birds Expedition',
        location: 'Scottish Highlands',
        year: 2024,
        date: 'March 2024',
        description: 'A focused expedition to document the magnificent birds of prey in the Scottish Highlands, including the endangered Golden Eagle.',
        thumbnail: '/images/bird.jpg',
        images: '1',
        tags: 'bird,endangered'
    },
    {
        title: 'Costa Rica Biodiversity',
        location: 'Costa Rica Rainforest',
        year: 2023,
        date: 'November 2023',
        description: 'Exploring the incredible biodiversity of Costa Rican rainforests, focusing on hummingbirds and tropical species.',
        thumbnail: '/images/biodiversity.jpg',
        images: '2',
        tags: 'bird,tropical'
    },
    {
        title: 'Alaska Wilderness',
        location: 'Alaska',
        year: 2022,
        date: 'June 2022',
        description: 'Remote wilderness expedition in Alaska, documenting wolves, marine life, and pristine landscapes.',
        thumbnail: '/images/alaska.jpg',
        images: '3,4',
        tags: 'mammal,marine,wilderness'
    }
];

async function seedVisits() {
    const db = await openDb();

    await db.exec(`
        CREATE TABLE IF NOT EXISTS visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            location TEXT,
            year INTEGER,
            date TEXT,
            description TEXT,
            thumbnail TEXT,
            images TEXT,
            tags TEXT,
            UNIQUE(title, year)
        );
    `);

    await db.run(`DELETE FROM visits`);
    if (isVerbose) console.log('🧹 All existing visit timeline data cleared.');

    for (const visit of visitSeedData) {
        try {
            await db.run(
                `INSERT INTO visits (title, location, year, date, description, thumbnail, images, tags)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    visit.title,
                    visit.location,
                    visit.year,
                    visit.date,
                    visit.description,
                    visit.thumbnail,
                    visit.images,
                    visit.tags
                ]
            );
            if (isVerbose) console.log(`🆕 Inserted: ${visit.title}`);
        } catch (err) {
            if (isVerbose) console.error(`❌ Error inserting ${visit.title}:`, err.message);
        }
    }

    if (isVerbose) {
        const allVisits = await db.all('SELECT * FROM visits');
        console.log('\n📍 Current visits in DB:');
        console.table(allVisits);
    }
}

seedVisits().catch(console.error);
