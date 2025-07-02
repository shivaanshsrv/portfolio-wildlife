import express from 'express';
import { openDb } from './database/database.js';

const app = express();
const PORT = 3000;

// Serve static files from public directory
app.use(express.static('public'));

// API route to get photos
app.get('/api/photos', async (req, res) => {
    const db = await openDb();
    const photos = await db.all('SELECT * FROM photos');
    res.json(photos);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});