import { Accordion, ListGroup } from "react-bootstrap";
import { TotalPlanData } from "../interfaces";
import SubClassPlaceholder from "./SubClassPlaceholder";

interface Props {
  plan: TotalPlanData;
}

const TotalPlanPlaceholder = ({ plan }: Props) => {
  return (
    <Accordion defaultActiveKey="0" key={plan.id}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Plan Data</Accordion.Header>
        <Accordion.Body>
          <ListGroup>
            <ListGroup.Item>Plan Type: {plan.type.data}</ListGroup.Item>
            <ListGroup.Item>Total Plan Cost: ${plan.total_cost}</ListGroup.Item>
            <ListGroup.Item>Total Users: {plan.users}</ListGroup.Item>
            <ListGroup.Item>Date Created: {plan.date_created}</ListGroup.Item>
          </ListGroup>
          <br />
          Users / Rooms:
          {plan.SubClasses && (
            <SubClassPlaceholder subClasses={plan.SubClasses} />
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default TotalPlanPlaceholder;
