import { Link } from "react-router-dom";
import ErrorState from "../components/ErrorState.jsx";
import Loading from "../components/Loading.jsx";
import PageHeader from "../components/PageHeader.jsx";
import useApiResource from "../hooks/useApiResource.js";

function Sightings() {
  const { data: sightings, loading, error } = useApiResource("/sightings", []);

  return (
    <div className="container">
      <PageHeader title="Sightings" kicker="Recent campus reports" action={<Link className="btn btn-success" to="/sightings/new">New Sighting</Link>} />
      <ErrorState message={error} />
      {loading ? <Loading /> : (
        <div className="masonry-lite">
          {sightings.map((sighting) => (
            <article className="mini-card" key={sighting._id}>
              {sighting.imageUrl && <img src={sighting.imageUrl} alt={sighting.locationHint} />}
              <strong>{sighting.animal?.name}</strong>
              <span>{sighting.locationHint}</span>
              <small>{new Date(sighting.createdAt).toLocaleString()}</small>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Sightings;
