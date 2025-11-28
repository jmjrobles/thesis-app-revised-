import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from "firebase/firestore";
import { firestore } from "../firebase";

// Default settings template
const DEFAULT_SETTINGS = {
  thresholds: {
    pressure: 50,
    flowRate: 150,
    temperature: 35,
    waterLevel: 90,
    turbidity: 20
  },
  notifications: {
    email: true,
    push: false
  }
};

/**
 * Get user settings from Firestore
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User settings or defaults
 */
export const getUserSettings = async (userId) => {
  if (!userId) {
    console.error("getUserSettings: userId is required");
    return DEFAULT_SETTINGS;
  }

  try {
    const docRef = doc(firestore, "userSettings", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Merge with defaults to ensure all fields exist
      return {
        thresholds: {
          ...DEFAULT_SETTINGS.thresholds,
          ...(data.thresholds || {})
        },
        notifications: {
          ...DEFAULT_SETTINGS.notifications,
          ...(data.notifications || {})
        }
      };
    } else {
      // Create default settings for new user
      console.log("Creating default settings for user:", userId);
      await setDoc(docRef, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
    
    // Return defaults on error
    return DEFAULT_SETTINGS;
  }
};

/**
 * Save user settings to Firestore
 * @param {string} userId - User ID
 * @param {Object} settings - Settings object
 * @returns {Promise<void>}
 */
export const saveUserSettings = async (userId, settings) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  if (!settings || typeof settings !== 'object') {
    throw new Error("settings must be a valid object");
  }

  try {
    const docRef = doc(firestore, "userSettings", userId);
    
    // Merge with existing settings
    await setDoc(docRef, settings, { merge: true });
    
    console.log("Settings saved successfully for user:", userId);
  } catch (error) {
    console.error("Error saving settings:", error);
    throw new Error(`Failed to save settings: ${error.message}`);
  }
};

/**
 * Update a specific threshold value
 * @param {string} userId - User ID
 * @param {string} sensorType - Sensor type (pressure, flowRate, etc.)
 * @param {number} value - Threshold value
 * @returns {Promise<void>}
 */
export const updateThreshold = async (userId, sensorType, value) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  if (!sensorType) {
    throw new Error("sensorType is required");
  }

  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error("value must be a valid number");
  }

  if (value < 0) {
    throw new Error("value cannot be negative");
  }

  try {
    const docRef = doc(firestore, "userSettings", userId);
    
    // Check if document exists
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      // Create default settings first
      await setDoc(docRef, DEFAULT_SETTINGS);
    }
    
    // Update specific threshold
    await updateDoc(docRef, {
      [`thresholds.${sensorType}`]: value
    });
    
    console.log(`Threshold updated: ${sensorType} = ${value}`);
  } catch (error) {
    console.error("Error updating threshold:", error);
    throw new Error(`Failed to update threshold: ${error.message}`);
  }
};

/**
 * Reset settings to defaults
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const resetSettings = async (userId) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  try {
    const docRef = doc(firestore, "userSettings", userId);
    await setDoc(docRef, DEFAULT_SETTINGS);
    
    console.log("Settings reset to defaults for user:", userId);
  } catch (error) {
    console.error("Error resetting settings:", error);
    throw new Error(`Failed to reset settings: ${error.message}`);
  }
};

/**
 * Get default settings (utility function)
 * @returns {Object} Default settings
 */
export const getDefaultSettings = () => {
  return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
};