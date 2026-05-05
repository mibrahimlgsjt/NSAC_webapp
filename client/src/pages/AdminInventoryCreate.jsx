import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNav from "../components/AdminNav.jsx";
import ErrorState from "../components/ErrorState.jsx";
import InventoryForm from "../components/InventoryForm.jsx";
import PageHeader from "../components/PageHeader.jsx";
import api from "../services/api.js";

const blankItem = {
  name: "",
  category: "C",
  vedCategory: "D",
  quantity: 0,
  unit: "kg",
  lowStockThreshold: 5
};

function AdminInventoryCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState(blankItem);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/inventory", form);
      navigate("/admin/inventory");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container narrow">
      <PageHeader title="New Inventory Item" kicker="Admin" />
      <AdminNav />
      <ErrorState message={error} />
      <InventoryForm form={form} setForm={setForm} onSubmit={submit} saving={saving} submitLabel="Create Item" />
    </div>
  );
}

export default AdminInventoryCreate;
