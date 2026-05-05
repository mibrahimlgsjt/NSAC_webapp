function Loading({ label = "Loading data" }) {
  return (
    <div className="loading-state">
      <div className="spinner-border text-success" role="status" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default Loading;
