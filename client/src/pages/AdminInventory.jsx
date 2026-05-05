import { Link } from "react-router-dom";
import AdminNav from "../components/AdminNav.jsx";
import ErrorState from "../components/ErrorState.jsx";
import Loading from "../components/Loading.jsx";
import PageHeader from "../components/PageHeader.jsx";
import useApiResource from "../hooks/useApiResource.js";
import api from "../services/api.js";

function AdminInventory() {
  const { data: items, loading, error, reload } = useApiResource("/inventory", []);

  async function remove(id) {
    await api.delete(`/inventory/${id}`);
    reload();
  }

  return (
    <div className="container">
      <PageHeader title="Inventory" kicker="Admin" action={<Link className="btn btn-success" to="/admin/inventory/new">New Item</Link>} />
      <AdminNav />
      <ErrorState message={error} />
      {loading ? <Loading /> : (
        <div className="table-responsive table-panel">
          <table className="table align-middle">
            <thead><tr><th>Item</th><th>ABC</th><th>VED</th><th>Quantity</th><th>Threshold</th><th></th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className={item.isLowStock ? "table-warning" : ""}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.vedCategory}</td>
                  <td>{item.quantity} {item.unit}</td>
                  <td>{item.lowStockThreshold}</td>
                  <td className="text-end">
                    <Link className="btn btn-sm btn-outline-success me-2" to={`/admin/inventory/${item._id}/edit`}>Edit</Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(item._id)}>Delete</button>
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

export default AdminInventory;
