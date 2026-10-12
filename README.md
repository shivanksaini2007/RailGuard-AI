# RailGuard AI — Portfolio Theme Edition

A React + Vite railway-safety dashboard prototype with a portfolio-inspired indigo/purple theme, light/dark mode, reusable UI components and a team footer.

## Features

- Operations dashboard with demo safety metrics
- Browser-based camera and object-detection prototype
- Incident alerts and report management
- Railway map and driver-cab demo
- Settings saved in browser storage
- Login and protected routes for the demo
- Light/dark theme preference
- Portfolio-inspired responsive navbar and footer with quick links
- Working browser-generated alert tones for high/critical incidents, with a persistent sound toggle and a test-sound button in Settings
- About Project page and responsive navigation
- Portfolio-style footer crediting **Shivank Saini** and **Shubham**

## Tech stack

- React 18 and Vite
- React Router
- Lucide React icons
- TensorFlow.js and COCO-SSD
- CSS with reusable components and theme variables

## Run locally

```bash
npm install
npm run dev
```

Vite will show the local development URL in the terminal.

To create a production build:

```bash
npm run build
```

## Demo accounts

```text
Employee: RG-1001 / 1234
Driver:   DRV-1001 / 1234
```

## Main project structure

```text
src/
├── components/
│   ├── Footer.jsx
│   ├── IncidentCard.jsx
│   ├── Navbar.jsx
│   ├── PageHeader.jsx
│   ├── ProtectedRoute.jsx
│   ├── SectionTitle.jsx
│   ├── Sidebar.jsx
│   ├── StatCard.jsx
│   ├── FeatureCard.jsx
│   └── ThemeToggle.jsx
├── context/
├── hooks/
├── pages/
│   ├── About.jsx
│   ├── Alerts.jsx
│   ├── Camera.jsx
│   ├── DriverMode.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── RailwayMap.jsx
│   ├── Reports.jsx
│   └── Settings.jsx
├── App.jsx
├── main.jsx
└── styles.css
```

The old `components/Layout.jsx` has been removed. The application shell and routes are managed in `App.jsx`, while the navbar, sidebar and footer are separate reusable components.

## Prototype disclaimer

This is a college/hackathon demo, not a railway-certified safety system. Do not use it for real train control, signaling, dispatch or emergency decisions.

## Fixed build notes

- Navbar and footer now use portfolio-style indigo/purple active states, responsive layout and expanded quick links.
- Alert sound uses the browser Web Audio API. Start the camera once or use **Settings → Test alert sound** to allow audio in the browser; high/critical incidents play a short tone when sound is enabled.

- Login redirects are handled through React Router instead of navigating during render.
- The sidebar sign-out icon import is included, avoiding a runtime import error that could blank the app.
- All 31 JavaScript/JSX files passed a syntax transpilation check and all relative source imports were checked.

Before deployment, run `npm install` and `npm run build` on a machine with internet access. The dependency installation in this environment timed out, so a full Vite production build could not be confirmed here. This remains a prototype with demo credentials; replace the demo login before any real-world use.


## Robot voice + emergency beep

Open **Settings → Training Options** to enable/disable the emergency beep and English robot-style voice independently. Choose an available English browser voice if one is listed, then click **Test robot voice + beep**. The voice uses the browser Speech Synthesis engine with a lower pitch and steady rate; available voices vary by operating system/browser. The beep uses Web Audio. Click the test button once to allow the browser to unlock audio playback.

## Camera detection tips

The camera module uses the COCO-SSD MobileNet V2 model for a stronger accuracy-oriented default than the lite model. It draws object boxes and confidence values, and creates incidents for configured high-risk classes. For best results, use a well-lit scene, keep the object fully in frame, avoid motion blur, and allow the model to finish loading. This is a student prototype, not a railway-certified safety system. Browser camera access requires localhost or HTTPS.
