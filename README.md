# GreenFlow 🌱
### Smart Irrigation Dashboard with AI-Assisted Insights

GreenFlow is a React and TypeScript prototype for exploring smarter irrigation decisions through simulated environmental sensor readings, interactive monitoring, and AI-assisted recommendations.

> **Project status:** Educational/demo prototype. Sensor values, pump behavior, history, and alerts are simulated or sample data. This project is not connected to physical irrigation hardware and must not be used to control real equipment.

## Overview

The dashboard brings several irrigation-related signals into one interface and illustrates how they could inform watering decisions.

### Features

- **Sensor dashboard** — simulated soil moisture, air temperature, humidity, rainfall, and water-tank level.
- **Live-style visualization** — rolling sensor updates and charts built with Recharts.
- **Irrigation controls** — Auto and Manual UI modes with simulated pump state and a rain-related stop rule.
- **AI-assisted insight** — Google Gemini integration that requests a short recommendation based on current simulated readings.
- **Local fallback** — rule-based recommendations when the AI response is unavailable.
- **History and alerts views** — interface examples using predefined sample entries.
- **Responsive interface** — React components with Lucide icons.

## Screens and workflow

1. Open the dashboard to review the current simulated sensor readings.
2. Use the control screen to explore automatic and manual irrigation states.
3. Review the history and alerts screens to see how monitoring information is presented.
4. Generate an AI insight to receive a brief recommendation based on the current readings.

## Tech stack

| Area | Technologies |
| --- | --- |
| UI | React 19, TypeScript |
| Development and build | Vite 6 |
| AI integration | Google GenAI SDK (Gemini) |
| Charts | Recharts |
| Icons | Lucide React |

## Getting started

### Prerequisites

- Node.js and npm
- A Gemini API key only if you want to experiment with the Gemini insight feature

### Run the application

The Vite application lives in `smart-irrigation-distributed-/`.

```bash
cd smart-irrigation-distributed-
npm install
npm run dev
```

Vite will print the local development URL in the terminal.

### Gemini configuration and security

The example environment file is at `smart-irrigation-distributed-/.env.example`. It documents the `GEMINI_API_KEY` setting.

**Security note:** the current Vite configuration exposes the configured Gemini key to browser-side code. Do not put a valuable or production API key into this setup or deploy it with a real secret. Before using a real key, move Gemini requests to a server-side API endpoint or serverless function, keep the key in server-only environment variables, and rotate any key that may already have been exposed. The interface includes a local rule-based fallback for cases where an AI insight cannot be returned.

## Project structure

```text
GreenFlow/
├── package.json
├── package-lock.json
└── smart-irrigation-distributed-/
    ├── components/
    ├── App.tsx
    ├── constants.ts
    ├── types.ts
    ├── vite.config.ts
    ├── package.json
    ├── .env.example
    └── README.md
```

The root README describes the repository, while the application directory contains the Vite app and its own setup notes.

## Current limitations

- Sensor measurements are generated in the browser; no physical sensors or irrigation hardware are connected.
- Pump controls represent simulated UI state, not real equipment control.
- History and alert entries are sample data; persistent storage and real push notifications are not implemented.
- The login screen is a UI demonstration, not authentication or access control.
- AI recommendations are informational prototype output, not agronomic advice or a safety system.
- A server-side AI boundary, automated tests, and production deployment hardening remain future improvements.

## Potential next steps

- Move Gemini requests behind a secure server-side endpoint.
- Add tests for irrigation rules, fallback behavior, and sensor state transitions.
- Persist sensor readings and generate alerts from actual state changes.
- Introduce a documented sensor/hardware integration layer if the project is extended beyond simulation.
- Add CI checks and a production-ready deployment configuration.

## License

No license is currently specified in this repository. Contact the repository owner before reusing or redistributing the project.

---

Built as a smart-irrigation UI and AI-integration prototype.
