import { Link } from "react-router-dom";
import AdminNav from "../components/AdminNav.jsx";
import ErrorState from "../components/ErrorState.jsx";
import Loading from "../components/Loading.jsx";
import PageHeader from "../components/PageHeader.jsx";
import useApiResource from "../hooks/useApiResource.js";
import api from "../services/api.js";

function AdminAnimals() {
  const { data: animals, loading, error, reload } = useApiResource("/animals", []);

  async function remove(id) {
    await api.delete(`/animals/${id}`);
    reload();
  }

  return (
    <div className="container">
      <PageHeader title="Manage Animals" kicker="Admin" action={<Link className="btn btn-success" to="/admin/animals/new">New Animal</Link>} />
      <AdminNav />
      <ErrorState message={error} />
      {loading ? <Loading /> : (
        <div className="table-responsive table-panel">
          <table className="table align-middle">
            <thead><tr><th>Name</th><th>Species</th><th>Sector</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {animals.map((animal) => (
                <tr key={animal._id}>
                  <td>{animal.name}</td>
                  <td>{animal.species}</td>
                  <td>{animal.sector}</td>
                  <td>{animal.healthStatus}</td>
                  <td className="text-end">
                    <Link className="btn btn-sm btn-outline-success me-2" to={`/admin/animals/${animal._id}/edit`}>Edit</Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(animal._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminAnimals;
