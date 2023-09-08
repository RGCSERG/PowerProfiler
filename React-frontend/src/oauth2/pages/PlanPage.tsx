import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TotalPlanData } from "../interfaces";
import { baseTotalPlanDataModel } from "../constants";
import { getIndividualPlan } from "../HTTPRequests";

const PlanPage = () => {
  const { id } = useParams();

  const [individualPlan, setIndividualPLan] = useState<TotalPlanData>(
    baseTotalPlanDataModel
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleError = (requestError: any) => {
    if (typeof requestError === "string") {
      setError(requestError);
      setLoading(false); // Set loading to false to stop the spinner
      if (requestError !== "Network Error") {
        refresh();
      }
      return; // Return early to prevent further execution
    }
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
  useEffect(() => {}, []);

  return (
    <>
      <div>{id}</div>
      {individualPlan}
    </>
  );
};

export default PlanPage;
