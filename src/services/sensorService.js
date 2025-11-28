import { ref, onValue, set, update } from "firebase/database";
import { database } from "../firebase";

// Subscribe to real-time sensor data
export const subscribeSensorData = (callback) => {
  const sensorRef = ref(database, "sensorData/current");
  
  return onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    if (data && validateSensorData(data)) { // Add validation
      callback(data);
    }
  });
};

const validateSensorData = (data) => {
  const requiredFields = ['pressure', 'flowRate', 'temperature', 'waterLevel', 'turbidity'];
  return requiredFields.every(field => 
    data[field] && 
    typeof data[field].value === 'number' &&
    !isNaN(data[field].value)
  );
};

// Update sensor data (for testing or from IoT devices)
export const updateSensorData = async (sensorType, value) => {
  const sensorRef = ref(database, `sensorData/current/${sensorType}`);
  
  await update(sensorRef, {
    value: value,
    timestamp: Date.now()
  });
};

// Update system status
export const updateSystemStatus = async (status) => {
  const statusRef = ref(database, "sensorData/systemStatus");
  
  await set(statusRef, {
    status: status,
    lastUpdate: Date.now()
  });
};