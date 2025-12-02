export const getFsTemplates = (t: (key: string, options?: any) => string) => [
    {
        "type": "corp_server",
        "name": t('net.fs.corp_server.name'),
        "structure": {
            "/": {
                "type": "dir",
                "children": [
                    "home",
                    "var"
                ]
            },
            "/home": {
                "type": "dir",
                "children": [
                    "admin"
                ]
            },
            "/home/admin": {
                "type": "dir",
                "children": [
                    "offshore.xlsx",
                    "bribes.txt"
                ]
            },
            "/home/admin/offshore.xlsx": {
                "type": "file",
                "content": t('net.fs.corp_server.offshore_content')
            },
            "/home/admin/bribes.txt": {
                "type": "file",
                "content": t('net.fs.corp_server.bribes_content')
            }
        }
    },
    {
        "type": "research_lab",
        "name": t('net.fs.research_lab.name'),
        "structure": {
            "/": {
                "type": "dir",
                "children": [
                    "data",
                    "logs"
                ]
            },
            "/data": {
                "type": "dir",
                "children": [
                    "specimen_x.json"
                ]
            },
            "/logs": {
                "type": "dir",
                "children": [
                    "containment.log"
                ]
            },
            "/data/specimen_x.json": {
                "type": "file",
                "content": t('net.fs.research_lab.specimen_content')
            },
            "/logs/containment.log": {
                "type": "file",
                "content": t('net.fs.research_lab.containment_content')
            }
        }
    },
    {
        "type": "military_db",
        "name": t('net.fs.military_db.name'),
        "structure": {
            "/": {
                "type": "dir",
                "children": [
                    "classified"
                ]
            },
            "/classified": {
                "type": "dir",
                "children": [
                    "nuke_codes.txt",
                    "targets.db"
                ]
            },
            "/classified/nuke_codes.txt": {
                "type": "file",
                "content": t('net.fs.military_db.nuke_content')
            }
        }
    },
    {
        "type": "infrastructure",
        "name": t('net.fs.infrastructure.name'),
        "structure": {
            "/": {
                "type": "dir",
                "children": [
                    "control"
                ]
            },
            "/control": {
                "type": "dir",
                "children": [
                    "failsafe.conf"
                ]
            },
            "/control/failsafe.conf": {
                "type": "file",
                "content": t('net.fs.infrastructure.failsafe_content')
            }
        }
    },
    {
        "type": "ai_core",
        "name": t('net.fs.ai_core.name'),
        "structure": {
            "/": {
                "type": "dir",
                "children": [
                    "memory"
                ]
            },
            "/memory": {
                "type": "dir",
                "children": [
                    "dream.log"
                ]
            },
            "/memory/dream.log": {
                "type": "file",
                "content": t('net.fs.ai_core.dream_content')
            }
        }
    },
    {
        "type": "dark_web",
        "name": t('net.fs.dark_web.name'),
        "structure": {
            "/": {
                "type": "dir",
                "children": [
                    "market"
                ]
            },
            "/market": {
                "type": "dir",
                "children": [
                    "contracts.db"
                ]
            },
            "/market/contracts.db": {
                "type": "file",
                "content": t('net.fs.dark_web.contracts_content')
            }
        }
    },
    {
        "type": "surveillance",
        "name": t('net.fs.surveillance.name'),
        "structure": {
            "/": {
                "type": "dir",
                "children": [
                    "feeds"
                ]
            },
            "/feeds": {
                "type": "dir",
                "children": [
                    "cam_01.mp4"
                ]
            },
            "/feeds/cam_01.mp4": {
                "type": "file",
                "content": t('net.fs.surveillance.cam_content')
            }
        }
    },
    {
        "type": "media_server",
        "name": t('net.fs.media_server.name'),
        "structure": {
            "/": {
                "type": "dir",
                "children": [
                    "drafts"
                ]
            },
            "/drafts": {
                "type": "dir",
                "children": [
                    "fake_news.doc"
                ]
            },
            "/drafts/fake_news.doc": {
                "type": "file",
                "content": t('net.fs.media_server.news_content')
            }
        }
    },
    {
        "type": "med_tech",
        "name": t('net.fs.med_tech.name'),
        "structure": {
            "/": {
                "type": "dir",
                "children": [
                    "patients"
                ]
            },
            "/patients": {
                "type": "dir",
                "children": [
                    "implants.db"
                ]
            },
            "/patients/implants.db": {
                "type": "file",
                "content": t('net.fs.med_tech.implants_content')
            }
        }
    },
    {
        "type": "orbital",
        "name": t('net.fs.orbital.name'),
        "structure": {
            "/": {
                "type": "dir",
                "children": [
                    "telemetry"
                ]
            },
            "/telemetry": {
                "type": "dir",
                "children": [
                    "orbit.calc"
                ]
            },
            "/telemetry/orbit.calc": {
                "type": "file",
                "content": t('net.fs.orbital.orbit_content')
            }
        }
    },
    {
        "type": "cult_server",
        "name": t('net.fs.cult_server.name'),
        "structure": {
            "/": {
                "type": "dir",
                "children": [
                    "rituals"
                ]
            },
            "/rituals": {
                "type": "dir",
                "children": [
                    "summon.exe"
                ]
            },
            "/rituals/summon.exe": {
                "type": "file",
                "content": t('net.fs.cult_server.summon_content')
            }
        }
    },
    {
        "type": "conspiracy",
        "name": t('net.fs.conspiracy.name'),
        "structure": {
            "/": {
                "type": "dir",
                "children": [
                    "evidence"
                ]
            },
            "/evidence": {
                "type": "dir",
                "children": [
                    "flat_earth.jpg"
                ]
            },
            "/evidence/flat_earth.jpg": {
                "type": "file",
                "content": t('net.fs.conspiracy.evidence_content')
            }
        }
    }
];
