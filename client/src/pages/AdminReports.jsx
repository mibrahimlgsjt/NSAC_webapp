import AdminNav from "../components/AdminNav.jsx";
import ErrorState from "../components/ErrorState.jsx";
import Loading from "../components/Loading.jsx";
import PageHeader from "../components/PageHeader.jsx";
import useApiResource from "../hooks/useApiResource.js";
import api from "../services/api.js";

function AdminReports() {
  const { data: reports, loading, error, reload } = useApiResource("/emergency", []);

  async function resolve(id) {
    await api.put(`/emergency/${id}/resolve`);
    reload();
  }

  return (
    <div className="container">
      <PageHeader title="Emergency Reports" kicker="Admin" />
      <AdminNav />
      <ErrorState message={error} />
      {loading ? <Loading /> : (
        <div className="row g-3">
          {reports.map((report) => (
            <div className="col-md-6" key={report._id}>
              <article className={`report-card ${report.resolved ? "resolved" : ""}`}>
                <div className="d-flex justify-content-between">
                  <strong>{report.severity}</strong>
                  <span>{report.resolved ? "resolved" : "open"}</span>
                </div>
                <h2>{report.location}</h2>
                <p>{report.description}</p>
                <small>{report.animal?.name || "Unknown animal"} · {report.reporterName}</small>
                {!report.resolved && <button className="btn btn-sm btn-outline-success mt-3" onClick={() => resolve(report._id)}>Resolve</button>}
              </article>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReports;
