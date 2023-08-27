import { plan } from "../interfaces";

interface Props {
  plans: plan[];
  refresh: () => void;
}

const UserPlansContainer = ({ plans, refresh }: Props) => {
  return (
    <ul className="list-group">
      <button className="btn btn-outline-secondary mx-1 my-1" onClick={refresh}>
        Refresh
      </button>
      <table className="table table-bordered my-3">
        <thead>
          <tr>
            <th>Plan Type</th>
            <th>Total Cost</th>
            <th>Num. Users</th>
            <th>Date Created</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id}>
              <td>{plan.type}</td>
              <td>${plan.total_cost}</td>
              <td>{plan.users}</td>
              <td>{plan.date_created}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ul>
  );
};

export default UserPlansContainer;
