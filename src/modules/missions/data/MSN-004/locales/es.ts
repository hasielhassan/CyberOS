export const es = {
    title: "Eco Silencioso",
    briefing: "Intercepta al Dr. Aris Thorne antes de que filtre los planos del Proyecto Quimera.",
    fullDescription: "El Dr. Aris Thorne, ex científico principal del Proyecto Quimera, ha desertado. La inteligencia sugiere que planea vender los planos a un sindicato criminal. Hemos rastreado su última IP conocida a 45.12.89.33. Usa la Terminal para confirmar la ciudad, el Geo Rastreador para localizar su casa de seguridad, y Vigilancia para identificar el vehículo de extracción y el código de ubicación.",
    warnings: [
        "El sujeto es paranoico y puede huir",
        "Compuesto fuertemente custodiado",
        "Operación sensible al tiempo"
    ],
    moduleData: {
        geoTracker: {
            name: "Casa de Seguridad 4",
            description: "Un almacén industrial en desuso en Berlín Oriental. Escaneos térmicos indican ocupación reciente.",
            insights: "Registro de Vigilancia: Ráfaga de radio encriptada detectada a las 0300 horas. Coincide con la firma de señal del Dr. Thorne."
        },
        surveillance: {
            cam1: {
                name: "INTERIOR CASA SEGURIDAD",
                description: "Objetivo identificado: Dr. Aris Thorne. Código de Ubicación: Applepine #5395 visible en la transmisión."
            },
            cam2: {
                name: "SALIDA CALLEJÓN",
                description: "Vehículo de extracción moviéndose desde la ubicación. Tipo de Vehículo: Furgoneta Blanca. Placa: DESCONOCIDA."
            }
        }
    },
    questions: {
        city: "¿En qué ciudad se encuentra el Dr. Aris Thorne?",
        code: "¿Cuál es el código de ubicación del objetivo?",
        vehicle: "¿Qué tipo de vehículo está esperando?"
    },
    target: "Dr. Aris Thorne",
    location: "Berlín, Alemania",
    estimatedTime: "20-30 min",
    documents: {
        file: {
            title: "Archivo de Personal del Dr. Thorne"
        },
        brief: {
            title: "Informe del Proyecto Quimera",
            meta: {
                classification: "ALTO SECRETO"
            },
            data: {
                target: "Desarrollo de IA Avanzada",
                briefing: "El Proyecto Quimera representa nuestra iniciativa de inteligencia artificial más avanzada. El sistema es capaz de análisis predictivo a escalas sin precedentes. Si esta tecnología cae en las manos equivocadas, la seguridad global está en riesgo.",
                assets: [
                    "Procesador Cuántico",
                    "Núcleo de Red Neuronal",
                    "Claves de Encriptación"
                ]
            }
        }
    }
};
