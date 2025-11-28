import React from "react";
import { Bell } from "lucide-react";
import AlertItem from "./AlertItem";

const AlertsPanel = ({ alerts = [] }) => ( // Add default value
  <div className="bg-dark border rounded p-4">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h2 className="h5 text-white mb-0">Recent Alerts</h2>
      <Bell className="text-warning" />
    </div>
    <div className="overflow-auto" style={{ maxHeight: "300px" }}>
      {alerts.length > 0 ? (
        alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))
      ) : (
        <p className="text-secondary text-center py-4">No alerts</p>
      )}
    </div>
  </div>
);

export default AlertsPanel;
