# RailGuard AI — React-only demo

RailGuard AI is a frontend-only React + Vite prototype. It does not require Node/Express API code, MySQL, database setup, or a seed command.

## Requirements
- Node.js 18 or newer
- npm
- Internet connection for the first dependency installation and TensorFlow.js model download

## Run on Windows
1. Extract this ZIP.
2. Open the extracted `railguard_work` folder in VS Code.
3. Open the VS Code terminal (Terminal → New Terminal).
4. Run `npm install` and wait for it to finish.
5. Run `npm run dev`.
6. Open the local URL shown by Vite, usually `http://localhost:5173`.

## Demo login
- Employee: `RG-1001`
- Driver: `DRV-1001`
- Password: enter any non-empty value.

This is intentionally a demo-only login. It is not secure authentication and must not be used for real railway operations.

## Employee-to-driver alerts
The Map page saves the selected location and track to browser storage. The Camera page starts with that selection, and each detection records the object label, confidence, time, location and track. The Driver Safety Console lets the driver select a track and shows alerts for that track only. Employee-created incidents are saved to browser `localStorage`; open the app in two tabs in the same browser to sync alerts between Employee and Driver. This does not send alerts to another device or another browser profile; that requires a backend or a hosted real-time service.

## Camera detection
The camera page uses the TensorFlow.js COCO-SSD model in the browser. Camera access requires permission and a secure context (localhost is supported). COCO-SSD detects common object classes such as person, cell phone, dog, cow, backpack and vehicles. The UI displays readable labels such as Human and Phone. COCO-SSD detects only classes supported by its model; the demo's incident severity logic is intended for demonstration and is not a railway-certified safety system.

## Build
```bash
npm install
npm run build
```

All incidents and demo account state are stored locally in the browser. Clearing site data can remove them.
