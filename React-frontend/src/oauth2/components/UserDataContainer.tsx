import { useEffect } from "react";
import { User } from "../interfaces";

interface Props {
  user: User;
  error: string;
  isLoading: boolean;
  refresh: () => void;
  onSignOut: () => void;
}

const UserDataContainer = ({
  user,
  error,
  isLoading,
  refresh,
  onSignOut,
}: Props) => {
  useEffect(() => {
    refresh();
  }, []);

  return (
    <ul className="list-group">
      <button className="btn btn-outline-secondary mx-1 my-1" onClick={refresh}>
        Refresh
      </button>
      {error && <p className="text-danger">{error}</p>}
      {isLoading && <div className="spinner-border"></div>}
      <li
        key={user.id}
        className="list-group-item d-flex justify-content-between"
      >
        <div>
          {user.forename} {user.surname}
        </div>
        <div>
          {/* <button
              className="btn btn-outline-secondary mx-1"
              onClick={() => setUpdateUser()}
              disabled={user.id === 0.1}
            >
              Update
            </button> */}
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
