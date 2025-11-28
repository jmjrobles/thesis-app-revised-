import React from "react";
import { Menu, X, Home, Activity, AlertTriangle, Settings, User, LogOut, Droplets, MapPin } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";





const Sidebar = ({ sidebarOpen, setSidebarOpen, activeSection, setActiveSection, user }) => {
  const navItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "analytics", icon: Activity, label: "Analytics" },
    { id: "alerts", icon: AlertTriangle, label: "Alerts" },
    { id: "map", icon: MapPin, label: "Map View" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const handleLogout = () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
};


  return (
    <div
      className={`d-flex flex-column bg-dark border-end border-secondary transition-all ${
        sidebarOpen ? "p-2" : "p-1"
      }`}
      style={{ width: sidebarOpen ? "250px" : "80px" }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-2 mb-3">
        {sidebarOpen && (
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary p-2 rounded">
              <Droplets className="text-white" />
            </div>
            <div>
              <h5 className="text-white mb-0">Pipeline</h5>
              <small className="text-secondary">Monitor</small>
            </div>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn btn-outline-secondary btn-sm border-0"
        >
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-grow-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`btn w-100 text-start d-flex align-items-center gap-2 mb-2 ${
              activeSection === item.id
                ? "btn-primary text-white"
                : "btn-dark text-secondary"
            }`}
          >
            <item.icon />
            {sidebarOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-top border-secondary pt-3">
  {sidebarOpen && user?.email && (
    <div className="text-secondary text-truncate small mb-2 px-2">
      {user.email}
    </div>
  )}
        <button className="btn btn-dark text-secondary w-100 mb-2 d-flex align-items-center gap-2">
          <User /> {sidebarOpen && "Profile"}
        </button>
        <button
          onClick={handleLogout}
          className="btn btn-dark text-danger w-100 d-flex align-items-center gap-2"
        >
          <LogOut /> {sidebarOpen && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
