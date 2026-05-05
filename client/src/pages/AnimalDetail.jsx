import { useParams } from "react-router-dom";
import { useState } from "react";
import ErrorState from "../components/ErrorState.jsx";
import Loading from "../components/Loading.jsx";
import useApiResource from "../hooks/useApiResource.js";
import api from "../services/api.js";

function AnimalDetail() {
  const { id } = useParams();
  const { data, loading, error, setData } = useApiResource(`/animals/${id}`, {
    animal: null,
    sightings: [],
    feedings: [],
    medicalLogs: []
  });
  const [liking, setLiking] = useState(false);

  async function handleLike() {
    if (liking) return;
    setLiking(true);
    try {
      const response = await api.post(`/animals/${id}/like`);
      setData((current) => ({
        ...current,
        animal: { ...current.animal, likes: response.data.likes }
      }));
    } catch (err) {
      console.error("Failed to like animal:", err);
    } finally {
      setLiking(false);
    }
  }

  if (loading) return <div className="container"><Loading /></div>;

  const { animal, sightings, feedings, medicalLogs } = data;

  return (
    <div className="container">
      <ErrorState message={error} />
      {animal && (
        <>
          <section className="profile-hero">
            <img src={animal.imageUrl} alt={animal.name} />
            <div>
              <p className="eyebrow">{animal.sector} · {animal.species}</p>
              <h1>{animal.name}</h1>
              <div className="d-flex align-items-center gap-3 mt-2">
                <span className="badge text-bg-light">{animal.healthStatus}</span>
                <span className="badge text-bg-light">{animal.mood}</span>
                <button 
                  className={`btn btn-sm ${liking ? 'btn-secondary' : 'btn-light'} rounded-pill px-3`}
                  onClick={handleLike}
                  disabled={liking}
                >
                  ❤️ {animal.likes} Likes
                </button>
              </div>
            </div>
          </section>

          <div className="row g-4 section-block">
            <div className="col-lg-4">
              <h2>Traits</h2>
              <div className="tag-row">
                {(animal.personalityTags || []).map((tag) => (
                  <span className="tag-pill" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="col-lg-4">
              <h2>Feeding Timeline</h2>
              <ul className="timeline-list">
                {feedings.length > 0 ? (
                  feedings.map((feeding) => (
                    <li key={feeding._id}>
                      <strong>{new Date(feeding.fedAt).toLocaleString()}</strong>
                      <span>{feeding.volunteer?.username || "Volunteer"} · {feeding.notes}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-muted border-0">No feeding history recorded yet.</li>
                )}
              </ul>
            </div>
            <div className="col-lg-4">
              <h2>Medical Notes</h2>
              <ul className="timeline-list">
                {medicalLogs.length > 0 ? (
                  medicalLogs.map((log) => (
                    <li key={log._id}>
                      <strong>{log.status}</strong>
                      <span>{log.description}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-muted border-0">No medical notes recorded yet.</li>
                )}
              </ul>
            </div>
          </div>

          <section className="section-block">
            <h2>Recent Sightings</h2>
            <div className="masonry-lite">
              {sightings.length > 0 ? (
                sightings.map((sighting) => (
                  <article className="mini-card" key={sighting._id}>
                    {sighting.imageUrl && <img src={sighting.imageUrl} alt={sighting.locationHint} />}
                    <strong>{sighting.locationHint}</strong>
                    <span>{new Date(sighting.createdAt).toLocaleString()}</span>
                  </article>
                ))
              ) : (
                <div className="col-12 text-center py-4 bg-light rounded">
                  <p className="text-muted m-0">No sightings reported recently.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default AnimalDetail;
