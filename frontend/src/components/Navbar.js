import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="logo">📊 Report Generator</div>

      <div className="menu">
        <Link className={isActive("/") ? "active" : ""} to="/">Dashboard</Link>
        <Link className={isActive("/clients") ? "active" : ""} to="/clients">Clients</Link>
        <Link className={isActive("/upload") ? "active" : ""} to="/upload">Upload</Link>
      </div>
    </nav>
  );
}