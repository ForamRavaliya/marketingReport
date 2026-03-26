import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="logo">📊 Report Generator</div>

      <div className="menu">
        {/* ⚠ Dashboard path fix */}
        <Link className={isActive("/dashboard") ? "active" : ""} to="/dashboard">
          Dashboard
        </Link>

        <Link className={isActive("/clients") ? "active" : ""} to="/clients">
          Clients
        </Link>

        <Link className={isActive("/upload") ? "active" : ""} to="/upload">
          Upload
        </Link>

        {/* ✅ LOGOUT BUTTON */}
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}