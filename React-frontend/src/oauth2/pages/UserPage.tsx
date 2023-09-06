import { getToken } from "../UserManagement";
import UserDataContainer from "../components/UserDataContainer";
import UserPlansContainer from "../components/UserPlansContainer";
import { baseUserModel } from "../constants";
import { cookies } from "../cookiemanagement";
import { plan, user, updatedUser, newPlan } from "../interfaces";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, Container, Row, Col, Alert } from "react-bootstrap";
import {
  getUserData,
  getUserPlans,
  updateUser,
  createPlan,
  deletePlan,
} from "../HTTPRequests";

const UserPage = () => {
  const [redirectToUser, setRedirectToUser] = useState(false);
  const [plans, setPlans] = useState<plan[]>([]);
  const [userData, setUserData] = useState<user>(baseUserModel);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleError = (requestError: any) => {
    if (typeof requestError === "string") {
      setError(requestError);
    }
  };

  const handleDeletePlan = (plan_id: number) => {
    setLoading(true);
    handleError(deletePlan(plan_id, setPlans));
    setLoading(false);
  };
  const handleCreatePlan = (data: newPlan) => {
    setLoading(true);
    handleError(createPlan(data, userData.id, setPlans));
    setLoading(false);
  };

  const handleUpdateUser = (user: updatedUser) => {
    setLoading(true);
    handleError(updateUser(user, userData, setUserData, signOut));
    setLoading(false);
  };

  const signOut = () => {
    sessionStorage.clear();
    setUserData(baseUserModel);
    setPlans([]);
    cookies.remove("refresh_token");
    setRedirectToUser(true);
  };

  const refresh = async () => {
    setLoading(true);
    setError("");
    handleError(await getUserData(setUserData));
    if (!error) {
      handleError(await getUserPlans(setPlans));
    }
    setLoading(false);
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
                {error && userData.id === 0.1 && (
                  <Alert key="warning" variant="warning">
                    {error}
                  </Alert>
                )}
                {isLoading && <div className="spinner-border my-3"></div>}
                {getToken() && (
                  <UserDataContainer
                    updateUser={handleUpdateUser}
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
                    addNewPlan={handleCreatePlan}
                    onDelete={handleDeletePlan}
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
