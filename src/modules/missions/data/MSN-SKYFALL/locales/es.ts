export const es = {
    title: "Operación Skyfall",
    briefing: "Intercepta el control del satélite rebelde. Previene el impacto orbital.",
    fullDescription: "Hemos detectado que un satélite soviético fuera de servicio, KOSMOS-2499, ha sido reactivado y está en una órbita que decae rápidamente. El análisis de trayectoria indica un curso de colisión dirigido a un centro de población importante. Tu misión es rastrear la señal de control, hackear la estación terrestre para recuperar el parche de estabilización, y subirlo al satélite antes del impacto.",
    warnings: [
        "IMPACTO INMINENTE",
        "DECAIMIENTO ORBITAL DETECTADO",
        "FUENTE DE SEÑAL HOSTIL"
    ],
    moduleData: {
        netWarfare: {
            syslog: "Conexión establecida a kosmos-control.ru [198.51.100.200] vía túnel seguro."
        },
        satellite: {
            description: "Satélite de reconocimiento fuera de servicio. Reactivado por actor desconocido.",
            completionMessage: "PARCHE APLICADO EXITOSAMENTE. ÓRBITA ESTABILIZADA. COLISIÓN EVITADA.",
            resetDescription: "Satélite soviético restaurado. Operando dentro de parámetros normales.",
            telemetry: [
                "ADVERTENCIA: DECAIMIENTO ORBITAL DETECTADO",
                "ALTITUD CRÍTICA",
                "TRAYECTORIA DE IMPACTO CONFIRMADA",
                "COORDENADAS OBJETIVO: 51.5007° N, 0.1246° W",
                "IMPACTO: T-MENOS 1 HORA"
            ],
            sensorMeta: "BLOQUEO ÓPTICO ESTABLECIDO // IMPACTO INMINENTE"
        },
        geoTracker: {
            name: "Palacio de Westminster",
            description: "Sede del Parlamento del Reino Unido. Hito icónico y centro de población de alta densidad."
        }
    },
    questions: {
        id: "¿Cuál es el ID del satélite?",
        target: "¿Dónde es el objetivo de impacto?",
        file: "¿Cuál es el nombre del archivo de parche?"
    },
    objectives: {
        decrypt: {
            description: "Desencriptar Telemetría Satelital",
            on_complete: "Telemetría desencriptada. Coordenadas adquiridas."
        },
        jam: {
            description: "Interferir Señal KOSMOS-2499",
            on_complete: "Señal interferida. Control del satélite cortado."
        },
        recover: {
            description: "Estabilizar Órbita KOSMOS-2499",
            on_complete: "Órbita estabilizada. Misión cumplida."
        }
    },
    target: "KOSMOS-2499",
    location: "Órbita Terrestre Baja",
    estimatedTime: "45 min",
    documents: {
        decay: {
            title: "Análisis de Decaimiento",
            meta: {
                classification: "ALTO SECRETO",
                date: "HOY"
            },
            data: {
                briefing: "Órbita decayendo. Fuente rastreada a Roscosmos Legacy Relay. Verificación de integridad de datos requerida.",
                assets: [
                    "IP de Relay Sospechosa: 45.33.22.11"
                ]
            }
        },
        signal: {
            title: "Señal Interceptada",
            meta: {
                classification: "SIGINT",
                date: "HOY"
            },
            data: {
                content: "FLUJO ENCRIPTADO DETECTADO... ORIGEN: 45.33.22.11"
            }
        },
        weather: {
            title: "Reporte Meteorológico",
            meta: {
                paperName: "DIARIO METEO",
                date: "HOY",
                price: "GRATIS"
            },
            data: {
                headline: "ACTIVIDAD ATMOSFÉRICA INUSUAL",
                subhead: "Perturbaciones ionosféricas reportadas sobre el Hemisferio Norte",
                imageCaption: "Mapa de densidad atmosférica",
                columns: [
                    "Los meteorólogos están desconcertados por picos repentinos en la densidad atmosférica superior. Aunque la actividad solar es baja, estas perturbaciones localizadas podrían afectar los coeficientes de arrastre de los satélites.",
                    "Los expertos aconsejan a los operadores de satélites monitorear de cerca las tasas de decaimiento orbital."
                ]
            }
        }
    }
};
