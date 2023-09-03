import { getToken, setToken } from "../UserManagement";
import UserDataContainer from "../components/UserDataContainer";
import UserPlansContainer from "../components/UserPlansContainer";
import { baseUserModel } from "../constants";
import { cookies } from "../Cookies";
import axios, { CanceledError, AxiosError } from "axios";
import { errorResponse, plan, user, updatedUser } from "../interfaces";
import { useEffect, useState } from "react";
import { refreshAccessToken } from "../HTTPRequests";
import { Navigate } from "react-router-dom";
import { Card, Container, Row, Col, Alert } from "react-bootstrap";

const UserPage = () => {
  const [redirectToUser, setRedirectToUser] = useState(false);
  const [plans, setPlans] = useState<plan[]>([]);
  const [userData, setUserData] = useState<user>(baseUserModel);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getUserPlans = () => {
    const controller = new AbortController();
    const token = getToken();
    setLoading(true);

    axios
      .get<plan[]>("http://localhost:8000/users/plans", {
        signal: controller.signal,
        headers: { Authorization: "Bearer " + token },
      })
      .then((resp) => {
        setPlans(resp.data);
        setLoading(false);
      })
      .catch((err) => {
        return handleApiError(err);
      });
    return () => controller.abort();
  };

  const handleApiError = async (err: unknown) => {
    if (axios.isCancel(err)) {
      return;
    }

    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<errorResponse>;
      if (
        axiosError.response?.data &&
        (axiosError.response.data.detail === "Signature has expired" ||
          axiosError.response.data.detail === "Not enough segments")
      ) {
        const refresh_token = cookies.get("refresh_token");
        if (refresh_token) {
          await refreshAccessToken(refresh_token);
        }
        setError(axiosError.response.data.detail);
        setToken("");
      }

      const errorMessage = axiosError.message || "An error occurred";
      setError(errorMessage); // Set the error message in state
    } else {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage); // Set the error message in state
    }
  };

  const getUserData = () => {
    const controller = new AbortController();
    const token = getToken();
    setLoading(true);

    axios
      .get<user>("http://localhost:8000/users/@me/", {
        signal: controller.signal,
        headers: { Authorization: "Bearer " + token },
      })
      .then((resp) => {
        setUserData(resp.data);
        setLoading(false);
      })
      .catch((err: AxiosError<errorResponse>) => {
        if (err instanceof CanceledError) return;
        setLoading(false);
        return handleApiError(err);
      });
    return () => controller.abort();
  };

  const updateUser = async (newUser: updatedUser) => {
    const oldData = userData;
    try {
      // Update local state optimistically
      const updatedUserData: user = {
        ...userData,
        ...(newUser.email !== undefined && { email: newUser.email }),
        ...(newUser.forename !== undefined && { forename: newUser.forename }),
        ...(newUser.surname !== undefined && { surname: newUser.surname }),
        ...(newUser.disabled !== undefined && { disabled: newUser.disabled }),
        id: 0.1,
      };

      setUserData(updatedUserData);

      // Prepare for API request
      const controller = new AbortController();
      const token = getToken();
      setLoading(true);

      // Perform API request
      const response = await axios.put<user>(
        "http://localhost:8000/users/@me/",

        updatedUserData,

        {
          signal: controller.signal,
          headers: { Authorization: "Bearer " + token },
        }
      );

      // Update local state with response data
      setLoading(false);
      if (newUser.email !== undefined) {
        signOut();
      }
      setUserData(response.data);
    } catch (err: unknown) {
      setUserData(oldData);
      setLoading(false);
      return handleApiError(err);
    }
  };

  const signOut = () => {
    sessionStorage.clear();
    setUserData(baseUserModel);
    setPlans([]);
    cookies.remove("refresh_token");
    setRedirectToUser(true);
  };

  const refresh = async () => {
    setError("");
    await getUserData();
    if (!error) {
      getUserPlans();
    }
  };

  useEffect(() => {
    const accessToken = getToken();
    if (accessToken === null) {
      setRedirectToUser(true);
    } else if (redirectToUser === false) {
      refresh();
    }
  }, [redirectToUser]);

  if (redirectToUser) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={6} lg={6} xs={12}>
            <div className="border border-3 border-primary"></div>
            <Card className="shadow">
              <Card.Body>
                <div className="mb-3 mt-md-4 d-flex align-items-center justify-content-between">
                  <h2 className="fw-bold mb-2 text-uppercase">
                    Power Profiler
                  </h2>
                  <img src="/logo.svg" alt="Logo" className="logo-img" />
                </div>
                {error && (
                  <Alert key="warning" variant="warning">
                    {error}
                  </Alert>
                )}
                {isLoading && <div className="spinner-border my-3"></div>}
                {getToken() && (
                  <UserDataContainer
                    updateUser={updateUser}
                    user={userData}
                    refresh={refresh}
                    onSignOut={signOut}
                  />
                )}
                <div className="mt-3">
                  <p className="mb-0 text-center"></p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={6} xs={12}>
            <div className="border border-3 border-danger"></div>
            <Card className="shadow">
              <Card.Body>
                {isLoading && <div className="spinner-border my-3"></div>}
                {getToken() && (
                  <UserPlansContainer
                    plans={plans}
                    refresh={refresh}
                    error={userData.id === 0.1}
                  />
                )}
                <div className="mt-3">
                  <p className="mb-0 text-center"></p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserPage;
