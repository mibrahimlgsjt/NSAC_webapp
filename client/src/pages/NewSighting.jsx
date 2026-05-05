import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorState from "../components/ErrorState.jsx";
import Loading from "../components/Loading.jsx";
import PageHeader from "../components/PageHeader.jsx";
import useApiResource from "../hooks/useApiResource.js";
import api from "../services/api.js";

function NewSighting() {
  const navigate = useNavigate();
  const { data: animals, loading, error } = useApiResource("/animals", []);
  const [form, setForm] = useState({ animal: "", reporterName: "", locationHint: "", notes: "", imageUrl: "" });
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setSubmitError("");
    try {
      await api.post("/sightings", form);
      navigate("/sightings");
    } catch (requestError) {
      setSubmitError(requestError.response?.data?.message || requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container narrow">
      <PageHeader title="New Sighting" kicker="Campus observation" />
      <ErrorState message={error || submitError} />
      {loading ? <Loading /> : (
        <form className="form-panel" onSubmit={submit}>
          <select className="form-select" name="animal" value={form.animal} onChange={update} required>
            <option value="">Select animal</option>
            {animals.map((animal) => <option key={animal._id} value={animal._id}>{animal.name} · {animal.sector}</option>)}
          </select>
          <input className="form-control" name="reporterName" placeholder="Reporter name" value={form.reporterName} onChange={update} />
          <input className="form-control" name="locationHint" placeholder="Location" value={form.locationHint} onChange={update} required />
          <input className="form-control" name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={update} />
          <textarea className="form-control" name="notes" placeholder="Notes" value={form.notes} onChange={update} rows="4" />
          <button className="btn btn-success" disabled={saving}>{saving ? "Saving..." : "Save Sighting"}</button>
        </form>
      )}
    </div>
  );
}

export default NewSighting;
