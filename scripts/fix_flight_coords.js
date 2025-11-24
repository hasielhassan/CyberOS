import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/modules/geo_tracker/geo_data.json');

// Airport Coordinates Database
const airportCoords = {
    "LHR": [51.4700, -0.4543], // London Heathrow
    "MIA": [25.7959, -80.2870], // Miami
    "SFO": [37.6213, -122.3790], // San Francisco
    "DOH": [25.2731, 51.6080], // Doha
    "JFK": [40.6413, -73.7781], // New York JFK
    "BKK": [13.6900, 100.7501], // Bangkok
    "AMS": [52.3105, 4.7683], // Amsterdam
    "LAX": [33.9416, -118.4085], // Los Angeles
    "CDG": [49.0097, 2.5479], // Paris Charles de Gaulle
    "YVR": [49.1947, -123.1762], // Vancouver
    "YYZ": [43.6777, -79.6248], // Toronto
    "HND": [35.5494, 139.7798], // Tokyo Haneda
    "CPT": [-33.9715, 18.6021], // Cape Town
    "ORD": [41.9742, -87.9073], // Chicago O'Hare
    "DXB": [25.2532, 55.3657], // Dubai
    "CAI": [30.1156, 31.4095], // Cairo
    "IST": [41.2753, 28.7519], // Istanbul
    "SYD": [-33.9399, 151.1753], // Sydney
    "EZE": [-34.8150, -58.5348], // Buenos Aires
    "FRA": [50.0379, 8.5622], // Frankfurt
    "GRU": [-23.4356, -46.4731], // Sao Paulo
    "SIN": [1.3644, 103.9915], // Singapore
    "BOM": [19.0896, 72.8656], // Mumbai
    "JNB": [-26.1367, 28.2411], // Johannesburg
    "HKG": [22.3080, 113.9185], // Hong Kong
    "ICN": [37.4602, 126.4407], // Seoul Incheon
    "MAD": [40.4839, -3.5679], // Madrid
    "NBO": [-1.3192, 36.9275], // Nairobi
    "SVO": [55.9726, 37.4146], // Moscow Sheremetyevo
    "PEK": [40.0799, 116.6031], // Beijing
    "BOG": [4.7016, -74.1469], // Bogota
    "MEX": [19.4361, -99.0719], // Mexico City
    "MEL": [-37.6690, 144.8410], // Melbourne
    "AKL": [-37.0082, 174.7850], // Auckland
    "SCL": [-33.3898, -70.7945], // Santiago
    "DEL": [28.5562, 77.1000] // Delhi
};

// Read existing data
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

let fixedCount = 0;

// Fix flights
data.flights = data.flights.map(flight => {
    const start = airportCoords[flight.origin];
    const end = airportCoords[flight.destination];

    if (start && end) {
        fixedCount++;
        return {
            ...flight,
            startCoords: start,
            endCoords: end
        };
    } else {
        console.warn(`Warning: Missing coordinates for route ${flight.origin}->${flight.destination}`);
        return flight;
    }
});

// Write back to file
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`Successfully fixed coordinates for ${fixedCount} flights!`);
