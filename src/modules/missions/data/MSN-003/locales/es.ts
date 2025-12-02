export const es = {
    title: "Operación Hola Mundo",
    briefing: "Rastreo de espectro completo. Rastrea a un ladrón e identifica su transporte.",
    fullDescription: "Una laptop confidencial que contiene planos del Proyecto Zero fue robada de nuestra oficina en Ámsterdam. Hemos logrado rastrear la dirección IP del ladrón a 185.93.180.131. Tu misión es usar la Terminal para rastrear la señal, identificar la ciudad, confirmar la ubicación usando el Geo Rastreador e identificar el vuelo que están usando para escapar.",
    warnings: [
        "Operación en Vivo",
        "Objetivo en Movimiento",
        "Sensible al Tiempo"
    ],
    moduleData: {
        geoTracker: {
            name: "Oberon Dynamics",
            description: "Firma de ingeniería alemana innovadora especializada en laptops de alto rendimiento para los sectores corporativo y creativo",
            insights: "Perspectivas Policiales y Chismes de Espionaje Corporativo: Rumores sugieren posibles violaciones de datos y conflictos internos dentro de algunas grandes empresas tecnológicas."
        }
    },
    questions: {
        city: "¿En qué ciudad se encuentra el ladrón?",
        company: "¿Para qué compañía trabaja el ladrón?",
        transport: "¿Qué transporte usó el ladrón?"
    },
    objectives: {
        trace_ip: {
            description: "Rastrear la fuente de la señal para la IP 185.93.180.131",
            on_complete: "Señal rastreada a Frankfurt, Alemania."
        },
        identify_city: {
            description: "Obtener información detallada de IP para identificar la ciudad",
            on_complete: "Ubicación confirmada: Frankfurt."
        },
        locate_target: {
            description: "Localizar Compañía en Geo Rastreador",
            on_complete: "Ubicación objetivo identificada."
        },
        identify_flight: {
            description: "Identificar el transporte de escape saliendo",
            on_complete: "Vuelo de escape identificado."
        }
    },
    target: "Ladrón Desconocido",
    location: "Desconocido (Rastreo Requerido)",
    estimatedTime: "15 min",
    documents: {
        report: {
            title: "Reporte de Laptop Robada",
            meta: {
                paperName: "DIARIO TECH",
                date: "20 de Noviembre, 2025",
                price: "Gratis",
                vol: "V.12"
            },
            data: {
                headline: "ROBO TECH EN ÁMSTERDAM",
                subhead: "Se sospecha espionaje corporativo tras la desaparición de laptop del Proyecto Zero",
                imageCaption: "El dispositivo robado contenía planos sensibles",
                columns: [
                    "Imágenes de seguridad muestran a un individuo con sudadera roja entrando al edificio a las 2:47 AM. El sospechoso burló tres puntos de control de seguridad usando lo que parece ser una tarjeta de acceso clonada.",
                    "Las autoridades están trabajando con expertos en ciberseguridad para rastrear la última conexión de red conocida del dispositivo."
                ],
                sidebar: {
                    title: "RECOMPENSA",
                    content: "500 BTC ofrecidos por información que conduzca a la recuperación."
                }
            }
        }
    }
};
