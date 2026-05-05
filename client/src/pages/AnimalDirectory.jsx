import { useState } from "react";
import AnimalCard from "../components/AnimalCard.jsx";
import ErrorState from "../components/ErrorState.jsx";
import Loading from "../components/Loading.jsx";
import PageHeader from "../components/PageHeader.jsx";
import useApiResource from "../hooks/useApiResource.js";

function AnimalDirectory() {
  const [search, setSearch] = useState("");
  const { data: animals, loading, error } = useApiResource(`/animals?search=${search}`, []);

  return (
    <div className="container">
      <PageHeader kicker="Digital directory" title="Animal Directory" />
      
      <div className="mb-4">
        <input
          type="text"
          className="form-control form-control-lg rounded-pill px-4"
          placeholder="Search for a campus friend by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ErrorState message={error} />
      {loading ? (
        <Loading />
      ) : (
        <div className="row g-4">
          {animals.length > 0 ? (
            animals.map((animal) => (
              <div className="col-md-6 col-xl-4" key={animal._id}>
                <AnimalCard animal={animal} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p className="text-muted">No animals found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AnimalDirectory;
