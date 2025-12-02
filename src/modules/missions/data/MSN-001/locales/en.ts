export const en = {
    title: "Training: Signal Trace",
    briefing: "Basic Terminal training. Trace a suspicious IP address.",
    fullDescription: "Welcome to CyberOS. Your first task is to learn the basics of the Terminal module. We have detected unauthorized access attempts from IP address 198.51.100.55. Use the 'ipinfo' command to identify the city of origin.",
    warnings: [
        "Training Simulation",
        "Module: Terminal"
    ],
    objectives: {
        trace_ip: {
            description: "Identify the city of origin for IP 198.51.100.55 using 'ipinfo'",
            on_complete: "Trace complete. Origin identified: Seattle."
        }
    },
    checklist: {
        trace_ip: "Trace IP 198.51.100.55"
    },
    target: "Unknown Source",
    location: "Unknown",
    estimatedTime: "5 min"
};
