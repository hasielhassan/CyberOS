import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, 'src/modules/geo_tracker/geo_data.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

// Transform flights
data.flights = data.flights.map(flight => {
    if (flight.trajectory && flight.trajectory.length > 0) {
        const startCoords = flight.trajectory[0];
        const endCoords = flight.trajectory[flight.trajectory.length - 1];

        // Create new object without trajectory but with start/end coords
        const { trajectory, ...rest } = flight;
        return {
            ...rest,
            startCoords,
            endCoords
        };
    }
    return flight;
});

// Write back to file
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('Successfully transformed flight data!');
