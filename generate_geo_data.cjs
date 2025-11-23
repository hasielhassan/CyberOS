const fs = require('fs');
const path = require('path');

// Helper to generate random coordinates
const randomCoord = (min, max) => min + Math.random() * (max - min);

// Helper to generate trajectory (straight line with intermediate points)
const generateTrajectory = (start, end, steps = 20) => {
    const path = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        path.push([
            start[0] + (end[0] - start[0]) * t,
            start[1] + (end[1] - start[1]) * t
        ]);
    }
    return path;
};

// Cities
const CITIES = {
    NYC: [40.7128, -74.0060],
    LON: [51.5074, -0.1278],
    TOK: [35.6762, 139.6503],
    PAR: [48.8566, 2.3522],
    MOS: [55.7558, 37.6173],
    SYD: [-33.8688, 151.2093],
    LAX: [34.0522, -118.2437],
    DXB: [25.2048, 55.2708],
    SIN: [1.3521, 103.8198],
    RIO: [-22.9068, -43.1729],
    CPT: [-33.9249, 18.4241],
    MUM: [19.0760, 72.8777]
};

// Generate Flights
const flights = [];
const flightRoutes = [
    ['NYC', 'LON'], ['LON', 'DXB'], ['DXB', 'TOK'], ['TOK', 'LAX'], ['LAX', 'NYC'],
    ['PAR', 'MOS'], ['MOS', 'TOK'], ['SYD', 'SIN'], ['SIN', 'DXB'], ['RIO', 'NYC'],
    ['CPT', 'LON'], ['MUM', 'DXB'], ['LAX', 'SYD'], ['NYC', 'RIO'], ['LON', 'CPT']
];

for (let i = 0; i < 150; i++) {
    const route = flightRoutes[Math.floor(Math.random() * flightRoutes.length)];
    const start = CITIES[route[0]];
    const end = CITIES[route[1]];

    // Add some randomness to start/end to simulate different airports or nearby cities
    const rStart = [start[0] + randomCoord(-2, 2), start[1] + randomCoord(-2, 2)];
    const rEnd = [end[0] + randomCoord(-2, 2), end[1] + randomCoord(-2, 2)];

    flights.push({
        id: `FLT-${1000 + i}`,
        name: `Flight ${route[0]}-${route[1]} ${1000 + i}`,
        type: 'FLIGHT',
        origin: route[0],
        destination: route[1],
        status: Math.random() > 0.9 ? 'DELAYED' : 'ON TIME',
        details: `Altitude: ${Math.floor(randomCoord(30000, 40000))}ft, Speed: ${Math.floor(randomCoord(450, 600))}mph`,
        trajectory: generateTrajectory(rStart, rEnd)
    });
}

// Generate Trains (Continental Only)
const trains = [];
const trainRegions = [
    { name: 'EU', bounds: { lat: [40, 60], lng: [-10, 30] } }, // Europe
    { name: 'US', bounds: { lat: [30, 50], lng: [-120, -70] } }, // USA
    { name: 'CN', bounds: { lat: [25, 45], lng: [100, 120] } }, // China
    { name: 'JP', bounds: { lat: [30, 40], lng: [130, 145] } } // Japan
];

for (let i = 0; i < 100; i++) {
    const region = trainRegions[Math.floor(Math.random() * trainRegions.length)];
    const start = [randomCoord(...region.bounds.lat), randomCoord(...region.bounds.lng)];
    const end = [randomCoord(...region.bounds.lat), randomCoord(...region.bounds.lng)];

    trains.push({
        id: `TRN-${2000 + i}`,
        name: `${region.name} Express ${2000 + i}`,
        type: 'TRAIN',
        origin: 'STATION A',
        destination: 'STATION B',
        status: 'ON SCHEDULE',
        details: `Speed: ${Math.floor(randomCoord(100, 200))}km/h, Cars: ${Math.floor(randomCoord(8, 16))}`,
        trajectory: generateTrajectory(start, end, 10)
    });
}

// Generate Storms
const storms = [];
for (let i = 0; i < 15; i++) {
    storms.push({
        id: `STM-${3000 + i}`,
        name: `Storm ${String.fromCharCode(65 + i)}`,
        type: 'STORM',
        origin: 'N/A',
        destination: 'N/A',
        status: 'ACTIVE',
        details: `Category: ${Math.floor(randomCoord(1, 5))}, Wind: ${Math.floor(randomCoord(80, 150))}mph`,
        trajectory: [[randomCoord(-50, 50), randomCoord(-180, 180)]] // Static for now, or single point
    });
}

const data = { flights, trains, storms };
fs.writeFileSync(path.join(__dirname, 'src/modules/geo_tracker/geo_data.json'), JSON.stringify(data, null, 2));
console.log('Geo data generated successfully.');
