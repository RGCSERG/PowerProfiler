import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { TotalPlanData } from "../interfaces";
import { BASE_TOTAL_PLAN_DATA_MODEL } from "../constants";
import { getIndividualPlan } from "../HTTPRequests";
import { getToken } from "../UserManagement";
import TotalPlanPlaceholder from "../components/TotalPlanPlaceholder";

interface Props {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const PlanPage = ({ error, setError }: Props) => {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [redirectToUser, setRedirectToUser] = useState(false);
  const [individualPlan, setIndividualPLan] = useState<TotalPlanData>(
    BASE_TOTAL_PLAN_DATA_MODEL
  );

  const handleError = (requestError: string | undefined) => {
    if (typeof requestError === "string") {
      setError(requestError);
      setLoading(false); // Set loading to false to stop the spinner
    }

    return; // Return early to prevent further execution
  };

  const refresh = async () => {
    setError("");
    setLoading(true);
    if (id !== undefined) {
      const numericId = parseInt(id);
      const userDataError = await getIndividualPlan(
        numericId,
        setIndividualPLan
      );
      handleError(userDataError);

      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = getToken();
    if (accessToken === undefined) {
      setRedirectToUser(true);
      return; // Exit the useEffect early
    }

    if (redirectToUser === false) {
      refresh();
    }
  }, [id]); // Include id as a dependency to trigger the effect when it changes

  if (redirectToUser) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {/* <div>ID: {id}</div>
      <div>{JSON.stringify(individualPlan, undefined, 2)}</div> */}
      <TotalPlanPlaceholder plan={individualPlan} />
    </>
  );
};

export default PlanPage;
