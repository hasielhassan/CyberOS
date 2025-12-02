export const en = {
    title: "Operation Hello World",
    briefing: "Full spectrum tracking. Trace a thief and identify their transport.",
    fullDescription: "A confidential laptop containing Project Zero blueprints was stolen from our Amsterdam office. We've managed to trace the thief's IP address to 185.93.180.131. Your mission is to use the Terminal to trace the signal, identify the city, confirm the location using the Geo Tracker, and identify the flight they are using to escape.",
    warnings: [
        "Live Operation",
        "Moving Target",
        "Time Sensitive"
    ],
    moduleData: {
        geoTracker: {
            name: "Oberon Dynamics",
            description: "Innovative German engineering firm specializing in high-performance laptops for the corporate and creative sectors",
            insights: "Police Insights & Corporate Espionage Gossip: Rumors circulating suggest possible data breaches and internal conflicts within some major tech companies."
        }
    },
    questions: {
        city: "Which city is the thief located on?",
        company: "Which company does the thief work for?",
        transport: "Which transportation did the thief used?"
    },
    objectives: {
        trace_ip: {
            description: "Trace the signal source for IP 185.93.180.131",
            on_complete: "Signal traced to Frankfurt, Germany."
        },
        identify_city: {
            description: "Get detailed IP information to identify the city",
            on_complete: "Location confirmed: Frankfurt."
        },
        locate_target: {
            description: "Locate Company in Geo Tracker",
            on_complete: "Target location identified."
        },
        identify_flight: {
            description: "Identify the escape transport leaving",
            on_complete: "Escape flight identified."
        }
    },
    target: "Unknown Thief",
    location: "Unknown (Trace Required)",
    estimatedTime: "15 min",
    documents: {
        report: {
            title: "Stolen Laptop Report",
            meta: {
                paperName: "TECH DAILY",
                date: "November 20, 2025",
                price: "Free",
                vol: "V.12"
            },
            data: {
                headline: "TECH THEFT IN AMSTERDAM",
                subhead: "Corporate espionage suspected as Project Zero laptop goes missing",
                imageCaption: "The stolen device contained sensitive blueprints",
                columns: [
                    "Security footage shows an individual in a red hoodie entering the building at 2:47 AM. The suspect bypassed three security checkpoints using what appears to be a cloned access card.",
                    "Authorities are working with cybersecurity experts to trace the device's last known network connection."
                ],
                sidebar: {
                    title: "REWARD",
                    content: "500 BTC offered for information leading to recovery."
                }
            }
        }
    }
};
