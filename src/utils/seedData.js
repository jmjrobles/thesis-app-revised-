import { ref, set } from "firebase/database";
import { database } from "../firebase";

export const seedSensorData = async () => {
  const sensorRef = ref(database, "sensorData/current");
  
  await set(sensorRef, {
    pressure: {
      value: 45.2,
      unit: "PSI",
      status: "normal",
      threshold: 50,
      timestamp: Date.now()
    },
    flowRate: {
      value: 135.5,
      unit: "L/min",
      status: "normal",
      threshold: 150,
      timestamp: Date.now()
    },
    temperature: {
      value: 28.3,
      unit: "°C",
      status: "normal",
      threshold: 35,
      timestamp: Date.now()
    },
    waterLevel: {
      value: 75.0,
      unit: "%",
      status: "normal",
      threshold: 90,
      timestamp: Date.now()
    },
    turbidity: {
      value: 12.5,
      unit: "NTU",
      status: "normal",
      threshold: 20,
      timestamp: Date.now()
    }
  });
  
  console.log("Sensor data seeded!");
};