import { ref, set } from "firebase/database";
import { database } from "../firebase";

/**
 * Simulation Service for Testing Without IoT Devices
 * Generates realistic sensor data patterns
 */

class SensorSimulator {
  constructor() {
    this.baseValues = {
      pressure: 45,
      flowRate: 135,
      temperature: 28,
      waterLevel: 75,
      turbidity: 12
    };
    
    this.isRunning = false;
    this.intervalId = null;
    this.leakSimulation = false;
    this.anomalyChance = 0.05; // 5% chance of anomaly
  }

  /**
   * Start sensor simulation
   * @param {number} interval - Update interval in milliseconds (default: 5000)
   */
  start(interval = 5000) {
    if (this.isRunning) {
      console.warn("Simulation already running");
      return;
    }

    this.isRunning = true;
    console.log("🚀 Starting sensor simulation...");
    
    // Initial update
    this.updateSensorData();
    
    // Regular updates
    this.intervalId = setInterval(() => {
      this.updateSensorData();
    }, interval);
  }

  /**
   * Stop sensor simulation
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log("⏹️ Sensor simulation stopped");
  }

  /**
   * Generate sensor data and update Firebase
   */
  async updateSensorData() {
    try {
      const sensorData = this.generateSensorData();
      const sensorRef = ref(database, "sensorData/current");
      
      await set(sensorRef, sensorData);
      
      console.log("📊 Sensor data updated:", {
        pressure: sensorData.pressure.value.toFixed(1),
        flowRate: sensorData.flowRate.value.toFixed(1),
        temperature: sensorData.temperature.value.toFixed(1)
      });
    } catch (error) {
      console.error("Error updating sensor data:", error);
    }
  }

  /**
   * Generate realistic sensor readings
   */
  generateSensorData() {
    const timestamp = Date.now();
    
    // Add natural variation
    const variation = {
      pressure: this.addNoise(this.baseValues.pressure, 2),
      flowRate: this.addNoise(this.baseValues.flowRate, 5),
      temperature: this.addNoise(this.baseValues.temperature, 1),
      waterLevel: this.addNoise(this.baseValues.waterLevel, 3),
      turbidity: this.addNoise(this.baseValues.turbidity, 0.5)
    };

    // Simulate leak if enabled
    if (this.leakSimulation) {
      variation.pressure -= 8; // Pressure drops during leak
      variation.flowRate += 15; // Flow increases during leak
      variation.waterLevel -= 5; // Water level drops
    }

    // Random anomalies
    if (Math.random() < this.anomalyChance) {
      const anomalyType = Math.floor(Math.random() * 3);
      switch (anomalyType) {
        case 0: // Pressure spike
          variation.pressure += 10;
          break;
        case 1: // Flow surge
          variation.flowRate += 20;
          break;
        case 2: // Temperature rise
          variation.temperature += 5;
          break;
      }
    }

    return {
      pressure: {
        value: this.clamp(variation.pressure, 0, 100),
        unit: "PSI",
        status: this.determineStatus(variation.pressure, 50),
        threshold: 50,
        timestamp
      },
      flowRate: {
        value: this.clamp(variation.flowRate, 0, 300),
        unit: "L/min",
        status: this.determineStatus(variation.flowRate, 150),
        threshold: 150,
        timestamp
      },
      temperature: {
        value: this.clamp(variation.temperature, 0, 60),
        unit: "°C",
        status: this.determineStatus(variation.temperature, 35),
        threshold: 35,
        timestamp
      },
      waterLevel: {
        value: this.clamp(variation.waterLevel, 0, 100),
        unit: "%",
        status: this.determineStatus(variation.waterLevel, 90),
        threshold: 90,
        timestamp
      },
      turbidity: {
        value: this.clamp(variation.turbidity, 0, 50),
        unit: "NTU",
        status: this.determineStatus(variation.turbidity, 20),
        threshold: 20,
        timestamp
      }
    };
  }

  /**
   * Add random noise to simulate real sensor readings
   */
  addNoise(baseValue, maxVariation) {
    const noise = (Math.random() - 0.5) * 2 * maxVariation;
    return baseValue + noise;
  }

  /**
   * Clamp value between min and max
   */
  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Determine sensor status based on threshold
   */
  determineStatus(value, threshold) {
    return value > threshold ? "warning" : "normal";
  }

  /**
   * Simulate a leak scenario
   * @param {number} duration - Duration in milliseconds (default: 30000)
   */
  simulateLeak(duration = 30000) {
    console.log("💧 Simulating leak scenario...");
    this.leakSimulation = true;
    
    setTimeout(() => {
      this.leakSimulation = false;
      console.log("✅ Leak simulation ended");
    }, duration);
  }

  /**
   * Set custom base values
   */
  setBaseValues(values) {
    Object.assign(this.baseValues, values);
  }

  /**
   * Set anomaly chance
   * @param {number} chance - Probability (0-1)
   */
  setAnomalyChance(chance) {
    this.anomalyChance = Math.max(0, Math.min(1, chance));
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      leakSimulation: this.leakSimulation,
      baseValues: { ...this.baseValues },
      anomalyChance: this.anomalyChance
    };
  }
}

// Export singleton instance
export const simulator = new SensorSimulator();

// Convenience functions
export const startSimulation = (interval) => simulator.start(interval);
export const stopSimulation = () => simulator.stop();
export const simulateLeak = (duration) => simulator.simulateLeak(duration);
export const getSimulatorStatus = () => simulator.getStatus();