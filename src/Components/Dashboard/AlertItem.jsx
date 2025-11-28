import React from "react";
import { AlertTriangle } from "lucide-react";

const AlertItem = ({ alert }) => {
  const severityClasses = {
    critical: "border-start border-4 border-danger bg-danger bg-opacity-10",
    high: "border-start border-4 border-danger bg-danger bg-opacity-10",
    warning: "border-start border-4 border-warning bg-warning bg-opacity-10",
    medium: "border-start border-4 border-warning bg-warning bg-opacity-10",
    info: "border-start border-4 border-primary bg-primary bg-opacity-10",
    low: "border-start border-4 border-primary bg-primary bg-opacity-10",
  };

  const className = severityClasses[alert.severity] || severityClasses.info;

  return (
    <div className={`p-3 rounded ${severityClasses[alert.severity]} mb-3`}>
      <div className="d-flex justify-content-between align-items-start">
        <div className="d-flex align-items-start gap-2">
          <AlertTriangle className="text-warning mt-1" />
          <div>
            <p className="text-white fw-semibold mb-1">{alert.message}</p>
            <small className="text-secondary">{alert.time}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertItem;
