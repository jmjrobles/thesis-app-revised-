import { createAlert } from "./alertService";

/**
 * Leak Detection Service
 * Analyzes sensor data to detect potential leaks
 */

// Leak detection thresholds
const LEAK_THRESHOLDS = {
  pressureDrop: 10, // PSI drop in 5 minutes
  flowRateIncrease: 20, // L/min increase
  combinedAnomaly: 0.7 // Combined score threshold
};

// Store previous readings for comparison
let previousReadings = {
  pressure: [],
  flowRate: [],
  timestamp: null
};

/**
 * Detect leaks based on sensor patterns
 * @param {Object} sensors - Current sensor readings
 * @param {string} userId - User ID for alert creation
 * @returns {Object} - Detection result
 */
export const detectLeak = async (sensors, userId) => {
  const results = {
    leakDetected: false,
    confidence: 0,
    indicators: [],
    location: null,
    severity: "normal"
  };

  try {
    // 1. Check for sudden pressure drop
    const pressureDrop = checkPressureDrop(sensors.pressure.value);
    if (pressureDrop.detected) {
      results.indicators.push(pressureDrop.reason);
      results.confidence += 0.4;
    }

    // 2. Check for unusual flow rate patterns
    const flowAnomaly = checkFlowAnomaly(sensors.flowRate.value);
    if (flowAnomaly.detected) {
      results.indicators.push(flowAnomaly.reason);
      results.confidence += 0.3;
    }

    // 3. Check pressure-flow correlation
    const correlation = checkPressureFlowCorrelation(
      sensors.pressure.value,
      sensors.flowRate.value
    );
    if (correlation.detected) {
      results.indicators.push(correlation.reason);
      results.confidence += 0.3;
    }

    // 4. Check for water level inconsistencies
    if (sensors.waterLevel.value < 30 && sensors.flowRate.value > sensors.flowRate.threshold) {
      results.indicators.push("Low water level with high flow rate");
      results.confidence += 0.2;
    }

    // Determine if leak is detected
    if (results.confidence >= LEAK_THRESHOLDS.combinedAnomaly) {
      results.leakDetected = true;
      results.severity = results.confidence > 0.9 ? "critical" : "high";
      
      // Create alert
      const message = `Potential leak detected! Confidence: ${(results.confidence * 100).toFixed(0)}%. Indicators: ${results.indicators.join(", ")}`;
      
      await createAlert(
        userId,
        results.severity,
        message,
        "leak_detection",
        results.confidence
      );
    }

    // Update previous readings
    updatePreviousReadings(sensors);

    return results;
  } catch (error) {
    console.error("Error in leak detection:", error);
    return results;
  }
};

/**
 * Check for sudden pressure drop
 */
function checkPressureDrop(currentPressure) {
  if (previousReadings.pressure.length === 0) {
    return { detected: false };
  }

  const recentPressures = previousReadings.pressure.slice(-5);
  const avgPrevPressure = recentPressures.reduce((a, b) => a + b, 0) / recentPressures.length;
  const pressureDiff = avgPrevPressure - currentPressure;

  if (pressureDiff > LEAK_THRESHOLDS.pressureDrop) {
    return {
      detected: true,
      reason: `Sudden pressure drop: ${pressureDiff.toFixed(1)} PSI`
    };
  }

  return { detected: false };
}

/**
 * Check for flow rate anomalies
 */
function checkFlowAnomaly(currentFlowRate) {
  if (previousReadings.flowRate.length === 0) {
    return { detected: false };
  }

  const recentFlows = previousReadings.flowRate.slice(-5);
  const avgPrevFlow = recentFlows.reduce((a, b) => a + b, 0) / recentFlows.length;
  const flowDiff = currentFlowRate - avgPrevFlow;

  if (Math.abs(flowDiff) > LEAK_THRESHOLDS.flowRateIncrease) {
    return {
      detected: true,
      reason: `Unusual flow rate change: ${flowDiff.toFixed(1)} L/min`
    };
  }

  return { detected: false };
}

/**
 * Check pressure-flow correlation
 * In normal conditions, pressure and flow rate are correlated
 * A leak causes pressure drop with maintained or increased flow
 */
function checkPressureFlowCorrelation(pressure, flowRate) {
  if (previousReadings.pressure.length < 3) {
    return { detected: false };
  }

  const recentPressures = previousReadings.pressure.slice(-3);
  const recentFlows = previousReadings.flowRate.slice(-3);

  const avgPrevPressure = recentPressures.reduce((a, b) => a + b, 0) / recentPressures.length;
  const avgPrevFlow = recentFlows.reduce((a, b) => a + b, 0) / recentFlows.length;

  const pressureDecreased = pressure < avgPrevPressure * 0.9;
  const flowIncreased = flowRate > avgPrevFlow * 1.1;

  if (pressureDecreased && flowIncreased) {
    return {
      detected: true,
      reason: "Pressure drop with flow increase (leak signature)"
    };
  }

  return { detected: false };
}

/**
 * Update previous readings buffer
 */
function updatePreviousReadings(sensors) {
  const maxHistory = 10;

  previousReadings.pressure.push(sensors.pressure.value);
  previousReadings.flowRate.push(sensors.flowRate.value);
  previousReadings.timestamp = Date.now();

  // Keep only recent history
  if (previousReadings.pressure.length > maxHistory) {
    previousReadings.pressure.shift();
  }
  if (previousReadings.flowRate.length > maxHistory) {
    previousReadings.flowRate.shift();
  }
}

/**
 * Reset detection history (useful for testing)
 */
export const resetLeakDetection = () => {
  previousReadings = {
    pressure: [],
    flowRate: [],
    timestamp: null
  };
};

/**
 * Get leak detection configuration
 */
export const getLeakDetectionConfig = () => {
  return {
    thresholds: LEAK_THRESHOLDS,
    historySize: previousReadings.pressure.length
  };
};

/**
 * Update leak detection thresholds
 */
export const updateLeakThresholds = (newThresholds) => {
  Object.assign(LEAK_THRESHOLDS, newThresholds);
};