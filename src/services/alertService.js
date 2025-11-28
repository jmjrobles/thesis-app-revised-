import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  updateDoc,
  doc,
  Timestamp 
} from "firebase/firestore";
import { firestore } from "../firebase";

// Create alert
export const createAlert = async (userId, severity, message, sensor, value) => {
  try {
    const docRef = await addDoc(collection(firestore, "alerts"), {
      timestamp: Timestamp.now(),
      severity: severity,
      message: message,
      sensor: sensor,
      value: value,
      acknowledged: false,
      userId: userId
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating alert:", error);
    throw error;
  }
};

// Get user alerts
export const getUserAlerts = async (userId, limitCount = 50) => {
  try {
    const q = query(
      collection(firestore, "alerts"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const alerts = [];
    
    querySnapshot.forEach((doc) => {
      alerts.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      });
    });
    
    return alerts;
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }
};

// Acknowledge alert
export const acknowledgeAlert = async (alertId) => {
  try {
    const alertRef = doc(firestore, "alerts", alertId);
    await updateDoc(alertRef, {
      acknowledged: true,
      acknowledgedAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error acknowledging alert:", error);
    throw error;
  }
};