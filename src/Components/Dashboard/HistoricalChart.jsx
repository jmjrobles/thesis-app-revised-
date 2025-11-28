import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

const HistoricalChart = ({ data }) => (
  <div className="bg-dark border rounded p-4">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h2 className="h5 text-white mb-0">Historical Trends (24h)</h2>
      <TrendingUp className="text-primary" />
    </div>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
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
);

export default HistoricalChart;
