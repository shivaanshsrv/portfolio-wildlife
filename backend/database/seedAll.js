// backend/database/seedAll.js
import { exec } from 'child_process';
import { argv } from 'process';

const isVerbose = argv.includes('--verbose');
const flag = isVerbose ? '--verbose' : '';

function runSeed(script) {
    return new Promise((resolve, reject) => {
        exec(`node backend/database/${script} ${flag}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`❌ Error running ${script}:`, err.message);
                return reject(err);
            }
            if (isVerbose) {
                console.log(`\n📄 ${script} Output:\n${stdout}`);
                if (stderr) console.error(stderr);
            }
            resolve();
        });
    });
}

async function runAllSeeds() {
    try {
        await runSeed('seedPhotos.js');
        await runSeed('seedVisits.js');
        await runSeed('seedEvents.js');
    } catch (err) {
        console.error('❌ Failed to seed all data:', err);
    }
}

runAllSeeds();
