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

### � Sys_Overview
The heartbeat of your rig.
- **Widgets**: CPU/RAM Graphs, Network Activity, Signal Gain Sliders, Nuclear Launch Protocol.

### 💼 Missions
Mission control for operatives.
- **Widgets**: Mission List, Target Profiles, Reward Claims.

### >_ Terminal_Bash
A simulated command line interface.
- **Widgets**: Command Input, System Logs, ASCII Art Output.

### 🌍 Geo_Tracker
A "God's Eye" view of global movement.
- **Widgets**: Live Map (Leaflet), Flight Tracker, Train Network, Storm Systems, Thermal Layer.

### 📡 Sat_Uplink
A fully interactive **Satellite Command Center** featuring two distinct viewing modes:
- **EarthView**: Real-time Earth observation using **OpenLayers** and **NASA GIBS** (MODIS, VIIRS) for live weather, thermal, and night-light imagery.
- **AstroView**: Deep space telescope control using **Aladin Lite v3** to access multi-wavelength surveys (Optical, Infrared, X-Ray, UV) from global observatories.
- **Widgets**: Orbit Visualization, Sensor Feed Control, Telemetry Analysis.

### 📶 Net_Warfare
Visualizing cyber threats.
- **Widgets**: Packet Sniffer, DDoS Attack Map, Firewall Status.

### 👁️ Surveillance
Tap into the world's cameras.
- **Widgets**: 16-Channel CCTV Grid, Camera Metadata, Live/Sim Toggle.

### 🔓 Decryption
Crack the code.
- **Widgets**: Brute Force Visualizer, Hash Cracker, Cipher Solver.

### 🧬 Bio_Lab
A simulation of biological threat monitoring.
- **Widgets**: DNA Sequencer, Global Infection Map, Viral Database.

---

## 🧩 Mission Architecture

CyberOS features a robust, **Event-Driven Mission System**. Missions are defined in JSON and interact with the console's modules via a global event bus.

> 📘 **Want to build your own missions?**
> Check out the complete [Mission Architect Handbook](./MISSION_ARCHITECT_HANDBOOK.md) for documentation on:
> *   **Event Triggers** (`TERMINAL_TRACE`, `SAT_JAM`, etc.)
> *   **Objective Logic** & Dependencies
> *   **Data Injection** for Terminal, GeoMap, and Satellites
> *   **Persistence** & State Management

---

## 🛠️ Tech Stack

Built with modern web technologies for speed and scalability:

- **Core**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Mapping**: [Leaflet](https://leafletjs.com/) (Geo Tracker) & [OpenLayers](https://openlayers.org/) (EarthView)
- **Astronomy**: [Aladin Lite v3](https://aladin.cds.unistra.fr/AladinLite/) (AstroView)
- **Data APIs**: 
    - **NASA GIBS** (Earth Imagery)
    - **Nominatim** (Geocoding)
    - **Windy** (Webcams)
- **Icons**: [Lucide React](https://lucide.dev/)

### 🌐 Internationalization (i18n)
CyberOS supports multiple languages (currently English and Spanish) via a custom lightweight i18n system.
- **Locale Files**: `src/locales/en.ts` & `src/locales/es.ts`
- **Guide**: See [TRANSLATION_GUIDE.md](./TRANSLATION_GUIDE.md) for instructions on adding new translations and handling dynamic data.

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

> 🛠️ **Technical Documentation**
> Before diving into the code, please read the [Developer Contributor Handbook](./DEVELOPER_HANDBOOK.md). It explains the system architecture, event bus, and module structure in detail.

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
