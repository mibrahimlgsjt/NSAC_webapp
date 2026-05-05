import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNav from "../components/AdminNav.jsx";
import AnimalForm from "../components/AnimalForm.jsx";
import ErrorState from "../components/ErrorState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import api from "../services/api.js";

const blankAnimal = {
  name: "",
  species: "Cat",
  sector: "",
  healthStatus: "Healthy",
  mood: "Friendly",
  personalityTags: "Friendly,Sleepy",
  imageUrl: ""
};

function AdminAnimalCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState(blankAnimal);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/animals", form);
      navigate("/admin/animals");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container narrow">
      <PageHeader title="New Animal" kicker="Admin" />
      <AdminNav />
      <ErrorState message={error} />
      <AnimalForm form={form} setForm={setForm} onSubmit={submit} saving={saving} submitLabel="Create Animal" />
    </div>
  );
}

export default AdminAnimalCreate;
