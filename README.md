# CyberOS 🌐

> **"The Ultimate Aspirational Spy Hacker Console"**

![CyberOS Banner](https://img.shields.io/badge/Status-Beta-yellow?style=for-the-badge) ![Version](https://img.shields.io/badge/Version-0.0.1--beta-blue?style=for-the-badge) ![License](https://img.shields.io/badge/License-MIT-00ff41?style=for-the-badge)

## ⚠️ Disclaimer
**CyberOS is currently a "Mock Hacker Console".** 
Nothing you see is real data. No satellites are actually being tracked, no DNA is being sequenced, and no nuclear codes are being generated. It is a visual simulation designed for fun and immersion. (Just in case 🙃)

---

## 🚀 Vision

**CyberOS** is a playful, immersive "hacker operating system" designed to be a digital playground for tech enthusiasts, kids, and anyone who loves the cyberpunk aesthetic. 

Think of it as a blend between **"Carmen San Diego"** and **"Mr. Robot"**.

It starts as a satisfying, interactive dashboard full of graphs, maps, and data streams that look cool but are just for fun. 

I built this to play with my kids, but I think it might also be fun for others who just want to feel like a hacker for a bit.

As it evolves, it will become a gamified platform for learning geography, cryptography, and logic through puzzles and missions.



---

## 🖥️ Modules & Widgets

### 📡 Sat_Uplink
A fully interactive **3D Globe** tracking simulated satellite orbits.
- **Widgets**: Orbit Visualization, Object List, Satellite Details.

### 🌍 Geo_Tracker
A "God's Eye" view of global movement.
- **Widgets**: Live Map (Leaflet), Flight Tracker, Train Network, Storm Systems, Thermal Layer.

### 🧬 Bio_Lab
A simulation of biological threat monitoring.
- **Widgets**: DNA Sequencer, Global Infection Map, Viral Database.

### 👁️ Surveillance
Tap into the world's cameras.
- **Widgets**: 16-Channel CCTV Grid, Camera Metadata, Live/Sim Toggle.

### 💻 Sys_Overview
The heartbeat of your rig.
- **Widgets**: CPU/RAM Graphs, Network Activity, Signal Gain Sliders, Nuclear Launch Protocol.

### >_ Terminal_Bash
A simulated command line interface.
- **Widgets**: Command Input, System Logs, ASCII Art Output.

### 📶 Net_Warfare
Visualizing cyber threats.
- **Widgets**: Packet Sniffer, DDoS Attack Map, Firewall Status.

### 🔓 Decryption
Crack the code.
- **Widgets**: Brute Force Visualizer, Hash Cracker, Cipher Solver.

### 💼 Contracts
Mission control for operatives.
- **Widgets**: Mission List, Target Profiles, Reward Claims.

### 💓 Vitals
Personal health monitoring.
- **Widgets**: Heart Rate Monitor (ECG), Brain Activity, Audio Spectrum.

---

## 🧩 Mission Architecture

CyberOS features a data-driven mission system that integrates deeply with the various modules. Missions are defined in JSON and can dynamically inject data into modules to create immersive gameplay.

### Mission Structure
Each mission is defined by a JSON object with the following key components:

- **`id`**: Unique identifier (e.g., "MSN-001").
- **`requiredModules`**: List of modules needed to complete the mission (e.g., `["Terminal", "Geo Tracker"]`).
- **`moduleData`**: A dictionary containing mission-specific data injected into the respective modules.
- **`questions`**: A set of questions and answers used to verify mission completion.
- **`checklist`**: A list of specific tasks that must be completed within modules (e.g., "Decrypt Telemetry").

### Persistence & State Management
Mission progress is persisted using `localStorage` via the `useMissionState` hook. This ensures that:
- Completed checklist items remain checked across sessions.
- Satellite states (e.g., "Safe" status after repair) are preserved.
- Mission completion status is saved.

### Module Integration & Responsibility
Modules are responsible for checking the active mission context and rendering specific data provided in `moduleData`.

**For Mission Builders:**
When creating a mission, you must provide data in the format expected by the target modules.

**For Module Developers:**
Each module must document its expected data schema. For example:

#### Terminal Module Schema
The Terminal looks for an `ipdata` key to provide mock results for `ipinfo` and `trace` commands.
```json
"Terminal": {
  "ipdata": {
    "192.168.1.1": {
      "info": { "city": "Berlin", "org": "Secret Corp" },
      "trace": ["1. Hop One", "2. Hop Two"]
    }
  }
}
```

#### Geo Tracker Module Schema
The Geo Tracker looks for `coordinates` (places) and `flights` to display on the map.
```json
"Geo Tracker": {
  "coordinates": {
    "50.11,8.68": { "name": "Target Location", "description": "..." }
  },
  "flights": [ ... ]
}
```

### Verification System
Missions are completed by answering verification questions. The answers are case-insensitive but must match the expected values defined in the mission file. This ensures players have actually gathered the necessary intelligence from the modules.

---

## 🛠️ Tech Stack

Built with modern web technologies for speed and scalability:

- **Core**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Mapping**: [Leaflet](https://leafletjs.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/CyberOS.git
    cd CyberOS
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` to hack the planet.

### 🔑 API Configuration

#### Surveillance Module (Windy API)
The **Surveillance** module uses the [Windy.com Webcams API v3](https://api.windy.com/webcams) to display real-time webcam feeds.
1.  **Get an API Key**: Register at [api.windy.com](https://api.windy.com/webcams) to get a free API key.
2.  **Configure**:
    - Open the **Surveillance** module in CyberOS.
    - Click the **Settings** (gear icon) in the top right.
    - Paste your API key into the input field.
    - The key is stored locally in your browser.

### Deployment
To deploy to GitHub Pages:
```bash
npm run deploy
```

---

## 🔮 Roadmap

- [ ] **Gamification**: Add real interactive missions with goals and direct connection with the app modules and components.
- [ ] **Mobile**: Ensure proper mobile compatibility and layout.
- [ ] **PWA**: Add compatibility with "Trusted Web Activity (TWA)" on Chrome for a native-like feel.
- [ ] **Multi-Language**: Full translation support for Spanish, French, and Japanese.

---

## 🤝 Contributing

We welcome fellow hackers! Whether you're a code wizard or a design guru, your help is appreciated.

1.  Fork the repo.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## AI Disclaimer

This project has been created using AI, LLM models, agents and related tools.


---

**Happy Hacking!** 🕶️
