# IoT-Based Real-Time Pipeline Leak Detection & Monitoring System

## 🎓 Thesis Prototype - Web Application

A comprehensive web-based monitoring system for detecting and analyzing pipeline leaks in real-time using IoT sensor data.

## 🌟 Features

### ✅ Implemented
- **Real-time Monitoring**: Live sensor data visualization (Pressure, Flow Rate, Temperature, Water Level, Turbidity)
- **Leak Detection Algorithm**: Intelligent pattern recognition for leak identification
- **Alert System**: Multi-level alert system (Critical, High, Medium, Low)
- **Historical Data**: 24-hour trend analysis and visualization
- **Analytics Dashboard**: Comprehensive system performance metrics
- **Simulation Mode**: Test without physical IoT devices
- **User Authentication**: Secure Firebase authentication
- **Threshold Configuration**: Customizable alert thresholds
- **Responsive Design**: Mobile-friendly interface

### 🚧 Ready for IoT Integration
- Real-time database connections (Firebase Realtime Database)
- Sensor data subscription services
- Historical data persistence
- Alert notification system

## 🏗️ Tech Stack

- **Frontend**: React 18, Bootstrap 5
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Firebase (Authentication, Realtime Database, Firestore)
- **State Management**: React Hooks

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Modern web browser

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd pipeline-monitoring-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Firebase Setup
Your Firebase configuration is already in `src/firebase.js`. Ensure your Firebase project has:
- **Authentication** enabled (Email/Password)
- **Realtime Database** created (Asia Southeast 1)
- **Firestore** enabled

### 4. Firebase Security Rules

#### Realtime Database Rules:
```json
{
  "rules": {
    "sensorData": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

#### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /alerts/{alertId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /historicalData/{docId} {
      allow read, write: if request.auth != null;
    }
    match /userSettings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Start the application
```bash
npm start
```

The app will open at `http://localhost:3000`

## 🧪 Testing (Without IoT Devices)

### Using the Built-in Simulator

1. **Login/Register** to the application
2. Navigate to **Settings** page
3. Click **"Start Simulation"** button
4