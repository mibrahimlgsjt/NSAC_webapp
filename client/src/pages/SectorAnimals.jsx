import { Link, useParams } from "react-router-dom";
import AnimalCard from "../components/AnimalCard.jsx";
import ErrorState from "../components/ErrorState.jsx";
import Loading from "../components/Loading.jsx";
import PageHeader from "../components/PageHeader.jsx";
import useApiResource from "../hooks/useApiResource.js";

function SectorAnimals() {
  const { sector } = useParams();
  const { data: animals, loading, error } = useApiResource(`/animals/sector/${sector}`, []);

  return (
    <div className="container">
      <PageHeader title={`${sector} Sector`} kicker="Sector view" action={<Link className="btn btn-outline-success" to="/feed-status">Feed Status</Link>} />
      <ErrorState message={error} />
      {loading ? <Loading /> : (
        <div className="row g-4">
          {animals.map((animal) => <div className="col-md-6 col-xl-4" key={animal._id}><AnimalCard animal={animal} /></div>)}
        </div>
      )}
    </div>
  );
}

export default SectorAnimals;
