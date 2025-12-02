export const es = {
    title: "Entrenamiento: Rastreo de Señal",
    briefing: "Entrenamiento básico de Terminal. Rastrea una IP sospechosa.",
    fullDescription: "Bienvenido a CyberOS. Tu primera tarea es aprender los conceptos básicos del módulo Terminal. Hemos detectado intentos de acceso no autorizados desde la dirección IP 198.51.100.55. Usa el comando 'ipinfo' para identificar la ciudad de origen.",
    warnings: [
        "Simulación de Entrenamiento",
        "Módulo: Terminal"
    ],
    objectives: {
        trace_ip: {
            description: "Identifica la ciudad de origen para la IP 198.51.100.55 usando 'ipinfo'",
            on_complete: "Rastreo completo. Origen identificado: Seattle."
        }
    },
    checklist: {
        trace_ip: "Rastrear IP 198.51.100.55"
    },
    target: "Fuente Desconocida",
    location: "Desconocido",
    estimatedTime: "5 min"
};
