function AnimalForm({ form, setForm, onSubmit, saving, submitLabel }) {
  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  return (
    <form className="form-panel" onSubmit={onSubmit}>
      <input className="form-control" name="name" placeholder="Name" value={form.name} onChange={update} required />
      <div className="row g-3">
        <div className="col-md-6">
          <input className="form-control" name="species" placeholder="Species" value={form.species} onChange={update} required />
        </div>
        <div className="col-md-6">
          <input className="form-control" name="sector" placeholder="Sector" value={form.sector} onChange={update} required />
        </div>
      </div>
      <div className="row g-3">
        <div className="col-md-6">
          <select className="form-select" name="healthStatus" value={form.healthStatus} onChange={update}>
            <option>Healthy</option>
            <option>Sick</option>
            <option>Injured</option>
            <option>Recovering</option>
          </select>
        </div>
        <div className="col-md-6">
          <input className="form-control" name="mood" placeholder="Mood" value={form.mood} onChange={update} />
        </div>
      </div>
      <input className="form-control" name="personalityTags" placeholder="Personality tags, comma separated" value={form.personalityTags} onChange={update} />
      <input className="form-control" name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={update} />
      <button className="btn btn-success" disabled={saving}>{saving ? "Saving..." : submitLabel}</button>
    </form>
  );
}

export default AnimalForm;
