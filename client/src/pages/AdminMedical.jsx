import AdminNav from "../components/AdminNav.jsx";
import ErrorState from "../components/ErrorState.jsx";
import Loading from "../components/Loading.jsx";
import PageHeader from "../components/PageHeader.jsx";
import useApiResource from "../hooks/useApiResource.js";
import api from "../services/api.js";

function AdminMedical() {
  const { data: logs, loading, error, reload } = useApiResource("/medical", []);

  async function closeCase(id) {
    await api.put(`/medical/${id}/close`, { cost: 0 });
    reload();
  }

  async function handleExport() {
    try {
      const response = await api.get("/medical/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "medical_logs.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed:", err);
    }
  }

  return (
    <div className="container">
      <PageHeader 
        title="Medical Cases" 
        kicker="Admin" 
        action={<button className="btn btn-outline-success" onClick={handleExport}>Export CSV</button>} 
      />
      <AdminNav />
      <ErrorState message={error} />
      {loading ? <Loading /> : (
        <div className="table-responsive table-panel">
          <table className="table align-middle">
            <thead><tr><th>Animal</th><th>Status</th><th>Description</th><th>Volunteer</th><th></th></tr></thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{log.animal?.name}</td>
                  <td><span className={`badge ${log.status === "open" ? "text-bg-danger" : "text-bg-success"}`}>{log.status}</span></td>
                  <td>{log.description}</td>
                  <td>{log.volunteer?.username}</td>
                  <td className="text-end">
                    {log.status === "open" && <button className="btn btn-sm btn-outline-success" onClick={() => closeCase(log._id)}>Close</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminMedical;
