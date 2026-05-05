import { useState } from "react";
import ErrorState from "../components/ErrorState.jsx";
import Loading from "../components/Loading.jsx";
import PageHeader from "../components/PageHeader.jsx";
import useApiResource from "../hooks/useApiResource.js";
import api from "../services/api.js";

function EmergencyReport() {
  const { data: animals, loading, error } = useApiResource("/animals", []);
  const [form, setForm] = useState({ animal: "", reporterName: "", location: "", severity: "other", description: "" });
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setSubmitError("");
    try {
      await api.post("/emergency", form);
      setMessage("Report submitted.");
      setForm({ animal: "", reporterName: "", location: "", severity: "other", description: "" });
    } catch (requestError) {
      setSubmitError(requestError.response?.data?.message || requestError.message);
    }
  }

  const severities = [
    { id: "minor_injury", label: "Minor Injury", icon: "🩹" },
    { id: "sickness", label: "Sickness", icon: "🤢" },
    { id: "urgent", label: "Urgent", icon: "🚨" },
    { id: "other", label: "Other", icon: "❓" }
  ];

  return (
    <div className="container narrow bg-emergency rounded-4 mt-4">
      <PageHeader title="Need help for an animal? 🚨" kicker="Rapid care queue" />

      <section className="bg-white p-4 rounded-4 shadow-sm mb-4 border-start border-danger border-5">
        <h2 className="h4 fw-bold mb-3">Critical Emergency?</h2>
        <p className="text-muted small mb-4">If an animal is in immediate danger or severely injured, use these one-touch links for faster response.</p>
        <div className="d-flex gap-3">
          <a href="tel:+923001234567" className="btn btn-rose flex-grow-1 py-3 fw-bold">📞 Call NSAC</a>
          <a href="https://wa.me/923001234567" className="btn btn-meadow flex-grow-1 py-3 fw-bold text-white">💬 WhatsApp</a>
        </div>
      </section>

      <ErrorState message={error || submitError} />
      {message && <div className="alert btn-meadow text-white fw-bold py-3 mb-4 border-0">Help is on the way! 💚 Thank you for caring.</div>}
      {loading ? <Loading /> : (
        <form className="form-panel emergency-panel bg-white" onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label fw-bold small text-muted">ANIMAL INVOLVED</label>
            <select className="form-select" name="animal" value={form.animal} onChange={update}>
              <option value="">Unknown or new animal</option>
              {animals.map((animal) => <option key={animal._id} value={animal._id}>{animal.name} · {animal.sector}</option>)}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold small text-muted">SEVERITY LEVEL</label>
            <div className="d-flex flex-wrap gap-2">
              {severities.map((sev) => (
                <button
                  key={sev.id}
                  type="button"
                  className={`btn flex-grow-1 py-3 ${form.severity === sev.id ? 'btn-paw shadow-sm' : 'btn-light border text-muted'}`}
                  onClick={() => setForm(f => ({ ...f, severity: sev.id }))}
                >
                  <div className="fs-3 mb-1">{sev.icon}</div>
                  <div className="small fw-bold">{sev.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold small text-muted">CONTACT INFO</label>
            <input className="form-control" name="reporterName" placeholder="Your name (optional)" value={form.reporterName} onChange={update} />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold small text-muted">LOCATION</label>
            <input className="form-control" name="location" placeholder="Where is the animal?" value={form.location} onChange={update} required />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold small text-muted">WHAT'S HAPPENING?</label>
            <textarea className="form-control" name="description" placeholder="Describe the situation..." value={form.description} onChange={update} rows="4" />
          </div>

          <button className="btn btn-rose w-100 py-3 fw-bold fs-5">Send Alert Now</button>
        </form>
      )}
    </div>
  );
}

export default EmergencyReport;
