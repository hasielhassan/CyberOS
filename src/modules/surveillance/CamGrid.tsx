

const CamGrid = () => {
    // Using some placeholder looping GIFs for "security footage" feel
    const feeds = [
        "https://media.giphy.com/media/3o6vXCKXwIq3O6X5Sw/giphy.gif", // Static/Glitch
        "https://media.giphy.com/media/l0HlO4p8jV8ZJ3lJ6/giphy.gif", // Traffic
        "https://media.giphy.com/media/3o7TKrEzvJbsOAov60/giphy.gif", // Server room
        "https://media.giphy.com/media/l2JHVUriDGEtWOx0c/giphy.gif"  // Coding
    ];

    return (
        <div className="grid grid-cols-2 gap-2 h-full p-2">
            {feeds.map((src, i) => (
                <div key={i} className="relative border border-green-800 bg-black overflow-hidden group">
                    <img src={src} className="w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-opacity grayscale" />
                    <div className="absolute top-2 left-2 bg-black/50 px-2 text-xs text-red-500 animate-pulse">REC • LIVE</div>
                    <div className="absolute bottom-2 right-2 text-[10px] font-code bg-black/50 px-1">CAM_{100 + i} // SECTOR_{i + 1}</div>
                    <div className="absolute inset-0 pointer-events-none scanline opacity-20"></div>
                </div>
            ))}
        </div>
    );
};

export default CamGrid;
