import React, { useState, useEffect } from "react";
import { Play, Square, Zap, Settings as SettingsIcon, Bell } from "lucide-react";
import { updateThreshold, getUserSettings, saveUserSettings } from "../services/settingsService";
import { simulator, simulateLeak, getSimulatorStatus } from "../services/simulationService";

const SettingsPage = ({ sensorData, user }) => {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [simulatorStatus, setSimulatorStatus] = useState({
    isRunning: false,
    leakSimulation: false,
    baseValues: {},
    anomalyChance: 0.05
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: false
  });
  const [loading, setLoading] = useState(true);

  // Update simulator status safely
  useEffect(() => {
    const updateStatus = () => {
      try {
        const status = getSimulatorStatus();
        setSimulatorStatus(status);
      } catch (error) {
        console.error("Error getting simulator status:", error);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  // Load notification settings
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const loadSettings = async () => {
      try {
        const settings = await getUserSettings(user.uid);
        if (settings?.notifications) {
          setNotificationSettings(settings.notifications);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        setMessage("⚠️ Could not load settings. Using defaults.");
        setTimeout(() => setMessage(""), 3000);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const handleThresholdChange = async (sensorType, newValue) => {
    if (!user?.uid) {
      setMessage("❌ User not authenticated");
      return;
    }

    setSaving(true);
    setMessage("");
    
    try {
      const numValue = parseFloat(newValue);
      if (isNaN(numValue) || numValue < 0) {
        throw new Error("Invalid threshold value");
      }

      await updateThreshold(user.uid, sensorType, numValue);
      setMessage("✅ Threshold updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(`❌ Failed to update threshold: ${error.message}`);
      console.error(error);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSimulationToggle = () => {
    try {
      if (simulatorStatus.isRunning) {
        simulator.stop();
        setMessage("⏹️ Simulation stopped");
      } else {
        simulator.start(5000);
        setMessage("▶️ Simulation started");
      }
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Failed to toggle simulation");
      console.error("Simulation error:", error);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleLeakSimulation = () => {
    try {
      if (!simulatorStatus.isRunning) {
        setMessage("⚠️ Start simulation first!");
        setTimeout(() => setMessage(""), 3000);
        return;
      }

      simulateLeak(30000);
      setMessage("💧 Leak simulation started (30 seconds)");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Failed to start leak simulation");
      console.error("Leak simulation error:", error);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleNotificationToggle = async (type) => {
    if (!user?.uid) {
      setMessage("❌ User not authenticated");
      return;
    }

    const newSettings = {
      ...notificationSettings,
      [type]: !notificationSettings[type]
    };
    
    setNotificationSettings(newSettings);
    
    try {
      await saveUserSettings(user.uid, { notifications: newSettings });
      setMessage("✅ Notification settings updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Failed to update settings");
      console.error(error);
      setTimeout(() => setMessage(""), 3000);
      // Revert on error
      setNotificationSettings(notificationSettings);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid text-white py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading settings...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!sensorData?.sensors) {
    return (
      <div className="container-fluid text-white py-4">
        <div className="alert alert-warning">
          ⚠️ Sensor data not available. Please wait for initialization.
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid text-white py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <SettingsIcon className="text-primary" size={32} />
        <h1 className="h3 fw-bold mb-0">System Settings</h1>
      </div>

      {message && (
        <div className={`alert ${
          message.includes('✅') 
            ? 'alert-success' 
            : message.includes('❌') 
            ? 'alert-danger' 
            : 'alert-info'
        } mb-4`}>
          {message}
        </div>
      )}

      {/* Simulation Controls */}
      <div className="bg-dark border rounded p-4 mb-4">
        <h2 className="h5 fw-semibold mb-3 d-flex align-items-center gap-2">
          <Zap className="text-warning" />
          Sensor Simulation (Testing Mode)
        </h2>
        <p className="text-secondary small mb-4">
          Simulate sensor data for testing without physical IoT devices
        </p>

        <div className="row g-3">
          <div className="col-md-6">
            <div className="bg-secondary bg-opacity-10 rounded p-3 border border-secondary">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold">Simulation Status</span>
                <span className={`badge ${simulatorStatus.isRunning ? 'bg-success' : 'bg-secondary'}`}>
                  {simulatorStatus.isRunning ? 'RUNNING' : 'STOPPED'}
                </span>
              </div>
              <button
                onClick={handleSimulationToggle}
                className={`btn ${simulatorStatus.isRunning ? 'btn-danger' : 'btn-success'} w-100 d-flex align-items-center justify-content-center gap-2`}
              >
                {simulatorStatus.isRunning ? (
                  <>
                    <Square size={18} />
                    Stop Simulation
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Start Simulation
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="col-md-6">
            <div className="bg-secondary bg-opacity-10 rounded p-3 border border-secondary">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold">Leak Simulation</span>
                <span className={`badge ${simulatorStatus.leakSimulation ? 'bg-danger' : 'bg-secondary'}`}>
                  {simulatorStatus.leakSimulation ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              <button
                onClick={handleLeakSimulation}
                disabled={!simulatorStatus.isRunning || simulatorStatus.leakSimulation}
                className="btn btn-warning w-100 d-flex align-items-center justify-content-center gap-2"
              >
                <Zap size={18} />
                Trigger Leak (30s)
              </button>
            </div>
          </div>
        </div>

        <div className="alert alert-info mt-3 mb-0">
          <small>
            <strong>💡 Tip:</strong> Start the simulation to generate realistic sensor data. 
            Use leak simulation to test the detection algorithm.
          </small>
        </div>
      </div>

      {/* Threshold Configuration */}
      <div className="bg-dark border rounded p-4 mb-4">
        <h2 className="h5 fw-semibold mb-4">Threshold Configuration</h2>
        <p className="text-secondary small mb-4">
          Set alert thresholds for each sensor. Alerts will be triggered when values exceed these limits.
        </p>
        <div className="d-flex flex-column gap-3">
          {Object.entries(sensorData.sensors).map(([key, sensor]) => (
            <div
              key={key}
              className="d-flex justify-content-between align-items-center p-3 bg-secondary bg-opacity-10 rounded border border-secondary"
            >
              <div>
                <span className="text-capitalize fw-semibold">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <div className="text-secondary small">
                  Current: {sensor?.value?.toFixed(1) || '0.0'} {sensor?.unit || ''}
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="number"
                  defaultValue={sensor?.threshold || 0}
                  onBlur={(e) => handleThresholdChange(key, e.target.value)}
                  disabled={saving}
                  className="form-control form-control-sm bg-dark text-white border-secondary text-end"
                  style={{ width: "100px" }}
                  step="0.1"
                  min="0"
                />
                <span className="text-secondary" style={{ minWidth: "50px" }}>
                  {sensor?.unit || ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-dark border rounded p-4">
        <h2 className="h5 fw-semibold mb-4 d-flex align-items-center gap-2">
          <Bell className="text-primary" />
          Notification Preferences
        </h2>
        <div className="d-flex flex-column gap-3">
          <div className="d-flex justify-content-between align-items-center p-3 bg-secondary bg-opacity-10 rounded border border-secondary">
            <div>
              <div className="fw-semibold">Email Notifications</div>
              <small className="text-secondary">Receive alerts via email</small>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={notificationSettings.email}
                onChange={() => handleNotificationToggle('email')}
                style={{ cursor: 'pointer', width: '3rem', height: '1.5rem' }}
              />
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center p-3 bg-secondary bg-opacity-10 rounded border border-secondary">
            <div>
              <div className="fw-semibold">Push Notifications</div>
              <small className="text-secondary">Receive real-time push alerts</small>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={notificationSettings.push}
                onChange={() => handleNotificationToggle('push')}
                style={{ cursor: 'pointer', width: '3rem', height: '1.5rem' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;