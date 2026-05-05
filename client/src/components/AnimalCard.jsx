import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";

function AnimalCard({ animal: initialAnimal }) {
  const [animal, setAnimal] = useState(initialAnimal);
  const [liking, setLiking] = useState(false);

  async function handleLike(e) {
    e.preventDefault();
    e.stopPropagation();
    if (liking) return;
    setLiking(true);
    try {
      const response = await api.post(`/animals/${animal._id}/like`);
      setAnimal((current) => ({ ...current, likes: response.data.likes }));
    } catch (err) {
      console.error("Failed to like animal:", err);
    } finally {
      setLiking(false);
    }
  }

  return (
    <article className="animal-card">
      <Link to={`/animals/${animal._id}`} className="text-decoration-none color-inherit position-relative d-block">
        <img src={animal.imageUrl || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80"} alt={animal.name} />
        
        <div className="position-absolute bottom-0 start-0 m-3">
          <span className="badge bg-white text-dark shadow-sm py-2 px-3 border-0">
            🐾 {animal.mood || "Friendly"}
          </span>
        </div>

        <div className="animal-card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-dark h3 mb-0">{animal.name}</h2>
            <div className="tag-pill bg-meadow-light text-meadow border-0">
              🍚 {Math.floor(Math.random() * 8)}h ago
            </div>
          </div>
          <p className="text-muted small mt-1">{animal.sector} · {animal.species}</p>
          
          <div className="tag-row mt-3">
            {(animal.personalityTags || []).slice(0, 3).map((tag) => (
              <span className="tag-pill" key={tag}>{tag}</span>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <span className="btn btn-link text-paw p-0 text-decoration-none fw-bold">View Profile →</span>
            <button 
              className={`btn btn-sm ${liking ? 'btn-paw' : 'btn-paw-light'} rounded-pill`}
              onClick={handleLike}
              disabled={liking}
            >
              ❤️ {animal.likes}
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default AnimalCard;
