import ErrorState from "../components/ErrorState.jsx";
import Loading from "../components/Loading.jsx";
import PageHeader from "../components/PageHeader.jsx";
import useApiResource from "../hooks/useApiResource.js";

function Volunteers() {
  const { data: volunteers, loading, error } = useApiResource("/dashboard/volunteers", []);

  return (
    <div className="container">
      <PageHeader title="Volunteers" kicker="Team activity" />
      <ErrorState message={error} />
      {loading ? <Loading /> : (
        <div className="table-responsive table-panel">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Feedings</th>
                <th>Medical Cases</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer.id}>
                  <td>{volunteer.username}</td>
                  <td><span className="badge text-bg-light">{volunteer.role}</span></td>
                  <td>{volunteer.feedings}</td>
                  <td>{volunteer.medicalCases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Volunteers;
