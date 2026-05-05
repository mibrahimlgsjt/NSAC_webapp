import { useState } from "react";
import AdminNav from "../components/AdminNav.jsx";
import ErrorState from "../components/ErrorState.jsx";
import Loading from "../components/Loading.jsx";
import PageHeader from "../components/PageHeader.jsx";
import useApiResource from "../hooks/useApiResource.js";
import api from "../services/api.js";

function AdminFeedings() {
  const feedings = useApiResource("/feedings", []);
  const animals = useApiResource("/animals", []);
  const [form, setForm] = useState({ animal: "", notes: "" });
  const [submitError, setSubmitError] = useState("");

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitError("");
    try {
      await api.post("/feedings", form);
      setForm({ animal: "", notes: "" });
      feedings.reload();
    } catch (requestError) {
      setSubmitError(requestError.response?.data?.message || requestError.message);
    }
  }

  return (
    <div className="container">
      <PageHeader title="Feeding Logs" kicker="Admin" />
      <AdminNav />
      <ErrorState message={feedings.error || animals.error || submitError} />
      <form className="form-panel compact-form" onSubmit={submit}>
        <select className="form-select" name="animal" value={form.animal} onChange={update} required>
          <option value="">Select animal</option>
          {animals.data.map((animal) => <option key={animal._id} value={animal._id}>{animal.name} · {animal.sector}</option>)}
        </select>
        <input className="form-control" name="notes" value={form.notes} onChange={update} placeholder="Notes" />
        <button className="btn btn-success">Log Feeding</button>
      </form>
      {feedings.loading ? <Loading /> : (
        <div className="table-responsive table-panel">
          <table className="table align-middle">
            <thead><tr><th>Animal</th><th>Volunteer</th><th>Fed At</th><th>Notes</th></tr></thead>
            <tbody>
              {feedings.data.map((feeding) => (
                <tr key={feeding._id}>
                  <td>{feeding.animal?.name}</td>
                  <td>{feeding.volunteer?.username}</td>
                  <td>{new Date(feeding.fedAt).toLocaleString()}</td>
                  <td>{feeding.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminFeedings;
