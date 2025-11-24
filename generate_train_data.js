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
            { name: "Pacific Coastliner", stops: [["Vancouver", [49.2827, -123.1207]], ["Seattle", [47.6062, -122.3321]], ["Portland", [45.5152, -122.6784]], ["Sacramento", [38.5816, -121.4944]], ["San Francisco", [37.7749, -122.4194]], ["Los Angeles", [34.0522, -118.2437]], ["San Diego", [32.7157, -117.1611]], ["Tijuana", [32.5149, -117.0382]]] },
            { name: "Trans-Continental Express", stops: [["New York", [40.7128, -74.0060]], ["Philadelphia", [39.9526, -75.1652]], ["Pittsburgh", [40.4406, -79.9959]], ["Chicago", [41.8781, -87.6298]], ["Omaha", [41.2565, -95.9345]], ["Denver", [39.7392, -104.9903]], ["Salt Lake City", [40.7608, -111.8910]], ["Reno", [39.5296, -119.8138]], ["San Francisco", [37.7749, -122.4194]]] },
            { name: "Gulf Stream Rail", stops: [["Miami", [25.7617, -80.1918]], ["Orlando", [28.5383, -81.3792]], ["Atlanta", [33.7490, -84.3880]], ["Birmingham", [33.5186, -86.8104]], ["New Orleans", [29.9511, -90.0715]], ["Houston", [29.7604, -95.3698]], ["Austin", [30.2672, -97.7431]], ["Dallas", [32.7767, -96.7970]]] },
            { name: "Canadian Shield", stops: [["Vancouver", [49.2827, -123.1207]], ["Calgary", [51.0447, -114.0719]], ["Regina", [50.4452, -104.6189]], ["Winnipeg", [49.8951, -97.1384]], ["Thunder Bay", [48.3809, -89.2477]], ["Toronto", [43.6532, -79.3832]], ["Ottawa", [45.4215, -75.6972]], ["Montreal", [45.5017, -73.5673]], ["Halifax", [44.6488, -63.5752]]] },
            { name: "Mexican Highland", stops: [["Mexico City", [19.4326, -99.1332]], ["Queretaro", [20.5888, -100.3899]], ["Guadalajara", [20.6597, -103.3496]], ["Mazatlan", [23.2494, -106.4111]], ["Hermosillo", [29.0729, -110.9559]], ["Tucson", [32.2226, -110.9747]], ["Phoenix", [33.4484, -112.0740]], ["San Diego", [32.7157, -117.1611]]] },
            { name: "Appalachian Runner", stops: [["Quebec City", [46.8139, -71.2080]], ["Boston", [42.3601, -71.0589]], ["New York", [40.7128, -74.0060]], ["Washington DC", [38.9072, -77.0369]], ["Charlotte", [35.2271, -80.8431]], ["Atlanta", [33.7490, -84.3880]]] }
        ]
    },
    "SA": {
        name: "South America",
        routes: [
            { name: "Andean Explorer", stops: [["Bogota", [4.7110, -74.0721]], ["Cali", [3.4516, -76.5320]], ["Quito", [-0.1807, -78.4678]], ["Guayaquil", [-2.1894, -79.8891]], ["Lima", [-12.0464, -77.0428]], ["Cusco", [-13.5319, -71.9675]], ["La Paz", [-16.5000, -68.1193]], ["Antofagasta", [-23.6509, -70.3975]], ["Santiago", [-33.4489, -70.6693]]] },
            { name: "Amazonia Link", stops: [["Belem", [-1.4558, -48.4902]], ["Santarem", [-2.4430, -54.7081]], ["Manaus", [-3.1190, -60.0217]], ["Porto Velho", [-8.7612, -63.9039]], ["Rio Branco", [-9.9754, -67.8249]], ["Santa Cruz", [-17.7833, -63.1821]]] },
            { name: "Trans-Atlantic South", stops: [["Rio de Janeiro", [-22.9068, -43.1729]], ["Sao Paulo", [-23.5505, -46.6333]], ["Curitiba", [-25.4284, -49.2733]], ["Porto Alegre", [-30.0346, -51.2177]], ["Montevideo", [-34.9011, -56.1645]], ["Buenos Aires", [-34.6037, -58.3816]]] },
            { name: "Patagonian Wind", stops: [["Buenos Aires", [-34.6037, -58.3816]], ["Mar del Plata", [-38.0055, -57.5426]], ["Bahia Blanca", [-38.7167, -62.2833]], ["Viedma", [-40.8135, -62.9967]], ["Puerto Madryn", [-42.7692, -65.0385]], ["Comodoro Rivadavia", [-45.8667, -67.5000]], ["Rio Gallegos", [-51.6226, -69.2181]], ["Ushuaia", [-54.8019, -68.3030]]] },
            { name: "Caribbean Coast", stops: [["Caracas", [10.4806, -66.9036]], ["Barquisimeto", [10.0678, -69.3474]], ["Maracaibo", [10.6549, -71.6394]], ["Santa Marta", [11.2408, -74.1990]], ["Barranquilla", [10.9685, -74.7813]], ["Cartagena", [10.3910, -75.4794]], ["Monteria", [8.7479, -75.8814]], ["Panama City", [8.9824, -79.5199]]] },
            { name: "Andes High-Speed", stops: [["Santiago", [-33.4489, -70.6693]], ["Mendoza", [-32.8895, -68.8167]], ["Cordoba", [-31.4201, -64.1888]], ["Rosario", [-32.9442, -60.6505]], ["Buenos Aires", [-34.6037, -58.3816]]] }
        ]
    },
    "EU": {
        name: "Europe",
        routes: [
            { name: "Orient Express Neo", stops: [["London", [51.5074, -0.1278]], ["Paris", [48.8566, 2.3522]], ["Strasbourg", [48.5734, 7.7521]], ["Munich", [48.1351, 11.5820]], ["Vienna", [48.2082, 16.3738]], ["Budapest", [47.4979, 19.0402]], ["Belgrade", [44.7866, 20.4489]], ["Bucharest", [44.4268, 26.1025]], ["Istanbul", [41.0082, 28.9784]]] },
            { name: "Nordic Frost", stops: [["Copenhagen", [55.6761, 12.5683]], ["Gothenburg", [57.7089, 11.9746]], ["Stockholm", [59.3293, 18.0686]], ["Sundsvall", [62.3908, 17.3069]], ["Umea", [63.8258, 20.2630]], ["Lulea", [65.5848, 22.1567]], ["Narvik", [68.4385, 17.4272]]] },
            { name: "Mediterranean Blue", stops: [["London", [51.5074, -0.1278]], ["Paris", [48.8566, 2.3522]], ["Lyon", [45.7640, 4.8357]], ["Marseille", [43.2965, 5.3698]], ["Barcelona", [41.3851, 2.1734]], ["Valencia", [39.4699, -0.3763]], ["Madrid", [40.4168, -3.7038]], ["Lisbon", [38.7223, -9.1393]]] },
            { name: "Iron Curtain Legacy", stops: [["Berlin", [52.5200, 13.4050]], ["Poznan", [52.4064, 16.9252]], ["Warsaw", [52.2297, 21.0122]], ["Brest", [52.0976, 23.7341]], ["Minsk", [53.9045, 27.5615]], ["Smolensk", [54.7818, 32.0401]], ["Moscow", [55.7558, 37.6173]]] },
            { name: "Baltic-Adriatic", stops: [["Gdansk", [54.3520, 18.6466]], ["Warsaw", [52.2297, 21.0122]], ["Krakow", [50.0647, 19.9450]], ["Ostrava", [49.8209, 18.2625]], ["Vienna", [48.2082, 16.3738]], ["Graz", [47.0707, 15.4395]], ["Venice", [45.4408, 12.3155]], ["Bologna", [44.4949, 11.3426]]] }
        ]
    },
    "AF": {
        name: "Africa",
        routes: [
            { name: "Cape to Cairo", stops: [["Cape Town", [-33.9249, 18.4241]], ["Kimberley", [-28.7282, 24.7499]], ["Johannesburg", [-26.2041, 28.0473]], ["Bulawayo", [-20.1367, 28.5818]], ["Victoria Falls", [-17.9243, 25.8572]], ["Lusaka", [-15.3875, 28.3228]], ["Dodoma", [-6.1630, 35.7516]], ["Nairobi", [-1.2921, 36.8219]], ["Addis Ababa", [9.0300, 38.7400]], ["Khartoum", [15.5007, 32.5599]], ["Aswan", [24.0889, 32.8998]], ["Cairo", [30.0444, 31.2357]]] },
            { name: "Maghreb Coast", stops: [["Casablanca", [33.5731, -7.5898]], ["Rabat", [34.0209, -6.8416]], ["Fes", [34.0331, -5.0003]], ["Oran", [35.6977, -0.6337]], ["Algiers", [36.7538, 3.0588]], ["Constantine", [36.3650, 6.6147]], ["Tunis", [36.8065, 10.1815]], ["Sfax", [34.7478, 10.7662]], ["Tripoli", [32.8872, 13.1913]], ["Misrata", [32.3754, 15.0925]], ["Benghazi", [32.1194, 20.0868]]] },
            { name: "West African Loop", stops: [["Dakar", [14.7167, -17.4677]], ["Bamako", [12.6392, -8.0029]], ["Bobo-Dioulasso", [11.1772, -4.2979]], ["Ouagadougou", [12.3714, -1.5197]], ["Niamey", [13.5116, 2.1254]], ["Kano", [12.0022, 8.5920]], ["Abuja", [9.0765, 7.3986]], ["Lagos", [6.5244, 3.3792]], ["Accra", [5.6037, -0.1870]], ["Abidjan", [5.3600, -4.0083]]] },
            { name: "Rift Valley Rail", stops: [["Mombasa", [-4.0435, 39.6682]], ["Nairobi", [-1.2921, 36.8219]], ["Kisumu", [-0.0917, 34.7680]], ["Kampala", [0.3476, 32.5825]], ["Kigali", [-1.9441, 30.0619]], ["Bujumbura", [-3.3822, 29.3644]]] },
            { name: "Trans-Sahel", stops: [["Dakar", [14.7167, -17.4677]], ["Bamako", [12.6392, -8.0029]], ["Niamey", [13.5116, 2.1254]], ["N'Djamena", [12.1348, 15.0557]], ["Khartoum", [15.5007, 32.5599]], ["Port Sudan", [19.6162, 37.2164]]] }
        ]
    },
    "AS": {
        name: "Asia",
        routes: [
            { name: "Trans-Siberian Cyber-Line", stops: [["Moscow", [55.7558, 37.6173]], ["Yekaterinburg", [56.8389, 60.6057]], ["Omsk", [54.9885, 73.3242]], ["Novosibirsk", [55.0084, 82.9357]], ["Krasnoyarsk", [56.0153, 92.8932]], ["Irkutsk", [52.2876, 104.3050]], ["Chita", [52.0340, 113.4994]], ["Khabarovsk", [48.4814, 135.0728]], ["Vladivostok", [43.1198, 131.8869]]] },
            { name: "Silk Road High-Speed", stops: [["Xi'an", [34.3416, 108.9398]], ["Lanzhou", [36.0611, 103.8343]], ["Urumqi", [43.8256, 87.6168]], ["Almaty", [43.2220, 76.8512]], ["Bishkek", [42.8746, 74.5698]], ["Tashkent", [41.2995, 69.2401]], ["Samarkand", [39.6270, 66.9750]], ["Ashgabat", [37.9601, 58.3261]], ["Tehran", [35.6892, 51.3890]]] },
            { name: "Tokkaido Maglev", stops: [["Tokyo", [35.6762, 139.6503]], ["Yokohama", [35.4437, 139.6380]], ["Nagoya", [35.1815, 136.9066]], ["Kyoto", [35.0116, 135.7681]], ["Osaka", [34.6937, 135.5023]], ["Hiroshima", [34.3853, 132.4553]], ["Fukuoka", [33.5902, 130.4017]]] },
            { name: "Indian Subcontinent", stops: [["Delhi", [28.6139, 77.2090]], ["Jaipur", [26.9124, 75.7873]], ["Ahmedabad", [23.0225, 72.5714]], ["Mumbai", [19.0760, 72.8777]], ["Goa", [15.2993, 74.1240]], ["Bangalore", [12.9716, 77.5946]], ["Chennai", [13.0827, 80.2707]], ["Hyderabad", [17.3850, 78.4867]], ["Kolkata", [22.5726, 88.3639]]] },
            { name: "Mekong Delta Express", stops: [["Kunming", [25.0389, 102.7183]], ["Hanoi", [21.0285, 105.8542]], ["Hue", [16.4637, 107.5909]], ["Ho Chi Minh City", [10.8231, 106.6297]], ["Phnom Penh", [11.5564, 104.9282]], ["Bangkok", [13.7563, 100.5018]], ["Surat Thani", [9.1389, 99.3226]], ["Penang", [5.4141, 100.3288]], ["Kuala Lumpur", [3.1390, 101.6869]], ["Singapore", [1.3521, 103.8198]]] }
        ]
    },
    "AU": {
        name: "Australia",
        routes: [
            { name: "The Ghan", stops: [["Darwin", [-12.4634, 130.8456]], ["Katherine", [-14.4645, 132.2635]], ["Tennant Creek", [-19.6484, 134.1900]], ["Alice Springs", [-23.6980, 133.8807]], ["Marla", [-27.2985, 133.6153]], ["Port Augusta", [-32.4960, 137.7656]], ["Adelaide", [-34.9285, 138.6007]]] },
            { name: "Indian Pacific", stops: [["Perth", [-31.9505, 115.8605]], ["Kalgoorlie", [-30.7490, 121.4660]], ["Cook", [-30.6222, 130.4103]], ["Port Augusta", [-32.4960, 137.7656]], ["Broken Hill", [-31.9535, 141.4543]], ["Sydney", [-33.8688, 151.2093]]] },
            { name: "Queensland Coastal", stops: [["Cairns", [-16.9186, 145.7781]], ["Townsville", [-19.2590, 146.8169]], ["Mackay", [-21.1411, 149.1861]], ["Rockhampton", [-23.3791, 150.5100]], ["Brisbane", [-27.4698, 153.0251]]] },
            { name: "Southern Aurora", stops: [["Sydney", [-33.8688, 151.2093]], ["Canberra", [-35.2809, 149.1300]], ["Albury", [-36.0737, 146.9135]], ["Melbourne", [-37.8136, 144.9631]]] },
            { name: "Tasmanian Link", stops: [["Hobart", [-42.8821, 147.3272]], ["Launceston", [-41.4332, 147.1441]], ["Burnie", [-41.0463, 145.9038]], ["Devonport", [-41.1771, 146.3452]]] }
        ]
    }
};

// Generate Trains
const trains = [];

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
