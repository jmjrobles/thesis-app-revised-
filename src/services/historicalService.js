import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  Timestamp 
} from "firebase/firestore";
import { firestore } from "../firebase";

// Save historical data point
export const saveHistoricalData = async (sensorData) => {
  try {
    const docRef = await addDoc(collection(firestore, "historicalData"), {
      timestamp: Timestamp.now(),
      pressure: sensorData.pressure.value,
      flowRate: sensorData.flowRate.value,
      temperature: sensorData.temperature.value,
      waterLevel: sensorData.waterLevel.value,
      turbidity: sensorData.turbidity.value
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving historical data:", error);
    throw error;
  }
};

export const getHistoricalData = async (limitCount = 100) => {
  try {
    const q = query(
      collection(firestore, "historicalData"),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const data = [];
    
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      const timestamp = docData.timestamp.toDate();
      
      data.push({
        id: doc.id,
        time: timestamp.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        timestamp: timestamp, // Keep original for reference
        pressure: docData.pressure || 0,
        flowRate: docData.flowRate || 0,
        temperature: docData.temperature || 0,
        waterLevel: docData.waterLevel || 0,
        turbidity: docData.turbidity || 0
      });
    });
    
    return data.reverse(); // Chronological order
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return []; // Return empty array on error
  }
};