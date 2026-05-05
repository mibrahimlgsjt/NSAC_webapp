function InventoryForm({ form, setForm, onSubmit, saving, submitLabel }) {
  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  return (
    <form className="form-panel" onSubmit={onSubmit}>
      <input className="form-control" name="name" placeholder="Item name" value={form.name} onChange={update} required />
      <div className="row g-3">
        <div className="col-md-4">
          <select className="form-select" name="category" value={form.category} onChange={update}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" name="vedCategory" value={form.vedCategory} onChange={update}>
            <option value="V">V</option>
            <option value="E">E</option>
            <option value="D">D</option>
          </select>
        </div>
        <div className="col-md-4">
          <input className="form-control" name="unit" placeholder="Unit" value={form.unit} onChange={update} />
        </div>
      </div>
      <div className="row g-3">
        <div className="col-md-6">
          <input className="form-control" type="number" step="0.01" name="quantity" placeholder="Quantity" value={form.quantity} onChange={update} />
        </div>
        <div className="col-md-6">
          <input className="form-control" type="number" step="0.01" name="lowStockThreshold" placeholder="Low stock threshold" value={form.lowStockThreshold} onChange={update} />
        </div>
      </div>
      <button className="btn btn-success" disabled={saving}>{saving ? "Saving..." : submitLabel}</button>
    </form>
  );
}

export default InventoryForm;
