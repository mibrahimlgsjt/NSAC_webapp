import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNav from "../components/AdminNav.jsx";
import ErrorState from "../components/ErrorState.jsx";
import InventoryForm from "../components/InventoryForm.jsx";
import Loading from "../components/Loading.jsx";
import PageHeader from "../components/PageHeader.jsx";
import useApiResource from "../hooks/useApiResource.js";
import api from "../services/api.js";

function AdminInventoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: item, loading, error } = useApiResource(`/inventory/${id}`, null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || "",
        category: item.category || "C",
        vedCategory: item.vedCategory || "D",
        quantity: item.quantity || 0,
        unit: item.unit || "",
        lowStockThreshold: item.lowStockThreshold || 5
      });
    }
  }, [item]);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setSubmitError("");
    try {
      await api.put(`/inventory/${id}`, form);
      navigate("/admin/inventory");
    } catch (requestError) {
      setSubmitError(requestError.response?.data?.message || requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container narrow">
      <PageHeader title="Edit Inventory Item" kicker="Admin" />
      <AdminNav />
      <ErrorState message={error || submitError} />
      {loading || !form ? <Loading /> : <InventoryForm form={form} setForm={setForm} onSubmit={submit} saving={saving} submitLabel="Save Item" />}
    </div>
  );
}

export default AdminInventoryEdit;
