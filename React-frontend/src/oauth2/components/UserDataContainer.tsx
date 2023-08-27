import { useState } from "react";
import { updatedUser, user } from "../interfaces";
import UpdateUserForm from "./UpdateUserForm";

interface Props {
  user: user;
  refresh: () => void;
  onSignOut: () => void;
  updateUser: (user: updatedUser) => void;
}

const UserDataContainer = ({ user, refresh, onSignOut, updateUser }: Props) => {
  const [updating, setUpdating] = useState(false);

  const updateUserData = async (user: updatedUser) => {
    await updateUser(user);
    setUpdating(false);
  };

  return (
    <ul className="list-group">
      <button className="btn btn-outline-secondary mx-1 my-1" onClick={refresh}>
        Refresh
      </button>
      <li
        key={user.id}
        className="list-group-item d-flex justify-content-between"
      >
        <div>
          {user.forename} {user.surname}
        </div>
        <div>{user.email}</div>
        <div>
          <button
            className="btn btn-outline-secondary mx-1"
            onClick={() => setUpdating(true)}
            disabled={user.id === 0.1}
          >
            Update
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => onSignOut()}
            disabled={user.id === 0.1}
          >
            Sign Out
          </button>
        </div>
      </li>
      <br />
      {updating && (
        <UpdateUserForm onSubmit={updateUserData} cancel={setUpdating} />
      )}
    </ul>
  );
};

export default UserDataContainer;
