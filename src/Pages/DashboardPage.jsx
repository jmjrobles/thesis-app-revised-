import React from "react";
import { Gauge, Droplets, Thermometer, Wind, Activity } from "lucide-react";
import SensorCard from "../Components/Dashboard/SensorCard";
import HistoricalChart from "../Components/Dashboard/HistoricalChart";
import AlertsPanel from "../Components/Dashboard/AlertsPanel";
import PipelineMap from "../Components/Dashboard/PipelineMap";
import SystemStatus from "../Components/Dashboard/SystemStatus";

const DashboardPage = ({ sensorData, historicalData, loading }) =>
   (
  <div className="container-fluid text-white py-4">
    {/* Header */}
    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <div>
        <h1 className="h3 fw-bold mb-1">Pipeline Monitoring System</h1>
        <p className="text-secondary mb-0">
          Real-time sensor data and system analytics
        </p>
      </div>
      <SystemStatus status={sensorData.systemStatus} />
    </div>

    {/* Sensor Cards */}
    <div className="row g-3 mb-4">
      <div className="col-12 col-md-6 col-lg-4 col-xl">
        <SensorCard
          icon={Gauge}
          title="Pressure"
          value={sensorData.sensors.pressure.value}
          unit={sensorData.sensors.pressure.unit}
          status={sensorData.sensors.pressure.status}
          threshold={sensorData.sensors.pressure.threshold}
        />
      </div>
      <div className="col-12 col-md-6 col-lg-4 col-xl">
        <SensorCard
          icon={Droplets}
          title="Flow Rate"
          value={sensorData.sensors.flowRate.value}
          unit={sensorData.sensors.flowRate.unit}
          status={sensorData.sensors.flowRate.status}
          threshold={sensorData.sensors.flowRate.threshold}
        />
      </div>
      <div className="col-12 col-md-6 col-lg-4 col-xl">
        <SensorCard
          icon={Thermometer}
          title="Temperature"
          value={sensorData.sensors.temperature.value}
          unit={sensorData.sensors.temperature.unit}
          status={sensorData.sensors.temperature.status}
          threshold={sensorData.sensors.temperature.threshold}
        />
      </div>
      <div className="col-12 col-md-6 col-lg-4 col-xl">
        <SensorCard
          icon={Wind}
          title="Water Level"
          value={sensorData.sensors.waterLevel.value}
          unit={sensorData.sensors.waterLevel.unit}
          status={sensorData.sensors.waterLevel.status}
          threshold={sensorData.sensors.waterLevel.threshold}
        />
      </div>
      <div className="col-12 col-md-6 col-lg-4 col-xl">
        <SensorCard
          icon={Activity}
          title="Turbidity"
          value={sensorData.sensors.turbidity.value}
          unit={sensorData.sensors.turbidity.unit}
          status={sensorData.sensors.turbidity.status}
          threshold={sensorData.sensors.turbidity.threshold}
        />
      </div>
    </div>

    {/* Charts + Alerts */}
    <div className="row g-4 mb-4">
      <div className="col-12 col-lg-8">
        <HistoricalChart data={historicalData} />
      </div>
      <div className="col-12 col-lg-4">
        <AlertsPanel alerts={sensorData.alerts} />
      </div>
    </div>

    {/* Pipeline Map */}
    <PipelineMap />
  </div>
);

export default DashboardPage;
