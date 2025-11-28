import React, { useEffect, useState, useRef } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Auth from "./Auth";
import Sidebar from "./Components/Layout/Sidebar";
import DashboardPage from "./Pages/DashboardPage";
import SettingsPage from "./Pages/SettingsPage";
import AnalyticsPage from "./Pages/AnalyticsPage";
import { subscribeSensorData } from "./services/sensorService";
import { getHistoricalData, saveHistoricalData } from "./services/historicalService";
import { getUserAlerts } from "./services/alertService";
import { getUserSettings } from "./services/settingsService";
import { detectLeak } from "./services/leakDetectionService";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sensorData, setSensorData] = useState({
    sensors: {
      pressure: { value: 0, unit: "PSI", status: "normal", threshold: 50 },
      flowRate: { value: 0, unit: "L/min", status: "normal", threshold: 150 },
      temperature: { value: 0, unit: "°C", status: "normal", threshold: 35 },
      waterLevel: { value: 0, unit: "%", status: "normal", threshold: 90 },
      turbidity: { value: 0, unit: "NTU", status: "normal", threshold: 20 }
    },
    systemStatus: { status: "initializing", lastUpdate: new Date().toISOString() },
    alerts: []
  });
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Use ref to avoid stale closures
  const sensorDataRef = useRef(sensorData.sensors);
  
  useEffect(() => {
    sensorDataRef.current = sensorData.sensors;
  }, [sensorData.sensors]);

  // Auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Subscribe to real-time sensor data
useEffect(() => {
  if (!user) return;

  const unsubscribe = subscribeSensorData(async (data) => {
    setSensorData(prev => {
      const updatedSensors = {};
      Object.keys(data).forEach(key => {
        const sensor = data[key];
        const threshold = prev.sensors[key]?.threshold || sensor.threshold;
        const status = sensor.value > threshold ? "warning" : "normal";
        
        updatedSensors[key] = {
          ...sensor,
          threshold,
          status
        };
      });

      return {
        ...prev,
        sensors: updatedSensors,
        systemStatus: {
          status: "operational",
          lastUpdate: new Date().toISOString()
        }
      };
    });
    
    // ⭐ ADD THIS - Run leak detection
    if (data.pressure && data.flowRate) {
      await detectLeak(
        {
          pressure: data.pressure,
          flowRate: data.flowRate,
          waterLevel: data.waterLevel,
          temperature: data.temperature,
          turbidity: data.turbidity
        },
        user.uid
      );
    }
  });

  return () => unsubscribe();
}, [user]);

  // Load user settings and apply thresholds
  useEffect(() => {
    if (!user) return;

    const loadSettings = async () => {
      try {
        const settings = await getUserSettings(user.uid);
        
        setSensorData(prev => {
          const updatedSensors = { ...prev.sensors };
          Object.keys(settings.thresholds).forEach(key => {
            if (updatedSensors[key]) {
              updatedSensors[key].threshold = settings.thresholds[key];
            }
          });
          return { ...prev, sensors: updatedSensors };
        });
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, [user]);

  // Load historical data and alerts
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const [historical, alerts] = await Promise.all([
          getHistoricalData(100),
          getUserAlerts(user.uid, 20)
        ]);
        
        setHistoricalData(historical);
        
        // Format alerts for display
        const formattedAlerts = alerts.map(alert => ({
          id: alert.id,
          message: alert.message,
          severity: alert.severity,
          time: alert.timestamp.toLocaleString(),
          acknowledged: alert.acknowledged
        }));
        
        setSensorData(prev => ({ ...prev, alerts: formattedAlerts }));
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
    
    // Refresh data every 30 seconds
    const intervalId = setInterval(loadData, 30000);
    return () => clearInterval(intervalId);
  }, [user]);

  // Save historical data every 5 minutes using ref
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        await saveHistoricalData(sensorDataRef.current);
        console.log("Historical data saved");
      } catch (error) {
        console.error("Error saving historical data:", error);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  const renderPage = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardPage sensorData={sensorData} historicalData={historicalData} />;
      case "settings":
        return <SettingsPage sensorData={sensorData} user={user} />;
      case "analytics":
        return (
          
          <div className="text-center py-5">
            <h2 className="h4 text-white mb-2">Analytics</h2>
            <AnalyticsPage historicalData={historicalData} alerts={sensorData.alerts} />;
          </div>
        );
      case "alerts":
        return (
          <div className="text-center py-5">
            <h2 className="h4 text-white mb-2">Alerts Management</h2>
            <p className="text-secondary">Alert configuration and history coming soon</p>
          </div>
        );
      case "map":
        return (
          <div className="text-center py-5">
            <h2 className="h4 text-white mb-2">Pipeline Map</h2>
            <p className="text-secondary">Interactive map view coming soon</p>
          </div>
        );
      default:
        return (
          <div className="text-center py-5">
            <h2 className="h4 text-white text-capitalize mb-2">{activeSection}</h2>
            <p className="text-secondary">This section is under development</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="App d-flex justify-content-center align-items-center vh-100 bg-dark">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-white">Initializing Pipeline Monitor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="App">
        <Auth />
      </div>
    );
  }

  return (
    <div className="d-flex vh-100 bg-black">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
      />
      <div className="flex-grow-1 overflow-auto">
        <div className="p-4">{renderPage()}</div>
      </div>
    </div>
  );
}

export default App;