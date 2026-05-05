import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNav from "../components/AdminNav.jsx";
import AnimalForm from "../components/AnimalForm.jsx";
import ErrorState from "../components/ErrorState.jsx";
import Loading from "../components/Loading.jsx";
import PageHeader from "../components/PageHeader.jsx";
import useApiResource from "../hooks/useApiResource.js";
import api from "../services/api.js";

function AdminAnimalEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useApiResource(`/animals/${id}`, { animal: null });
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (data.animal) {
      setForm({
        name: data.animal.name || "",
        species: data.animal.species || "Cat",
        sector: data.animal.sector || "",
        healthStatus: data.animal.healthStatus || "Healthy",
        mood: data.animal.mood || "",
        personalityTags: (data.animal.personalityTags || []).join(","),
        imageUrl: data.animal.imageUrl || ""
      });
    }
  }, [data]);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setSubmitError("");
    try {
      await api.put(`/animals/${id}`, form);
      navigate("/admin/animals");
    } catch (requestError) {
      setSubmitError(requestError.response?.data?.message || requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container narrow">
      <PageHeader title="Edit Animal" kicker="Admin" />
      <AdminNav />
      <ErrorState message={error || submitError} />
      {loading || !form ? <Loading /> : <AnimalForm form={form} setForm={setForm} onSubmit={submit} saving={saving} submitLabel="Save Animal" />}
    </div>
  );
}

export default AdminAnimalEdit;
