import { Link } from "react-router-dom";
import AdminNav from "../components/AdminNav.jsx";
import ErrorState from "../components/ErrorState.jsx";
import Loading from "../components/Loading.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import useApiResource from "../hooks/useApiResource.js";

function AdminDashboard() {
  const { data, loading, error } = useApiResource("/dashboard/summary", {});

  return (
    <div className="container">
      <PageHeader title="Admin Dashboard" kicker="Operations" action={<Link className="btn btn-success" to="/admin/animals/new">Add Animal</Link>} />
      <AdminNav />
      <ErrorState message={error} />
      {loading ? <Loading /> : (
        <section className="stat-grid">
          <StatCard label="Animals" value={data.animals} tone="success" />
          <StatCard label="Open Cases" value={data.openCases} tone="rose" />
          <StatCard label="Fed Today" value={data.fedToday} tone="amber" />
          <StatCard label="Reports" value={data.reports} tone="blue" />
          <StatCard label="Low Stock" value={data.lowStock} tone="rose" />
          <StatCard label="Volunteers" value={data.volunteers} tone="success" />
        </section>
      )}
    </div>
  );
}

export default AdminDashboard;
