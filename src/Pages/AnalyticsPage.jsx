import React, { useState, useEffect } from "react";
import { Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const AnalyticsPage = ({ historicalData, alerts }) => {
  const [analytics, setAnalytics] = useState({
    totalAlerts: 0,
    criticalAlerts: 0,
    avgPressure: 0,
    avgFlowRate: 0,
    avgTemperature: 0,
    leakIncidents: 0,
    systemUptime: 99.5
  });

  const [alertsByType, setAlertsByType] = useState([]);
  const [sensorTrends, setSensorTrends] = useState([]);

  useEffect(() => {
    if (historicalData.length > 0) {
      calculateAnalytics();
    }
  }, [historicalData, alerts]);

  const calculateAnalytics = () => {
    // Calculate averages
    const totalPoints = historicalData.length;
    const avgPressure = historicalData.reduce((sum, d) => sum + d.pressure, 0) / totalPoints;
    const avgFlowRate = historicalData.reduce((sum, d) => sum + d.flowRate, 0) / totalPoints;
    const avgTemperature = historicalData.reduce((sum, d) => sum + d.temperature, 0) / totalPoints;

    // Count alerts by severity
    const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length;
    const leakAlerts = alerts.filter(a => a.message.toLowerCase().includes('leak')).length;

    // Alert distribution
    const alertDistribution = [
      { name: 'Critical', value: alerts.filter(a => a.severity === 'critical').length, color: '#dc3545' },
      { name: 'High', value: alerts.filter(a => a.severity === 'high').length, color: '#fd7e14' },
      { name: 'Medium', value: alerts.filter(a => a.severity === 'medium' || a.severity === 'warning').length, color: '#ffc107' },
      { name: 'Low', value: alerts.filter(a => a.severity === 'low' || a.severity === 'info').length, color: '#0dcaf0' }
    ];

    // Sensor trends (last 20 points)
    const recentData = historicalData.slice(-20).map(d => ({
      time: d.time,
      pressure: d.pressure,
      flowRate: d.flowRate,
      temperature: d.temperature
    }));

    setAnalytics({
      totalAlerts: alerts.length,
      criticalAlerts,
      avgPressure: avgPressure.toFixed(1),
      avgFlowRate: avgFlowRate.toFixed(1),
      avgTemperature: avgTemperature.toFixed(1),
      leakIncidents: leakAlerts,
      systemUptime: 99.5
    });

    setAlertsByType(alertDistribution);
    setSensorTrends(recentData);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="card bg-dark border border-secondary text-white h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className={`bg-${color} bg-opacity-25 p-2 rounded`}>
            <Icon className={`text-${color}`} size={24} />
          </div>
          {trend && (
            <span className={`badge bg-${trend > 0 ? 'success' : 'danger'}`}>
              {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <h6 className="text-muted text-uppercase small">{title}</h6>
        <h3 className="fw-bold mb-1">{value}</h3>
        {subtitle && <small className="text-secondary">{subtitle}</small>}
      </div>
    </div>
  );
  const exportData = () => {
  const csv = historicalData.map(d => 
    `${d.timestamp},${d.pressure},${d.flowRate},${d.temperature}`
  ).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pipeline-data-${Date.now()}.csv`;
  a.click();
};
  return (
    <div className="container-fluid text-white py-4">
      {/* Header */}
      <div className="d-flex align-items-center gap-2 mb-4">
        <Activity className="text-primary" size={32} />
        <div>
          <h1 className="h3 fw-bold mb-0">System Analytics</h1>
          <p className="text-secondary mb-0 small">Performance metrics and insights</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            icon={AlertTriangle}
            title="Total Alerts"
            value={analytics.totalAlerts}
            subtitle="Last 24 hours"
            color="warning"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            icon={AlertTriangle}
            title="Critical Alerts"
            value={analytics.criticalAlerts}
            subtitle="Requires attention"
            color="danger"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            icon={Activity}
            title="Leak Incidents"
            value={analytics.leakIncidents}
            subtitle="Detected today"
            color="danger"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            icon={CheckCircle}
            title="System Uptime"
            value={`${analytics.systemUptime}%`}
            subtitle="Last 30 days"
            color="success"
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-4 mb-4">
        {/* Sensor Trends */}
        <div className="col-12 col-lg-8">
          <div className="bg-dark border rounded p-4">
            <h2 className="h5 text-white mb-3">Sensor Trends (Recent)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#495057" />
                <XAxis dataKey="time" stroke="#adb5bd" />
                <YAxis stroke="#adb5bd" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#212529",
                    border: "1px solid #343a40",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="pressure" stroke="#0d6efd" strokeWidth={2} name="Pressure (PSI)" />
                <Line type="monotone" dataKey="flowRate" stroke="#198754" strokeWidth={2} name="Flow Rate (L/min)" />
                <Line type="monotone" dataKey="temperature" stroke="#ffc107" strokeWidth={2} name="Temperature (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Distribution */}
        <div className="col-12 col-lg-4">
          <div className="bg-dark border rounded p-4">
            <h2 className="h5 text-white mb-3">Alert Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={alertsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : null}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {alertsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#212529",
                    border: "1px solid #343a40",
                    borderRadius: "6px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Average Readings */}
      <div className="row g-4">
        <div className="col-12">
          <div className="bg-dark border rounded p-4">
            <h2 className="h5 text-white mb-4">Average Sensor Readings (24h)</h2>
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <div className="bg-secondary bg-opacity-10 rounded p-3 border border-secondary">
                  <div className="text-secondary small mb-1">Average Pressure</div>
                  <div className="h4 fw-bold mb-0">{analytics.avgPressure} <span className="text-secondary small">PSI</span></div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="bg-secondary bg-opacity-10 rounded p-3 border border-secondary">
                  <div className="text-secondary small mb-1">Average Flow Rate</div>
                  <div className="h4 fw-bold mb-0">{analytics.avgFlowRate} <span className="text-secondary small">L/min</span></div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="bg-secondary bg-opacity-10 rounded p-3 border border-secondary">
                  <div className="text-secondary small mb-1">Average Temperature</div>
                  <div className="h4 fw-bold mb-0">{analytics.avgTemperature} <span className="text-secondary small">°C</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;