export const en = {
    title: "Training: Geo Location",
    briefing: "Combine Terminal intel with Geo Tracking.",
    fullDescription: "Good work on the trace. Now we need to correlate digital signals with physical locations. We've intercepted a signal from IP 212.58.244.23. Trace it to find the coordinates, then use the Geo Tracker to identify the specific facility at that location.",
    warnings: [
        "Training Simulation",
        "Modules: Terminal, Geo Tracker"
    ],
    moduleData: {
        geoTracker: {
            name: "Canary Wharf Financial Hub",
            description: "A dense cluster of banking skyscrapers in London where global capital flows intersect with high-frequency trading algorithms.",
            insights: "Interpol Notice: Tracing a specific crypto-wallet led us here. Someone in the Sterling Tower is washing funds for the Lazarus Group."
        }
    },
    questions: {
        city: "Which city is the target in?",
        facility: "What is the name of the facility?"
    },
    objectives: {
        trace_signal: {
            description: "Trace Signal Source Coordinates",
            on_complete: "Signal traced to 51.5045,-0.0183. Coordinates acquired."
        },
        identify_facility: {
            description: "Identify Target Facility",
            on_complete: "Target facility identified: Canary Wharf Financial Hub."
        }
    },
    target: "Financial Node",
    location: "London, UK",
    estimatedTime: "10 min"
};
