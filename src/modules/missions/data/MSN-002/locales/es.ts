export const es = {
    title: "Entrenamiento: Geolocalización",
    briefing: "Combina inteligencia de Terminal con Geo Rastreo.",
    fullDescription: "Buen trabajo con el rastreo. Ahora necesitamos correlacionar señales digitales con ubicaciones físicas. Hemos interceptado una señal de la IP 212.58.244.23. Rastréala para encontrar las coordenadas, luego usa el Geo Rastreador para identificar la instalación específica en esa ubicación.",
    warnings: [
        "Simulación de Entrenamiento",
        "Módulos: Terminal, Geo Rastreo"
    ],
    moduleData: {
        geoTracker: {
            name: "Canary Wharf Financial Hub",
            description: "Un denso grupo de rascacielos bancarios en Londres donde el capital global fluye intersectado con algoritmos de trading de alta frecuencia.",
            insights: "Aviso de Interpol: El rastreo de una billetera criptográfica específica nos llevó aquí. Alguien en la Torre Sterling está lavando fondos para el Grupo Lazarus."
        }
    },
    questions: {
        city: "¿En qué ciudad está el objetivo?",
        facility: "¿Cuál es el nombre de la instalación?"
    },
    objectives: {
        trace_signal: {
            description: "Rastrear Coordenadas de la Fuente de Señal",
            on_complete: "Señal rastreada a 51.5045,-0.0183. Coordenadas adquiridas."
        },
        identify_facility: {
            description: "Identificar Instalación Objetivo",
            on_complete: "Instalación objetivo identificada: Canary Wharf Financial Hub."
        }
    },
    target: "Nodo Financiero",
    location: "Londres, UK",
    estimatedTime: "10 min"
};
