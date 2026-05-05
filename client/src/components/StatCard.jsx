function StatCard({ label, value, tone = "success" }) {
  return (
    <article className={`stat-card stat-card-${tone}`}>
      <span>{label}</span>
      <strong>{value ?? 0}</strong>
    </article>
  );
}

export default StatCard;
