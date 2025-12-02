export const getDirectoryData = (t: (key: string) => string) => [
    // --- AGENTS ---
    {
        "id": "AGT-001",
        "name": "Viper",
        "role": "AGENT",
        "status": "ACTIVE",
        "avatar": "https://randomuser.me/api/portraits/women/44.jpg",
        "email": "viper@cyber-int.gov",
        "phone": "555-0101",
        "cell": "555-0199",
        "dob": "1995-03-12",
        "details": {
            "age": 29,
            "occupation": t('dir.prof.viper.occ'),
            "location": t('dir.prof.viper.loc'),
            "nationality": t('dir.prof.viper.nat')
        },
        "hiddenInfo": {
            "realName": "Natasha V.",
            "clearanceLevel": "LEVEL 5",
            "notes": t('dir.prof.viper.notes'),
            "knownAssociates": [
                t('dir.prof.baron.name'),
                "Agent 004"
            ]
        },
        "documents": [
            {
                "title": t('dir.doc.service_record'),
                "type": "identity",
                "meta": {
                    "issueDate": "2024-01-15",
                    "agency": "CYBER-INT",
                    "clearance": "LEVEL 5"
                },
                "data": {
                    "surname": "V.",
                    "firstname": "NATASHA",
                    "idNumber": "AGT-001",
                    "dob": "1995-03-12",
                    "photoUrl": "https://randomuser.me/api/portraits/women/44.jpg",
                    "sex": "F",
                    "height": "170cm",
                    "signature": "N. Viper"
                }
            },
            {
                "title": t('dir.doc.mission_nightfall'),
                "type": "mission",
                "meta": {
                    "classification": "TOP SECRET",
                    "copy": "1 of 1",
                    "date": "24 NOV 2025"
                },
                "data": {
                    "operation": "NIGHTFALL",
                    "target": t('dir.doc.nightfall.target'),
                    "briefing": t('dir.doc.nightfall.briefing'),
                    "assets": [
                        t('dir.doc.nightfall.asset1'),
                        t('dir.doc.nightfall.asset2'),
                        t('dir.doc.nightfall.asset3')
                    ],
                    "intel_photo": "https://placehold.co/200x200/555/fff?text=TARGET+BLDG"
                }
            },
            {
                "title": t('dir.doc.baron_dossier'),
                "type": "dossier",
                "meta": {
                    "fileId": "X-RED-SYNDICATE",
                    "status": "WANTED"
                },
                "data": {
                    "name": "Victor Doom",
                    "alias": "The Baron",
                    "dob": "1979-05-15",
                    "nationality": "Latverian",
                    "affiliation": "Red Syndicate",
                    "photoUrl": "https://randomuser.me/api/portraits/men/22.jpg",
                    "summary": "International arms dealer. Extremely dangerous.",
                    "associates": ["Viper", "Jackal"]
                }
            }
        ]
    },
    {
        "id": "AGT-004",
        "name": "Agent 004",
        "role": "AGENT",
        "status": "MIA",
        "avatar": "https://randomuser.me/api/portraits/men/32.jpg",
        "email": "agent004@cyber-int.gov",
        "phone": "555-0104",
        "cell": "555-0198",
        "dob": "1988-11-05",
        "details": {
            "age": 36,
            "occupation": "Field Operative",
            "location": "Unknown",
            "nationality": "American"
        },
        "hiddenInfo": {
            "realName": "James K.",
            "clearanceLevel": "LEVEL 4",
            "notes": "Last seen in sector 7. Presumed compromised.",
            "knownAssociates": ["Viper"]
        },
        "documents": [
            {
                "title": t('dir.doc.comms_log'),
                "type": "email_thread",
                "meta": {
                    "date": "2025-10-20"
                },
                "data": {
                    "subject": "Operation Blackout",
                    "from": "agent004@cyber-int.gov",
                    "to": "handler@cyber-int.gov",
                    "emails": [
                        { "from": "Agent 004", "date": "09:00 AM", "body": "Sector 7 is compromised. I'm going dark." },
                        { "from": "Handler", "date": "09:05 AM", "body": "Copy. Initiate protocol GHOST." }
                    ]
                }
            }
        ]
    },
    {
        "id": "AGT-007",
        "name": "Spectre",
        "role": "AGENT",
        "status": "ACTIVE",
        "avatar": "https://randomuser.me/api/portraits/men/85.jpg",
        "email": "spectre@cyber-int.gov",
        "phone": "555-0007",
        "cell": "555-0999",
        "dob": "1985-07-07",
        "details": {
            "age": 39,
            "occupation": "Infiltration Specialist",
            "location": "London, UK",
            "nationality": "British"
        },
        "hiddenInfo": {
            "realName": "Unknown",
            "clearanceLevel": "LEVEL 5",
            "notes": "Highly classified profile.",
            "knownAssociates": []
        },
        "documents": [
            {
                "title": t('dir.doc.access_card'),
                "type": "credential",
                "meta": {
                    "agency": "CYBER-INT",
                    "clearanceLevel": "LEVEL 5"
                },
                "data": {
                    "name": "Spectre",
                    "department": "Special Ops",
                    "idNumber": "007-X",
                    "photoUrl": "https://randomuser.me/api/portraits/men/85.jpg"
                }
            }
        ]
    },
    {
        "id": "AGT-012",
        "name": "Rook",
        "role": "AGENT",
        "status": "ACTIVE",
        "avatar": "https://randomuser.me/api/portraits/women/65.jpg",
        "email": "rook@cyber-int.gov",
        "phone": "555-0012",
        "cell": "555-0112",
        "dob": "1992-02-28",
        "details": {
            "age": 32,
            "occupation": "Tactical Support",
            "location": "Berlin, DE",
            "nationality": "German"
        },
        "hiddenInfo": {
            "realName": "Elena S.",
            "clearanceLevel": "LEVEL 3",
            "notes": "Expert in urban warfare.",
            "knownAssociates": []
        },
        "documents": [
            {
                "title": t('dir.doc.berlin_map'),
                "type": "map",
                "meta": {
                    "scale": "1:10000"
                },
                "data": {
                    "locationName": "Berlin Safehouse",
                    "coordinates": "52.5200° N, 13.4050° E",
                    "mapImageUrl": "https://placehold.co/600x400/222/fff?text=BERLIN+MAP",
                    "notes": "Safehouse located in abandoned metro station.",
                    "markers": [
                        { "x": "45%", "y": "30%", "label": "Entry" },
                        { "x": "60%", "y": "70%", "label": "Exit" }
                    ]
                }
            }
        ]
    },

    // --- CRIMINALS ---
    {
        "id": "CRM-992",
        "name": t('dir.prof.baron.name'),
        "role": "CRIMINAL",
        "status": "WANTED",
        "avatar": "https://randomuser.me/api/portraits/men/22.jpg",
        "email": "baron@darknet.onion",
        "phone": "Unknown",
        "cell": "Unknown",
        "dob": "1979-05-15",
        "details": {
            "age": 45,
            "occupation": t('dir.prof.baron.occ'),
            "location": t('dir.prof.baron.loc'),
            "nationality": "Latverian"
        },
        "hiddenInfo": {
            "realName": "Victor D.",
            "clearanceLevel": "NONE",
            "notes": t('dir.prof.baron.notes'),
            "knownAssociates": [
                "Viper (Surveillance Target)"
            ]
        },
        "documents": [
            {
                "title": t('dir.doc.wanted_poster'),
                "type": "newspaper",
                "meta": {
                    "paperName": "GLOBAL TIMES",
                    "date": "October 15, 2024",
                    "price": "5.00",
                    "vol": "CDXLII"
                },
                "data": {
                    "headline": t('dir.doc.wanted.headline'),
                    "subhead": t('dir.doc.wanted.subhead'),
                    "leadImage": "https://placehold.co/600x300/333/fff?text=WANTED",
                    "imageCaption": t('dir.doc.wanted.caption'),
                    "columns": [
                        t('dir.doc.wanted.col1'),
                        t('dir.doc.wanted.col2')
                    ],
                    "sidebar": {
                        "title": t('dir.doc.wanted.reward'),
                        "content": "5,000,000 BTC for verified intel."
                    }
                }
            }
        ]
    },
    {
        "id": "CRM-101",
        "name": "The Jackal",
        "role": "CRIMINAL",
        "status": "WANTED",
        "avatar": "https://randomuser.me/api/portraits/men/11.jpg",
        "email": "jackal@encrypted.net",
        "phone": "Unknown",
        "cell": "Unknown",
        "dob": "1982-09-21",
        "details": {
            "age": 42,
            "occupation": "Mercenary",
            "location": "Mobile",
            "nationality": "French"
        },
        "hiddenInfo": {
            "realName": "Pierre L.",
            "clearanceLevel": "NONE",
            "notes": "Wanted for multiple high-profile assassinations.",
            "knownAssociates": ["The Baron"]
        },
        "documents": [
            {
                "title": t('dir.doc.evidence_knife'),
                "type": "evidence",
                "meta": {
                    "date": "2024-11-01"
                },
                "data": {
                    "caseNumber": "C-24-992",
                    "exhibitId": "E-492",
                    "description": "Sniper Rifle ( disassembled )",
                    "recoveredFrom": "Hotel Room 404",
                    "analysis": "Ballistics match the assassination.",
                    "imageUrl": "https://placehold.co/400x300/111/fff?text=RIFLE",
                    "chainOfCustody": [
                        { "timestamp": "14:00", "releasedBy": "Det. Smith", "receivedBy": "Forensics", "purpose": "Analysis" }
                    ]
                }
            }
        ]
    },
    {
        "id": "CRM-204",
        "name": "Cipher",
        "role": "CRIMINAL",
        "status": "INCARCERATED",
        "avatar": "https://randomuser.me/api/portraits/women/90.jpg",
        "email": "cipher@jail.net",
        "phone": "N/A",
        "cell": "N/A",
        "dob": "1998-12-01",
        "details": {
            "age": 26,
            "occupation": "Black Hat Hacker",
            "location": "Supermax Facility 4",
            "nationality": "Russian"
        },
        "hiddenInfo": {
            "realName": "Irina K.",
            "clearanceLevel": "NONE",
            "notes": "Serving 25 years for cyber-terrorism.",
            "knownAssociates": []
        },
        "documents": [
            {
                "title": t('dir.doc.interrogation'),
                "type": "transcript",
                "meta": {
                    "caseId": "INT-204",
                    "date": "2025-01-05",
                    "participants": "Interrogator, Cipher"
                },
                "data": {
                    "lines": [
                        { "speaker": "Interrogator", "text": "Where is the server?", "timestamp": "10:00:00" },
                        { "speaker": "Cipher", "text": "I'll never tell you.", "timestamp": "10:00:05" },
                        { "speaker": "Interrogator", "text": "We have your logs.", "timestamp": "10:00:15" }
                    ]
                }
            }
        ]
    },
    {
        "id": "CRM-305",
        "name": "Ghostface",
        "role": "CRIMINAL",
        "status": "WANTED",
        "avatar": "https://randomuser.me/api/portraits/men/55.jpg",
        "email": "ghost@unknown.net",
        "phone": "Unknown",
        "cell": "Unknown",
        "dob": "1990-01-01",
        "details": {
            "age": 34,
            "occupation": "Smuggler",
            "location": "Southeast Asia",
            "nationality": "Thai"
        },
        "hiddenInfo": {
            "realName": "Unknown",
            "clearanceLevel": "NONE",
            "notes": "Specializes in smuggling high-tech contraband.",
            "knownAssociates": []
        },
        "documents": []
    },

    // --- SCIENTISTS ---
    {
        "id": "SCI-042",
        "name": "Dr. Ada Love",
        "role": "SCIENTIST",
        "status": "RESEARCH",
        "avatar": "https://randomuser.me/api/portraits/women/26.jpg",
        "email": "ada.love@cyberos.lab",
        "phone": "555-0042",
        "cell": "555-0142",
        "dob": "1992-06-20",
        "details": {
            "age": 32,
            "occupation": t('dir.prof.ada.occ'),
            "location": "CyberOS R&D Lab",
            "nationality": "British"
        },
        "hiddenInfo": {
            "realName": "Ada L.",
            "clearanceLevel": "LEVEL 4",
            "notes": t('dir.prof.ada.notes'),
            "knownAssociates": []
        },
        "documents": [
            {
                "title": t('dir.doc.phd_cert'),
                "type": "certificate",
                "meta": {
                    "id": "UNI-OX-22",
                    "issued": "2018-06-20",
                    "colorTheme": "#4c1d95"
                },
                "data": {
                    "header": t('dir.doc.phd.header'),
                    "recipient": "Ada Love",
                    "body": t('dir.doc.phd.body'),
                    "signature": "Chancellor H."
                }
            }
        ]
    },
    {
        "id": "SCI-088",
        "name": "Dr. Emmett B.",
        "role": "SCIENTIST",
        "status": "ACTIVE",
        "avatar": "https://randomuser.me/api/portraits/men/76.jpg",
        "email": "emmett.brown@cyberos.lab",
        "phone": "555-1985",
        "cell": "555-8800",
        "dob": "1955-11-05",
        "details": {
            "age": 69,
            "occupation": "Temporal Physicist",
            "location": "Hill Valley Lab",
            "nationality": "American"
        },
        "hiddenInfo": {
            "realName": "Emmett Lathrop Brown",
            "clearanceLevel": "LEVEL 5",
            "notes": "Working on flux capacitor technology.",
            "knownAssociates": ["Marty M."]
        },
        "documents": [
            {
                "title": t('dir.doc.flux_blueprint'),
                "type": "blueprint",
                "meta": {
                    "projectCode": "FLUX",
                    "revision": "v1.0",
                    "date": "1955"
                },
                "data": {
                    "title": "Flux Capacitor",
                    "description": "Device to enable time travel.",
                    "specs": { "Power": "1.21 GW", "Speed": "88 MPH" },
                    "drawingUrl": "https://images.squarespace-cdn.com/content/v1/545f5b33e4b0719cb5aee3a5/1579899941158-MU7IPR63Y8UXXOX52GOK/Screen+Shot+2020-01-24+at+21.05.09.png"
                }
            },
            {
                "title": t('dir.doc.flux_patent'),
                "type": "patent",
                "meta": {
                    "patentNumber": "US-1985-001",
                    "date": "1985",
                    "filedDate": "1955"
                },
                "data": {
                    "inventionName": "Flux Capacitor",
                    "inventor": "Dr. Emmett Brown",
                    "assignee": "Self",
                    "abstract": "A device for modulating the temporal displacement field.",
                    "description": "Requires plutonium.",
                    "drawingUrl": "https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/flux-capacitor-patent-denny-h.jpg"
                }
            }
        ]
    },
    {
        "id": "SCI-101",
        "name": "Dr. Turing",
        "role": "SCIENTIST",
        "status": "RESEARCH",
        "avatar": "https://randomuser.me/api/portraits/men/3.jpg",
        "email": "alan.t@cyberos.lab",
        "phone": "555-0101",
        "cell": "555-0111",
        "dob": "1980-06-23",
        "details": {
            "age": 44,
            "occupation": "Cryptographer",
            "location": "Bletchley Park",
            "nationality": "British"
        },
        "hiddenInfo": {
            "realName": "Alan T.",
            "clearanceLevel": "LEVEL 5",
            "notes": "Leading the Enigma project.",
            "knownAssociates": []
        },
        "documents": []
    },
    {
        "id": "SCI-202",
        "name": "Dr. Franklin",
        "role": "SCIENTIST",
        "status": "ACTIVE",
        "avatar": "https://randomuser.me/api/portraits/women/68.jpg",
        "email": "rosalind.f@cyberos.lab",
        "phone": "555-0202",
        "cell": "555-0222",
        "dob": "1988-07-25",
        "details": {
            "age": 36,
            "occupation": "Biochemist",
            "location": "London Lab",
            "nationality": "British"
        },
        "hiddenInfo": {
            "realName": "Rosalind F.",
            "clearanceLevel": "LEVEL 4",
            "notes": "Expert in DNA sequencing.",
            "knownAssociates": []
        },
        "documents": [
            {
                "title": t('dir.doc.dna_report'),
                "type": "lab_report",
                "meta": {
                    "reportId": "LAB-DNA-51",
                    "date": "1953",
                    "researcher": "R. Franklin",
                    "clearance": "RESTRICTED"
                },
                "data": {
                    "title": "Photo 51 Analysis",
                    "subject": "DNA Structure",
                    "abstract": "X-ray diffraction image of DNA.",
                    "methodology": "X-ray crystallography",
                    "results": "Double helix structure confirmed.",
                    "chemicalStructure": "https://placehold.co/300x300/000/fff?text=HELIX"
                }
            }
        ]
    },

    // --- CITIZENS ---
    {
        "id": "CTZ-001",
        "name": "John Doe",
        "role": "CITIZEN",
        "status": "NEUTRAL",
        "avatar": "https://randomuser.me/api/portraits/men/1.jpg",
        "email": "john.doe@email.com",
        "phone": "555-1234",
        "cell": "555-5678",
        "dob": "1990-01-01",
        "details": {
            "age": 34,
            "occupation": "Accountant",
            "location": "New York, USA",
            "nationality": "American"
        },
        "hiddenInfo": {
            "realName": "John Doe",
            "clearanceLevel": "NONE",
            "notes": "Average citizen.",
            "knownAssociates": []
        },
        "documents": [
            {
                "title": t('dir.doc.audit_log'),
                "type": "finance_report",
                "meta": {
                    "period": "Q4 2024",
                    "fiscalYear": "2024"
                },
                "data": {
                    "companyName": "Doe Consulting",
                    "revenue": "$50,000",
                    "grossProfit": "$45,000",
                    "expenses": "$5,000",
                    "netIncome": "$40,000",
                    "summary": "Steady growth.",
                    "assets": [
                        { "name": "Laptop", "value": "$2,000", "change": "-10%" }
                    ]
                }
            }
        ]
    },
    {
        "id": "CTZ-002",
        "name": "Jane Smith",
        "role": "CITIZEN",
        "status": "NEUTRAL",
        "avatar": "https://randomuser.me/api/portraits/women/2.jpg",
        "email": "jane.smith@email.com",
        "phone": "555-2345",
        "cell": "555-6789",
        "dob": "1992-02-02",
        "details": {
            "age": 32,
            "occupation": "Teacher",
            "location": "London, UK",
            "nationality": "British"
        },
        "hiddenInfo": {
            "realName": "Jane Smith",
            "clearanceLevel": "NONE",
            "notes": "No criminal record.",
            "knownAssociates": []
        },
        "documents": []
    },
    {
        "id": "CTZ-003",
        "name": "Carlos Ruiz",
        "role": "CITIZEN",
        "status": "NEUTRAL",
        "avatar": "https://randomuser.me/api/portraits/men/3.jpg",
        "email": "carlos.ruiz@email.com",
        "phone": "555-3456",
        "cell": "555-7890",
        "dob": "1985-03-03",
        "details": {
            "age": 39,
            "occupation": "Chef",
            "location": "Madrid, ES",
            "nationality": "Spanish"
        },
        "hiddenInfo": {
            "realName": "Carlos Ruiz",
            "clearanceLevel": "NONE",
            "notes": "Owns a popular restaurant.",
            "knownAssociates": []
        },
        "documents": []
    },
    {
        "id": "CTZ-004",
        "name": "Yuki Tanaka",
        "role": "CITIZEN",
        "status": "NEUTRAL",
        "avatar": "https://randomuser.me/api/portraits/women/4.jpg",
        "email": "yuki.tanaka@email.com",
        "phone": "555-4567",
        "cell": "555-8901",
        "dob": "1995-04-04",
        "details": {
            "age": 29,
            "occupation": "Designer",
            "location": "Tokyo, JP",
            "nationality": "Japanese"
        },
        "hiddenInfo": {
            "realName": "Yuki Tanaka",
            "clearanceLevel": "NONE",
            "notes": "Freelance graphic designer.",
            "knownAssociates": []
        },
        "documents": []
    },
    {
        "id": "CTZ-005",
        "name": "Hans Muller",
        "role": "CITIZEN",
        "status": "NEUTRAL",
        "avatar": "https://randomuser.me/api/portraits/men/5.jpg",
        "email": "hans.muller@email.com",
        "phone": "555-5678",
        "cell": "555-9012",
        "dob": "1980-05-05",
        "details": {
            "age": 44,
            "occupation": "Engineer",
            "location": "Munich, DE",
            "nationality": "German"
        },
        "hiddenInfo": {
            "realName": "Hans Muller",
            "clearanceLevel": "NONE",
            "notes": "Works at an automotive factory.",
            "knownAssociates": []
        },
        "documents": []
    },
    {
        "id": "CTZ-006",
        "name": "Sofia Rossi",
        "role": "CITIZEN",
        "status": "NEUTRAL",
        "avatar": "https://randomuser.me/api/portraits/women/6.jpg",
        "email": "sofia.rossi@email.com",
        "phone": "555-6789",
        "cell": "555-0123",
        "dob": "1998-06-06",
        "details": {
            "age": 26,
            "occupation": "Student",
            "location": "Rome, IT",
            "nationality": "Italian"
        },
        "hiddenInfo": {
            "realName": "Sofia Rossi",
            "clearanceLevel": "NONE",
            "notes": "Studying Art History.",
            "knownAssociates": []
        },
        "documents": []
    },
    {
        "id": "CTZ-007",
        "name": "Lars Jensen",
        "role": "CITIZEN",
        "status": "NEUTRAL",
        "avatar": "https://randomuser.me/api/portraits/men/7.jpg",
        "email": "lars.jensen@email.com",
        "phone": "555-7890",
        "cell": "555-1234",
        "dob": "1987-07-07",
        "details": {
            "age": 37,
            "occupation": "Architect",
            "location": "Copenhagen, DK",
            "nationality": "Danish"
        },
        "hiddenInfo": {
            "realName": "Lars Jensen",
            "clearanceLevel": "NONE",
            "notes": "Designed several modern buildings.",
            "knownAssociates": []
        },
        "documents": [
            {
                "title": t('dir.doc.passport'),
                "type": "passport",
                "meta": {
                    "country": "DENMARK",
                    "passportNumber": "DK-992100"
                },
                "data": {
                    "surname": "Jensen",
                    "givenNames": "Lars",
                    "nationality": "DNK",
                    "dob": "1987-07-07",
                    "sex": "M",
                    "expiryDate": "2035-07-07",
                    "photoUrl": "https://randomuser.me/api/portraits/men/7.jpg"
                }
            }
        ]
    },
    {
        "id": "CTZ-008",
        "name": "Maria Garcia",
        "role": "CITIZEN",
        "status": "NEUTRAL",
        "avatar": "https://randomuser.me/api/portraits/women/8.jpg",
        "email": "maria.garcia@email.com",
        "phone": "555-8901",
        "cell": "555-2345",
        "dob": "1991-08-08",
        "details": {
            "age": 33,
            "occupation": "Nurse",
            "location": "Barcelona, ES",
            "nationality": "Spanish"
        },
        "hiddenInfo": {
            "realName": "Maria Garcia",
            "clearanceLevel": "NONE",
            "notes": "Works at the city hospital.",
            "knownAssociates": []
        },
        "documents": [
            {
                "title": t('dir.doc.patient_zero'),
                "type": "medical_report",
                "meta": {
                    "hospital": "Barcelona General",
                    "date": "2025-02-20",
                    "doctor": "Dr. Garcia"
                },
                "data": {
                    "patientName": "Unknown Male",
                    "dob": "Unknown",
                    "bloodType": "AB-",
                    "status": "QUARANTINED",
                    "diagnosis": "Novel Virus",
                    "treatment": "Isolation and observation."
                }
            }
        ]
    }
];
