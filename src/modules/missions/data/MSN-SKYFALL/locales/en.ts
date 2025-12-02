export const en = {
    title: "Operation Skyfall",
    briefing: "Intercept rogue satellite control. Prevent orbital impact.",
    fullDescription: "We have detected a decommissioned Soviet satellite, KOSMOS-2499, has been reactivated and is in a rapidly decaying orbit. Trajectory analysis indicates a targeted collision course with a major population center. Your mission is to trace the control signal, hack the ground station to retrieve the stabilization patch, and upload it to the satellite before impact.",
    warnings: [
        "IMPACT IMMINENT",
        "ORBITAL DECAY DETECTED",
        "HOSTILE SIGNAL SOURCE"
    ],
    moduleData: {
        netWarfare: {
            syslog: "Connection established to kosmos-control.ru [198.51.100.200] via secure tunnel."
        },
        satellite: {
            description: "Decommissioned reconnaissance satellite. Reactivated by unknown actor.",
            completionMessage: "PATCH APPLIED SUCCESSFULLY. ORBIT STABILIZED. COLLISION AVOIDED.",
            resetDescription: "Restored Soviet satellite. Operating within normal parameters.",
            telemetry: [
                "WARNING: ORBIT DECAY DETECTED",
                "ALTITUDE CRITICAL",
                "IMPACT TRAJECTORY CONFIRMED",
                "TARGET COORDINATES: 51.5007° N, 0.1246° W",
                "IMPACT: T-MINUS 1 HOUR"
            ],
            sensorMeta: "OPTICAL LOCK ESTABLISHED // IMPACT IMMINENT"
        },
        geoTracker: {
            name: "Palace of Westminster",
            description: "Seat of the UK Parliament. Iconic landmark and high-density population center."
        }
    },
    questions: {
        id: "What is the satellite ID?",
        target: "Where is the impact target?",
        file: "What is the name of the patch file?"
    },
    objectives: {
        decrypt: {
            description: "Decrypt Satellite Telemetry",
            on_complete: "Telemetry decrypted. Coordinates acquired."
        },
        jam: {
            description: "Jam KOSMOS-2499 Signal",
            on_complete: "Signal jammed. Satellite control severed."
        },
        recover: {
            description: "Stabilize KOSMOS-2499 Orbit",
            on_complete: "Orbit stabilized. Mission accomplished."
        }
    },
    target: "KOSMOS-2499",
    location: "Low Earth Orbit",
    estimatedTime: "45 min",
    documents: {
        decay: {
            title: "Decay Analysis",
            meta: {
                classification: "TOP SECRET",
                date: "TODAY"
            },
            data: {
                briefing: "Orbit decaying. Source traced to Roscosmos Legacy Relay. Data integrity check required.",
                assets: [
                    "Suspected Relay IP: 45.33.22.11"
                ]
            }
        },
        signal: {
            title: "Intercepted Signal",
            meta: {
                classification: "SIGINT",
                date: "TODAY"
            },
            data: {
                content: "ENCRYPTED STREAM DETECTED... ORIGIN: 45.33.22.11"
            }
        },
        weather: {
            title: "Weather Report",
            meta: {
                paperName: "METEO DAILY",
                date: "TODAY",
                price: "FREE"
            },
            data: {
                headline: "UNUSUAL ATMOSPHERIC ACTIVITY",
                subhead: "Ionospheric disturbances reported over Northern Hemisphere",
                imageCaption: "Atmospheric density map",
                columns: [
                    "Meteorologists are puzzled by sudden spikes in upper atmospheric density. While solar activity is low, these localized disturbances could affect satellite drag coefficients.",
                    "Experts advise satellite operators to monitor orbital decay rates closely."
                ]
            }
        }
    }
};
