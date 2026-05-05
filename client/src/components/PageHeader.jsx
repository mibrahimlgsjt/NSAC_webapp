function PageHeader({ title, kicker, action }) {
  return (
    <header className="page-header">
      <div>
        {kicker && <p className="eyebrow">{kicker}</p>}
        <h1>{title}</h1>
      </div>
      {action}
    </header>
  );
}

export default PageHeader;
