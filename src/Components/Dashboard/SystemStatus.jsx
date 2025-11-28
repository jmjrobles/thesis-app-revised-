import React from "react";
import { Radio } from "lucide-react";

const SystemStatus = ({ status }) => {
  // Handle both object and string
  const statusValue = typeof status === "object" ? status.status : status;
  const statusText = statusValue?.toUpperCase() || "UNKNOWN";
  const isOnline = statusValue === "operational" || statusValue === "online";

  return (
    <div className="d-flex align-items-center gap-2 bg-dark border border-secondary rounded px-3 py-2">
      <Radio className={isOnline ? "text-success" : "text-danger"} />
      <div>
        <small className="text-secondary d-block">System Status</small>
        <strong className={isOnline ? "text-success" : "text-danger"}>
          {statusText}
        </strong>
      </div>
    </div>
  );
};

export default SystemStatus;
