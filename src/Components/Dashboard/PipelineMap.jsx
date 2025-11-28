import React from "react";
import { MapPin } from "lucide-react";

const PipelineMap = () => (
  <div className="bg-dark border rounded p-4">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h2 className="h5 text-white mb-0">Pipeline Network Map</h2>
      <MapPin className="text-primary" />
    </div>
    <div className="bg-secondary bg-opacity-10 border rounded d-flex flex-column justify-content-center align-items-center" style={{ height: "400px" }}>
      <MapPin className="text-secondary mb-3" size={48} />
      <p className="text-muted mb-1">Interactive Map Component</p>
      <small className="text-secondary">Integrate React Leaflet or Google Maps here</small>
    </div>
  </div>
);

export default PipelineMap;
