import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, 'src/modules/geo_tracker/geo_data.json');

// Define Continents and Routes
const continents = {
    "NA": {
        name: "North America",
        routes: [
            { name: "Pacific Coastliner", stops: [["Vancouver", [49.2827, -123.1207]], ["Seattle", [47.6062, -122.3321]], ["Portland", [45.5152, -122.6784]], ["San Francisco", [37.7749, -122.4194]], ["Los Angeles", [34.0522, -118.2437]], ["San Diego", [32.7157, -117.1611]]] },
            { name: "Trans-Continental Express", stops: [["New York", [40.7128, -74.0060]], ["Chicago", [41.8781, -87.6298]], ["Denver", [39.7392, -104.9903]], ["Salt Lake City", [40.7608, -111.8910]], ["San Francisco", [37.7749, -122.4194]]] },
            { name: "Gulf Stream Rail", stops: [["Miami", [25.7617, -80.1918]], ["Atlanta", [33.7490, -84.3880]], ["New Orleans", [29.9511, -90.0715]], ["Houston", [29.7604, -95.3698]], ["Dallas", [32.7767, -96.7970]]] },
            { name: "Canadian Shield", stops: [["Halifax", [44.6488, -63.5752]], ["Montreal", [45.5017, -73.5673]], ["Toronto", [43.6532, -79.3832]], ["Winnipeg", [49.8951, -97.1384]], ["Edmonton", [53.5461, -113.4938]]] },
            { name: "Mexican Highland", stops: [["Mexico City", [19.4326, -99.1332]], ["Guadalajara", [20.6597, -103.3496]], ["Monterrey", [25.6866, -100.3161]], ["Chihuahua", [28.6353, -106.0889]], ["El Paso", [31.7619, -106.4850]]] }
        ]
    },
    "SA": {
        name: "South America",
        routes: [
            { name: "Andean Explorer", stops: [["Bogota", [4.7110, -74.0721]], ["Quito", [-0.1807, -78.4678]], ["Lima", [-12.0464, -77.0428]], ["La Paz", [-16.5000, -68.1193]], ["Santiago", [-33.4489, -70.6693]]] },
            { name: "Amazonia Link", stops: [["Belem", [-1.4558, -48.4902]], ["Manaus", [-3.1190, -60.0217]], ["Porto Velho", [-8.7612, -63.9039]], ["Santa Cruz", [-17.7833, -63.1821]]] },
            { name: "Trans-Atlantic South", stops: [["Rio de Janeiro", [-22.9068, -43.1729]], ["Sao Paulo", [-23.5505, -46.6333]], ["Montevideo", [-34.9011, -56.1645]], ["Buenos Aires", [-34.6037, -58.3816]]] },
            { name: "Patagonian Wind", stops: [["Buenos Aires", [-34.6037, -58.3816]], ["Bahia Blanca", [-38.7167, -62.2833]], ["Comodoro Rivadavia", [-45.8667, -67.5000]], ["Ushuaia", [-54.8019, -68.3030]]] },
            { name: "Caribbean Coast", stops: [["Caracas", [10.4806, -66.9036]], ["Maracaibo", [10.6549, -71.6394]], ["Barranquilla", [10.9685, -74.7813]], ["Cartagena", [10.3910, -75.4794]], ["Panama City", [8.9824, -79.5199]]] }
        ]
    },
    "EU": {
        name: "Europe",
        routes: [
            { name: "Orient Express Neo", stops: [["Paris", [48.8566, 2.3522]], ["Munich", [48.1351, 11.5820]], ["Vienna", [48.2082, 16.3738]], ["Budapest", [47.4979, 19.0402]], ["Bucharest", [44.4268, 26.1025]], ["Istanbul", [41.0082, 28.9784]]] },
            { name: "Nordic Frost", stops: [["Copenhagen", [55.6761, 12.5683]], ["Stockholm", [59.3293, 18.0686]], ["Oslo", [59.9139, 10.7522]], ["Trondheim", [63.4305, 10.3951]], ["Narvik", [68.4385, 17.4272]]] },
            { name: "Mediterranean Blue", stops: [["Lisbon", [38.7223, -9.1393]], ["Madrid", [40.4168, -3.7038]], ["Barcelona", [41.3851, 2.1734]], ["Marseille", [43.2965, 5.3698]], ["Rome", [41.9028, 12.4964]], ["Naples", [40.8518, 14.2681]]] },
            { name: "Iron Curtain Legacy", stops: [["Berlin", [52.5200, 13.4050]], ["Warsaw", [52.2297, 21.0122]], ["Minsk", [53.9045, 27.5615]], ["Moscow", [55.7558, 37.6173]]] },
            { name: "British Isles Loop", stops: [["London", [51.5074, -0.1278]], ["Edinburgh", [55.9533, -3.1883]], ["Glasgow", [55.8642, -4.2518]], ["Manchester", [53.4808, -2.2426]], ["Birmingham", [52.4862, -1.8904]]] }
        ]
    },
    "AF": {
        name: "Africa",
        routes: [
            { name: "Cape to Cairo", stops: [["Cape Town", [-33.9249, 18.4241]], ["Johannesburg", [-26.2041, 28.0473]], ["Victoria Falls", [-17.9243, 25.8572]], ["Nairobi", [-1.2921, 36.8219]], ["Addis Ababa", [9.0300, 38.7400]], ["Khartoum", [15.5007, 32.5599]], ["Cairo", [30.0444, 31.2357]]] },
            { name: "Maghreb Coast", stops: [["Casablanca", [33.5731, -7.5898]], ["Algiers", [36.7538, 3.0588]], ["Tunis", [36.8065, 10.1815]], ["Tripoli", [32.8872, 13.1913]]] },
            { name: "West African Loop", stops: [["Dakar", [14.7167, -17.4677]], ["Bamako", [12.6392, -8.0029]], ["Ouagadougou", [12.3714, -1.5197]], ["Accra", [5.6037, -0.1870]], ["Lagos", [6.5244, 3.3792]]] },
            { name: "Rift Valley Rail", stops: [["Mombasa", [-4.0435, 39.6682]], ["Nairobi", [-1.2921, 36.8219]], ["Kampala", [0.3476, 32.5825]], ["Kigali", [-1.9441, 30.0619]]] },
            { name: "Namib Desert Line", stops: [["Windhoek", [-22.5609, 17.0658]], ["Swakopmund", [-22.6792, 14.5268]], ["Walvis Bay", [-22.9575, 14.5053]]] }
        ]
    },
    "AS": {
        name: "Asia",
        routes: [
            { name: "Trans-Siberian Cyber-Line", stops: [["Moscow", [55.7558, 37.6173]], ["Omsk", [54.9885, 73.3242]], ["Novosibirsk", [55.0084, 82.9357]], ["Irkutsk", [52.2876, 104.3050]], ["Vladivostok", [43.1198, 131.8869]]] },
            { name: "Silk Road High-Speed", stops: [["Xi'an", [34.3416, 108.9398]], ["Lanzhou", [36.0611, 103.8343]], ["Urumqi", [43.8256, 87.6168]], ["Almaty", [43.2220, 76.8512]], ["Tashkent", [41.2995, 69.2401]]] },
            { name: "Tokkaido Maglev", stops: [["Tokyo", [35.6762, 139.6503]], ["Nagoya", [35.1815, 136.9066]], ["Osaka", [34.6937, 135.5023]], ["Fukuoka", [33.5902, 130.4017]]] },
            { name: "Indian Subcontinent", stops: [["Delhi", [28.6139, 77.2090]], ["Mumbai", [19.0760, 72.8777]], ["Chennai", [13.0827, 80.2707]], ["Kolkata", [22.5726, 88.3639]]] },
            { name: "Mekong Delta Express", stops: [["Kunming", [25.0389, 102.7183]], ["Vientiane", [17.9757, 102.6331]], ["Bangkok", [13.7563, 100.5018]], ["Kuala Lumpur", [3.1390, 101.6869]], ["Singapore", [1.3521, 103.8198]]] }
        ]
    },
    "AU": {
        name: "Australia",
        routes: [
            { name: "The Ghan", stops: [["Darwin", [-12.4634, 130.8456]], ["Alice Springs", [-23.6980, 133.8807]], ["Adelaide", [-34.9285, 138.6007]]] },
            { name: "Indian Pacific", stops: [["Perth", [-31.9505, 115.8605]], ["Kalgoorlie", [-30.7490, 121.4660]], ["Adelaide", [-34.9285, 138.6007]], ["Sydney", [-33.8688, 151.2093]]] },
            { name: "Queensland Coastal", stops: [["Cairns", [-16.9186, 145.7781]], ["Townsville", [-19.2590, 146.8169]], ["Brisbane", [-27.4698, 153.0251]]] },
            { name: "Southern Aurora", stops: [["Sydney", [-33.8688, 151.2093]], ["Canberra", [-35.2809, 149.1300]], ["Melbourne", [-37.8136, 144.9631]]] },
            { name: "Tasmanian Link", stops: [["Hobart", [-42.8821, 147.3272]], ["Launceston", [-41.4332, 147.1441]], ["Devonport", [-41.1771, 146.3452]]] }
        ]
    }
};

// Generate Trains
const trains = [];
let trainCount = 1000;

Object.entries(continents).forEach(([contCode, contData]) => {
    contData.routes.forEach((route, rIdx) => {
        // Create 2 trains per route
        for (let i = 0; i < 2; i++) {
            const trainId = `TRN-${contCode}-${(rIdx + 1).toString().padStart(2, '0')}-${String.fromCharCode(65 + i)}`;

            trains.push({
                id: trainId,
                name: `${route.name} ${String.fromCharCode(65 + i)}`,
                type: "TRAIN",
                stops: route.stops.map(s => ({ name: s[0], coords: s[1] })),
                progressOffset: i * 0.5, // 0.0 and 0.5
                status: "ON SCHEDULE",
                details: `Route: ${route.stops[0][0]} -> ${route.stops[route.stops.length - 1][0]}`
            });
        }
    });
});

// Read existing data
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

// Update trains
data.trains = trains;

// Write back
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`Successfully generated ${trains.length} trains!`);
