
import { useState, useEffect } from 'react';
import { Camera, Settings, MapPin, Loader } from 'lucide-react';

// Fallback GIFs (Cyberpunk/City vibes)
const FALLBACK_CAMS = [
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFj/3o7TKSjRrfIPjeiVyM/giphy.gif', // Matrix code
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFj/l0HlHFRbmaZtBRhXG/giphy.gif', // Cyber city
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFj/3o7TKv6MgQfdSRT01G/giphy.gif', // Glitch
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFj/xT9Igk31elskXqDqMg/giphy.gif', // Security cam
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFj/l41lFw057lAJQMwg0/giphy.gif', // Traffic
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFj/3o6Zt481isNVuQI1l6/giphy.gif', // Server room
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFj/26tP7axeTIW5uXkWs/giphy.gif', // Data stream
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFjYzE5YjFj/xT9IgG50Fb7Mi0prBC/giphy.gif', // Static
];

interface Webcam {
    title: string;
    image: {
        current: {
            preview: string;
        };
    };
    location: {
        city: string;
        country: string;
    };
}

const CamGrid = () => {
    const [apiKey, setApiKey] = useState(localStorage.getItem('windy_api_key') || '');
    const [showSettings, setShowSettings] = useState(false);
    const [cams, setCams] = useState<Webcam[]>([]);
    const [loading, setLoading] = useState(false);
    const [useLive, setUseLive] = useState(false);

    useEffect(() => {
        if (useLive && apiKey) {
            fetchCams();
        }
    }, [useLive, apiKey]);

    const fetchCams = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://api.windy.com/webcams/api/v3/webcams?limit=16&include=images,location', {
                headers: { 'x-windy-key': apiKey }
            });
            const data = await res.json();
            if (data.webcams) {
                setCams(data.webcams);
            }
        } catch (err) {
            console.error("Failed to fetch cams", err);
        }
        setLoading(false);
    };

    const saveKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem('windy_api_key', key);
    };

    return (
        <div className="h-full flex flex-col p-2 gap-2 relative">
            {/* Toolbar */}
            <div className="flex justify-between items-center bg-black/60 border border-green-900 p-2">
                <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
                    <Camera size={16} /> GLOBAL SURVEILLANCE GRID
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setUseLive(!useLive)}
                        className={`px-2 py-1 text-[10px] border ${useLive ? 'bg-red-900/50 border-red-500 text-red-500' : 'bg-green-900/20 border-green-700 text-green-700'}`}
                    >
                        {useLive ? 'LIVE FEED' : 'SIMULATION'}
                    </button>
                    <button onClick={() => setShowSettings(!showSettings)} className="p-1 hover:text-green-400">
                        <Settings size={16} />
                    </button>
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="absolute top-12 right-2 z-20 bg-black border border-green-500 p-4 w-64 shadow-lg">
                    <h3 className="text-xs font-bold mb-2 text-green-400">API CONFIGURATION</h3>
                    <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => saveKey(e.target.value)}
                        placeholder="ENTER WINDY API KEY"
                        className="w-full bg-green-900/20 border border-green-700 p-2 text-[10px] text-green-400 mb-2"
                    />
                    <div className="text-[9px] text-green-700">
                        Get key at: api.windy.com/webcams
                    </div>
                    <button onClick={() => setShowSettings(false)} className="mt-2 w-full bg-green-900/30 border border-green-600 text-[10px] py-1 hover:bg-green-500 hover:text-black">
                        CLOSE
                    </button>
                </div>
            )}

            {/* Grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 overflow-y-auto custom-scrollbar relative">
                {loading && (
                    <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center">
                        <div className="text-green-500 flex flex-col items-center gap-2">
                            <Loader className="animate-spin" />
                            <span className="text-xs animate-pulse">ESTABLISHING UPLINK...</span>
                        </div>
                    </div>
                )}

                {(useLive && cams.length > 0 ? cams : Array.from({ length: 16 })).map((cam, i) => {
                    const isReal = useLive && cam;
                    const imgSrc = isReal ? (cam as Webcam).image.current.preview : FALLBACK_CAMS[i % FALLBACK_CAMS.length];
                    const title = isReal ? (cam as Webcam).title : `CAM_FEED_${i + 101}`;
                    const loc = isReal ? `${(cam as Webcam).location.city}, ${(cam as Webcam).location.country}` : 'UNKNOWN LOCATION';

                    return (
                        <div key={i} className="relative border border-green-900/50 bg-black group overflow-hidden aspect-video">
                            {/* Image */}
                            <img
                                src={imgSrc}
                                alt="feed"
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity filter sepia-[.5] hue-rotate-[50deg]"
                            />

                            {/* Scanlines Overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none"></div>

                            {/* Metadata Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-1 flex justify-between items-center border-t border-green-900/50">
                                <div>
                                    <div className="text-[9px] font-bold text-green-400 truncate w-24">{title}</div>
                                    <div className="text-[8px] text-green-700 flex items-center gap-1">
                                        <MapPin size={8} /> {loc}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                    <span className="text-[8px] text-red-500 font-bold">REC</span>
                                </div>
                            </div>

                            {/* Corner Markers */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500/50"></div>
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-500/50"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green-500/50"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500/50"></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CamGrid;
