import { user } from "../interfaces";

interface Props {
  user: user;
  refresh: () => void;
  updateUser: React.Dispatch<React.SetStateAction<boolean>>;
  onSignOut: () => void;
}

const UserDataContainer = ({ user, refresh, onSignOut, updateUser }: Props) => {
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
            onClick={() => updateUser(true)}
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
    </ul>
  );
};

export default UserDataContainer;
