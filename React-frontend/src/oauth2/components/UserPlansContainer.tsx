import { Alert, Button } from "react-bootstrap";
import { newPlan, plan } from "../interfaces";
import { useState } from "react";
import NewPlanForm from "./NewPlanForm";
import { useNavigate } from "react-router-dom";
import MakeChangesModal from "./MakeChangesModal";

interface Props {
  plans: plan[];
  refresh: () => void;
  error: boolean;
  addNewPlan: (data: newPlan) => void;
  onDelete: (id: number) => void;
}

const UserPlansContainer = ({
  plans,
  refresh,
  error,
  addNewPlan,
  onDelete,
}: Props) => {
  const [adding, setAdding] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const goToPlan = (id: number) => {
    navigate(`/user/plans/${id}`);
  };

  const updatePlansData = (plan: newPlan) => {
    addNewPlan(plan);
    setAdding(false);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <ul className="list-group">
      {adding && <NewPlanForm onSubmit={updatePlansData} cancel={setAdding} />}
      <button
        className="btn btn-outline-secondary mx-1 my-1"
        onClick={() => refresh()}
      >
        Refresh
      </button>
      <Button
        variant="btn btn-outline-success mx-1 my-1"
        onClick={() => setAdding(true)}
        disabled={error}
      >
        Add New Plan
      </Button>
      <table className="table table-bordered my-3">
        <thead>
          <tr>
            <th>Plan Type</th>
            <th>Total Cost</th>
            <th>Num. Users</th>
            <th>Date Created</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id}>
              <td>{plan.type}</td>
              <td>${plan.total_cost}</td>
              <td>{plan.users}</td>
              <td>{plan.date_created}</td>
              <td>
                <button
                  className="btn btn-outline-danger mb-1"
                  disabled={plan.id === 0.1}
                  onClick={handleShow}
                >
                  Delete
                </button>
                <button
                  className="btn btn-outline-primary mb-1"
                  disabled={plan.id === 0.1}
                  onClick={() => goToPlan(plan.id)}
                >
                  Edit
                </button>
              </td>
              {show && (
                <MakeChangesModal
                  handleClose={handleClose}
                  handleChanges={() => {
                    onDelete(plan.id);
                    handleClose();
                  }}
                  title="Delete Plan"
                  body={`Are you sure you want to delete ${plan.id.toString()}?`}
                  successMessage="Cancel"
                  dangerMessage="Delete"
                />
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!plans.length ? (
        <Alert key="warning" variant="warning">
          No Plans Found
        </Alert>
      ) : null}
    </ul>
  );
};

export default UserPlansContainer;
