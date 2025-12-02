export const getDirectoryData = (t: (key: string) => string) => [
    {
        "id": "AGT-001",
        "name": "Viper",
        "role": "AGENT",
        "status": "ACTIVE",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Viper&backgroundColor=b6e3f4",
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
                    "photoUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Viper&backgroundColor=b6e3f4",
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
            }
        ]
    },
    {
        "id": "CRM-992",
        "name": t('dir.prof.baron.name'),
        "role": "CRIMINAL",
        "status": "WANTED",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Baron&backgroundColor=ffdfbf",
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
        "id": "SCI-042",
        "name": "Dr. Ada Love",
        "role": "SCIENTIST",
        "status": "RESEARCH",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ada&backgroundColor=c0aede",
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
    }
];
