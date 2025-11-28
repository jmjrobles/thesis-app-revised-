/**
 * Testing Script for Pipeline Monitoring System
 * Use this in browser console after logging in
 */

// Import simulation functions
import { simulator, simulateLeak } from './services/simulationService';

// Test Suite
const PipelineTestSuite = {
  
  /**
   * Test 1: Start basic simulation
   */
  startBasicSimulation() {
    console.log("🧪 Test 1: Starting basic simulation...");
    simulator.start(3000); // Update every 3 seconds
    console.log("✅ Simulation started with 3-second intervals");
  },

  /**
   * Test 2: Simulate a leak scenario
   */
  async testLeakDetection() {
    console.log("🧪 Test 2: Testing leak detection...");
    
    if (!simulator.getStatus().isRunning) {
      console.error("❌ Please start simulation first");
      return;
    }

    console.log("💧 Triggering 30-second leak simulation...");
    simulateLeak(30000);
    
    console.log("⏳ Monitor the dashboard for:");
    console.log("  - Pressure drop");
    console.log("  - Flow rate increase");
    console.log("  - Leak detection alerts");
  },

  /**
   * Test 3: Test threshold alerts
   */
  async testThresholdAlerts() {
    console.log("🧪 Test 3: Testing threshold alerts...");
    
    // Set low thresholds to trigger alerts
    simulator.setBaseValues({
      pressure: 55,  // Above 50 threshold
      flowRate: 160, // Above 150 threshold
      temperature: 40 // Above 35 threshold
    });
    
    console.log("✅ Base values set high to trigger threshold alerts");
    console.log("⏳ Watch for threshold violation alerts in 5-10 seconds");
  },

  /**
   * Test 4: Test normal operation
   */
  resetToNormal() {
    console.log("🧪 Test 4: Resetting to normal operation...");
    
    simulator.setBaseValues({
      pressure: 45,
      flowRate: 135,
      temperature: 28,
      waterLevel: 75,
      turbidity: 12
    });
    
    console.log("✅ Reset to normal operating values");
  },

  /**
   * Test 5: Stop simulation
   */
  stopSimulation() {
    console.log("🧪 Test 5: Stopping simulation...");
    simulator.stop();
    console.log("✅ Simulation stopped");
  },

  /**
   * Run all tests in sequence
   */
  async runAllTests() {
    console.log("🚀 Running complete test suite...\n");
    
    // Test 1
    this.startBasicSimulation();
    await this.wait(5000);
    
    // Test 2
    await this.testLeakDetection();
    await this.wait(35000);
    
    // Test 3
    await this.testThresholdAlerts();
    await this.wait(15000);
    
    // Test 4
    this.resetToNormal();
    await this.wait(10000);
    
    // Test 5
    this.stopSimulation();
    
    console.log("\n✅ All tests completed!");
  },

  /**
   * Helper: Wait function
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Get current system status
   */
  getStatus() {
    const status = simulator.getStatus();
    console.log("📊 Current Simulator Status:");
    console.log("  Running:", status.isRunning);
    console.log("  Leak Simulation:", status.leakSimulation);
    console.log("  Base Values:", status.baseValues);
    console.log("  Anomaly Chance:", (status.anomalyChance * 100) + "%");
  },

  /**
   * Quick test commands
   */
  quickCommands() {
    console.log("🎮 Quick Test Commands:");
    console.log("  PipelineTestSuite.startBasicSimulation() - Start simulation");
    console.log("  PipelineTestSuite.testLeakDetection() - Test leak");
    console.log("  PipelineTestSuite.stopSimulation() - Stop");
    console.log("  PipelineTestSuite.getStatus() - Check status");
    console.log("  PipelineTestSuite.runAllTests() - Run all tests");
  }
};

// Make available globally for console testing
window.PipelineTestSuite = PipelineTestSuite;

// Show quick commands on load
if (typeof window !== 'undefined') {
  console.log("\n🔬 Pipeline Monitoring Test Suite Loaded!");
  PipelineTestSuite.quickCommands();
}

export default PipelineTestSuite;