import React from "react";

const SensorCard = ({ icon: Icon, title, value, unit, status, threshold }) => (
  <div className="card bg-dark border border-secondary text-white h-100">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="bg-primary bg-opacity-25 p-2 rounded">
          <Icon className="text-primary" />
        </div>
        <span
          className={`badge ${
            status === "normal" || status === "good"
              ? "bg-success"
              : "bg-warning text-dark"
          }`}
        >
          {status.toUpperCase()}
        </span>
      </div>
      <h6 className="text-muted text-capitalize">{title}</h6>
      <div className="d-flex align-items-end gap-2">
        <h3 className="fw-bold mb-0">{value.toFixed(1)}</h3>
        <span className="text-muted">{unit}</span>
      </div>
      <hr />
      <small className="text-secondary">
        Threshold: {threshold} {unit}
      </small>
    </div>
  </div>
);

export default SensorCard;
