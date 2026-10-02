# 🚆 RailGuard AI

### Simple Railway Safety Operations Console — React Hackathon Project

**RailGuard AI** is a student-level React + Vite project designed to demonstrate how modern React concepts can be combined into one practical railway safety dashboard.

The interface is inspired by a railway control-room console and includes a browser camera, local object detection, safety rules, incident management, driver mode, reports, railway map and settings.

> 🎓 Developed as a BCA Student Project by **Shivank Saini**

---

## 🚆 What does the project do?

The basic idea is simple:

**Camera → Object Detection → Safety Rule → Alert → Incident Report**

For example:

1. User opens the AI Camera.
2. Browser asks for camera permission.
3. COCO-SSD analyzes camera frames in the browser.
4. React converts detected objects into safety categories.
5. Important detections can create an incident.
6. Operator can review and acknowledge the incident.
7. Reports can be exported as CSV.

The **Safety Test** button also creates a synthetic railway alert so the complete flow can be demonstrated without a camera.

---

## ✨ Main Features

### 🔐 1. Demo Authentication

- Railway Employee mode
- Train Driver mode
- Protected routes
- Session storage
- Logout

Demo accounts:

```text
Employee: RG-1001 / 1234
Driver:   DRV-1001 / 1234
```

### 📊 2. Operations Dashboard

- Active alert count
- Incident count
- Average confidence
- Track zone
- Latest incidents
- Safety test
- Acknowledge all alerts

### 📷 3. AI Camera

- Browser webcam access
- Start / Stop camera
- Flip camera
- Snapshot
- COCO-SSD object detection
- Detection confidence
- Safety status
- Visual detection boxes
- Training simulation option

### 🚨 4. Incident Center

- Search incidents
- Filter by severity
- Incident cards
- Dynamic incident details
- Acknowledge incidents

### 📑 5. Reports

- Incident table
- CRUD-style incident management
- Acknowledge all
- Clear demo data
- CSV export

### 🚄 6. Driver Cab Mode

- High-visibility safety status
- Demo trip start/stop
- Speed display
- Track number
- AI state
- Driver alerts

### 🗺️ 7. Railway Map

- Track visualization
- Camera network marker
- Train marker
- Safe / warning / alert legend
- Ready for future GIS integration

### ⚙️ 8. Settings

- Duty shift
- Operating zone
- Training simulation
- Alert sound
- Current role/session
- localStorage persistence

---

## 🧠 React Concepts Used

This project intentionally uses many React concepts so it can also be explained during a college presentation or hackathon viva.

### React Basics

- JSX
- Functional components
- Props
- Children
- Conditional rendering
- Lists and keys
- Event handling
- Controlled inputs

### Hooks

- `useState`
- `useEffect`
- `useRef`
- `useMemo`
- `useCallback`

### Context API

- `AuthContext`
- `IncidentContext`

Context is used so authentication and incident data can be shared across pages without passing props through every component.

### Custom Hooks

```text
useCamera()
useLocalStorage()
```

### React Router

- `BrowserRouter`
- `Routes`
- `Route`
- `Navigate`
- `Link`
- `NavLink`
- `useNavigate`
- `useParams`
- Protected routes
- Dynamic routes

### JavaScript ES6+

- `let`
- `const`
- Arrow functions
- Template literals
- Destructuring
- Spread operator
- Rest parameters
- Modules
- `map()`
- `filter()`
- `reduce()`
- Ternary operator
- Optional chaining
- Nullish coalescing

### Browser APIs

- `getUserMedia()`
- `localStorage`
- `sessionStorage`
- Canvas
- Blob
- Fetch API

---

## 🤖 AI Part — Simple Explanation

The project uses **TensorFlow.js + COCO-SSD** for browser-based object detection.

The flow is:

```text
Laptop Camera
      ↓
Video Frame
      ↓
TensorFlow.js
      ↓
COCO-SSD
      ↓
Detected Object
      ↓
Railway Safety Rule
      ↓
Critical / High / Medium / Info
      ↓
React Incident State
      ↓
Incident Report
```

Example:

```text
Cow detected
    ↓
Animal on Track
    ↓
Critical
    ↓
Operator reviews alert
```

This is a **prototype**, not a railway-certified safety system.

---

## 🏗️ Project Structure

```text
RailGuard-Hackathon-React/
│
├── src/
│   ├── components/
│   │   ├── IncidentCard.jsx
│   │   ├── Layout.jsx
│   │   ├── PageHeader.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── IncidentContext.jsx
│   │
│   ├── data/
│   │   └── incidents.js
│   │
│   ├── hooks/
│   │   ├── useCamera.js
│   │   └── useLocalStorage.js
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Home.jsx
│   │   ├── Camera.jsx
│   │   ├── Alerts.jsx
│   │   ├── ReportDetails.jsx
│   │   ├── Reports.jsx
│   │   ├── RailwayMap.jsx
│   │   ├── DriverMode.jsx
│   │   ├── Settings.jsx
│   │   └── NotFound.jsx
│   │
│   ├── utils/
│   │   ├── api.js
│   │   └── es6Examples.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript ES6+
- JSX
- CSS

### Libraries

- React Router DOM
- Lucide React
- TensorFlow.js
- COCO-SSD

### Browser Storage

- localStorage
- sessionStorage

---

## 🚀 Run the Project

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## 📷 Camera Setup

For the camera:

1. Open the project on `localhost`.
2. Login.
3. Open **AI Camera**.
4. Click **Start Camera**.
5. Allow browser camera permission.
6. Wait for **AI READY**.
7. Objects visible to the camera may appear in the detection list.

If camera permission is not available, use **Safety Test** to demonstrate the incident workflow.

---

## 🎤 Easy Hackathon Explanation

### Problem

Railway tracks can contain unsafe objects such as people, animals or vehicles.

### Solution

RailGuard AI is a prototype safety console that combines camera monitoring and object detection with simple railway safety rules.

### How it works

> “Sir, our project takes the laptop camera feed, uses TensorFlow.js and COCO-SSD to detect objects, then React applies safety rules. If a risky object is detected, we create an incident that the railway operator can review and acknowledge.”

### React concepts

> “We used React Router for pages, Context API for authentication and incident state, useState for UI state, useEffect for side effects, useRef for camera and canvas, useMemo for dashboard calculations, useCallback for reusable functions, and custom hooks for camera and localStorage.”

### Why localStorage?

> “For this student prototype we store demo incidents and settings in the browser, so the project works without a backend.”

---

## ⚠️ Important Disclaimer

This is a **student/hackathon prototype**.

It is not a certified railway safety system and must not be used to control:

- train speed
- braking
- signaling
- dispatch
- railway operations

The demo contains simulated railway data and simplified safety rules.

---

## 🔮 Future Improvements

- Railway-specific computer vision model
- Backend API
- Database
- WebSocket real-time alerts
- Secure authentication
- Role-based permissions
- GIS railway map
- Operator audit logs
- Cloud deployment
- Railway-approved camera integration
- More accurate track and object classification

---

## 👨‍🎓 Developer

**Shivank Saini**

BCA Student | Web Development Enthusiast

**Project:** RailGuard AI — Railway Safety Operations Console

Built with React.js + Vite for learning and hackathon demonstration.
