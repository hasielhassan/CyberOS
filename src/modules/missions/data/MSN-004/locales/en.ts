export const en = {
    title: "Silent Echo",
    briefing: "Intercept Dr. Aris Thorne before he leaks Project Chimera blueprints.",
    fullDescription: "Dr. Aris Thorne, a former lead scientist on Project Chimera, has gone rogue. Intelligence suggests he plans to sell the blueprints to a criminal syndicate. We have traced his last known IP to 45.12.89.33. Use the Terminal to confirm the city, the Geo Tracker to locate his safehouse, and Surveillance to identify the extraction vehicle and location code.",
    warnings: [
        "Subject is paranoid and may flee",
        "Heavily guarded compound",
        "Time-sensitive operation"
    ],
    moduleData: {
        geoTracker: {
            name: "Safehouse 4",
            description: "A disused industrial warehouse in East Berlin. Thermal scans indicate recent occupancy.",
            insights: "Surveillance Log: Encrypted radio burst detected at 0300 hours. Matches Dr. Thorne's signal signature."
        },
        surveillance: {
            cam1: {
                name: "SAFEHOUSE INTERIOR",
                description: "Target identified: Dr. Aris Thorne. Location Code: Applepine #5395 visible on camera feed."
            },
            cam2: {
                name: "ALLEYWAY EXIT",
                description: "Extraction vehicle moving from location. Vehicle Type: White Van. Plate: UNKNOWN."
            }
        }
    },
    questions: {
        city: "Which city is Dr. Aris Thorne located on?",
        code: "What is the target's location code?",
        vehicle: "What type of vehicle is waiting?"
    },
    target: "Dr. Aris Thorne",
    location: "Berlin, Germany",
    estimatedTime: "20-30 min",
    documents: {
        file: {
            title: "Dr. Thorne's Personnel File"
        },
        brief: {
            title: "Project Chimera Brief",
            meta: {
                classification: "TOP SECRET"
            },
            data: {
                target: "Advanced AI Development",
                briefing: "Project Chimera represents our most advanced artificial intelligence initiative. The system is capable of predictive analysis at unprecedented scales. If this technology falls into the wrong hands, global security is at risk.",
                assets: [
                    "Quantum Processor",
                    "Neural Network Core",
                    "Encryption Keys"
                ]
            }
        }
    }
};
