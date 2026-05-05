import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  ["/", "🏠", "Home"],
  ["/animals", "🐾", "Find"],
  ["/emergency", "🚨", "SOS"],
  ["/admin/inventory", "📦", "Stock"],
  ["/admin", "👤", "Me"]
];

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="navbar navbar-dark">
      {navItems.map(([to, icon, label]) => (
        <NavLink className={`nav-link ${label === 'SOS' ? 'sos-link' : ''}`} to={to} key={to}>
          <span className="nav-icon fs-4">{icon}</span>
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default Navbar;
