import { Link } from "react-router-dom";
import AnimalCard from "../components/AnimalCard.jsx";
import ErrorState from "../components/ErrorState.jsx";
import Loading from "../components/Loading.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import useApiResource from "../hooks/useApiResource.js";

function Home() {
  const summary = useApiResource("/dashboard/summary", {});
  const trending = useApiResource("/animals/trending", []);

  return (
    <div className="container">
      <PageHeader
        kicker="Hey there, campus friend! 🐾"
        title="NSAC Campus Companions"
        action={
          <div className="d-flex gap-2">
            <Link className="btn btn-meadow" to="/admin/feedings">🍚 Log a Feeding</Link>
            <Link className="btn btn-rose" to="/emergency">🚨 SOS</Link>
          </div>
        }
      />

      <ErrorState message={summary.error || trending.error} />
      {summary.loading ? (
        <Loading />
      ) : (
        <section className="stat-grid">
          <StatCard label="Friends" value={summary.data.animals} tone="success" />
          <StatCard label="Open Cases" value={summary.data.openCases} tone="rose" />
          <StatCard label="Fed Today" value={summary.data.fedToday} tone="amber" />
          <StatCard label="Low Stock" value={summary.data.lowStock} tone="blue" />
        </section>
      )}

      <section className="section-block">
        <div className="section-title">
          <h2>Popular this week ✨</h2>
          <Link to="/animals" className="text-paw fw-bold text-decoration-none">View all friends</Link>
        </div>
        {trending.loading ? (
          <Loading />
        ) : (
          <div className="row g-4">
            {trending.data.map((animal) => (
              <div className="col-md-6 col-xl-4" key={animal._id}>
                <AnimalCard animal={animal} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
