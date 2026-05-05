import { Link } from "react-router-dom";
import ErrorState from "../components/ErrorState.jsx";
import Loading from "../components/Loading.jsx";
import PageHeader from "../components/PageHeader.jsx";
import useApiResource from "../hooks/useApiResource.js";

function FeedStatus() {
  const { data: sectors, loading, error } = useApiResource("/dashboard/feed-status", []);

  return (
    <div className="container">
      <PageHeader title="Feeding Status" kicker="Sector rounds" />
      <ErrorState message={error} />
      {loading ? <Loading /> : (
        <div className="row g-3">
          {sectors.map((sector) => (
            <div className="col-md-6 col-xl-3" key={sector.sector}>
              <Link className={`sector-card sector-${sector.status}`} to={`/animals/sector/${sector.sector}`}>
                <span>{sector.sector}</span>
                <strong>{sector.status}</strong>
                <small>{sector.hoursSinceFed === null ? "No feeding logged" : `${sector.hoursSinceFed}h since last feed`}</small>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedStatus;
