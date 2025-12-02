# 🏗️ Mission Architect Handbook

Welcome to the **CyberOS Mission Architect Handbook**. This guide details how to create, structure, and debug missions using the new **Event-Driven Architecture**.

---

## 1. Mission File Structure

Missions are defined as TypeScript modules in `src/modules/missions/data/`. Each mission has its own folder containing the logic and localization files.

### Directory Layout
```
src/modules/missions/data/
  └── MSN-001/
      ├── index.ts          # Main definition, exports getMission(lang)
      └── locales/
          ├── en.ts         # English text
          └── es.ts         # Spanish text
```

### Mission Definition (`index.ts`)
The `index.ts` file exports a `getMission` function that accepts the current language code and returns the mission object.

```typescript
import { en } from './locales/en';
import { es } from './locales/es';

export const getMission = (lang: string) => {
    const t = lang === 'es' ? es : en;

    return {
        id: "MSN-001",
        title: t.title,
        // ...
    };
};
```

### Core Properties
| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier (e.g., `"MSN-001"`). |
| `title` | `string` | Display title of the mission (translated). |
| `difficulty` | `enum` | `EASY`, `MEDIUM`, `HARD`, `EXPERT`. |
| `reward` | `string` | Reward text (e.g., `"500 BTC"`). |
| `briefing` | `string` | Short summary shown in the list (translated). |
| `fullDescription` | `string` | Detailed mission briefing (translated). |
| `requiredModules` | `string[]` | List of modules to unlock/highlight. |
| `moduleData` | `object` | Data injection for specific modules (see Section 4). |
| `objectives` | `array` | The core logic of the mission (see Section 2). |

### Localization Note
All user-facing text (titles, descriptions, messages) must be defined in the `locales/*.ts` files and accessed via the `t` object in `index.ts`.
*   **Do not hardcode strings** in `index.ts`.
*   Ensure both `en.ts` and `es.ts` have matching keys.

## 2. Objectives & Event Triggers

The `objectives` array replaces the old `checklist`. It defines **what** needs to be done and **how** the system detects it.

### Objective Schema
```json
{
  "id": "unique_objective_id",
  "description": "User-facing task description",
  "trigger": {
    "event": "EVENT_NAME",
    "target": "TARGET_VALUE"
  },
  "dependency": "previous_objective_id",
  "on_complete": {
    "message": "Notification shown to user"
  }
}
```

### Supported Events
The **Mission Engine** listens for these events globally:

| Event Name | Target Value | Triggered By |
| :--- | :--- | :--- |
| `TERMINAL_TRACE` | IP Address (e.g., `"192.168.1.1"`) | Running `trace <IP>` in Terminal. |
| `TERMINAL_IPINFO` | IP Address | Running `ipinfo <IP>` in Terminal. |
| `MAP_SELECT_LOCATION` | Location Name (e.g., `"Oberon Dynamics"`) | Selecting a **Place** in Geo Tracker. |
| `MAP_SELECT_ENTITY` | Entity ID (e.g., `"FLT-3020"`) | Selecting a **Flight** or **Train** in Geo Tracker. |
| `SAT_JAM` | Satellite ID (e.g., `"SAT-001"`) | Successfully jamming a satellite in Sat Uplink. |
| `SAT_RESTORE` | Satellite ID | Successfully rebooting a satellite in Sat Uplink. |
| `SAT_DECRYPT` | Satellite ID | Decrypting telemetry in Sat Uplink. |

### Dependencies
*   Use `dependency: "id"` to lock an objective until the previous one is complete.
*   This allows for sequential storytelling (e.g., "Trace IP" -> "Find Location" -> "Hack Satellite").

---

## 3. Manual Mission Completion

**Important Design Rule:**
Missions **DO NOT** auto-complete when all objectives are met.
*   Users must manually click **"COMPLETE MISSION"**.
*   This allows them to review gathered intel and answer verification questions.
*   **Do not** use `mission_success: true` in the `on_complete` block of the final objective.

---

## 4. Module Data Injection

Missions can inject "fake" data into modules to create a controlled environment.

### Terminal (`ipdata`)
Injects mock results for `ipinfo` and `trace` commands.
```json
"Terminal": {
    "ipdata": {
        "185.93.180.131": {
            "info": { "city": "Frankfurt", "org": "Evil Corp" },
            "trace": ["1. Hop One", "2. Target"]
        }
    }
}
```

### Geo Tracker (`coordinates`, `flights`)
Injects specific locations and moving entities.
```json
"Geo Tracker": {
    "coordinates": {
        "50.10,8.62": { "name": "Secret Base", "description": "..." }
    },
    "flights": [
        { "id": "FLT-3020", "startCoords": [...], "endCoords": [...] }
    ]
}
```

### Sat Uplink (`satellites`)
Injects satellite data and overrides behavior.
```json
"Satellite": {
    "satellites": {
        "SAT-999": {
            "tasksUpdate": { "jam_sat_objective": true },
            "resetData": { "status": "SAFE" },
            "missionOverride": {
                "image": "/missions/assets/target_visual.jpg",
                "meta": "ANOMALY DETECTED"
            }
        }
    }
}
```

---

## 5. Persistence & Scoping

The mission system uses **Scoped Persistence**.
*   Progress is saved per-mission: `missionProgress["MSN-001"].completedTasks`.
*   This prevents collisions between missions that might use the same objective IDs (e.g., multiple missions having a "trace_ip" step).
*   **Best Practice:** You can reuse generic IDs like `trace_ip` or `locate_target` safely across different mission files.

---

## 6. Debugging

*   **Console Logs:** The `useMissionEngine` hook logs all received events and matching objectives.
*   **Event Bus:** Check `MissionEventBus.ts` to see raw event emissions.
*   **State:** Check Application > Local Storage > `cyberos_mission_state` to see raw persistence data.

---

## 7. Directory Injection

Missions can inject specific profiles into the global Directory. These profiles can be encrypted and require a decryption key found during gameplay.

### Data Structure
```typescript
moduleData: {
    Directory: [
        {
            id: "target-id",
            name: "John Doe",
            role: "AGENT",
            status: "ACTIVE",
            encrypted: true, // Optional: Locks the profile
            decryptionKey: "SECRET-KEY", // Required if encrypted
            hiddenInfo: {
                realName: "Jane Smith",
                notes: "Classified intel..."
            },
            // ... standard Person fields
        }
    ]
}
```

### Events
- `DIRECTORY_VIEW_PROFILE`: Triggered when a user views a specific profile.
  - Target: Profile ID (e.g., `target-id`)
- `DIRECTORY_DECRYPT`: Triggered when a user successfully decrypts a profile.
  - Target: Profile ID
