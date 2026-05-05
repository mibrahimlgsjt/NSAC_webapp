import { NavLink } from "react-router-dom";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/animals", "Animals"],
  ["/admin/inventory", "Inventory"],
  ["/admin/medical", "Medical"],
  ["/admin/reports", "Reports"],
  ["/admin/feedings", "Feedings"]
];

function AdminNav() {
  return (
    <nav className="admin-tabs">
      {links.map(([to, label]) => (
        <NavLink key={to} to={to} end={to === "/admin"}>{label}</NavLink>
      ))}
    </nav>
  );
}

export default AdminNav;
