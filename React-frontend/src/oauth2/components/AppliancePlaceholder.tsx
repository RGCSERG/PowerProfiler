import { Accordion, ListGroup } from "react-bootstrap";
import { Appliance } from "../interfaces";

interface Props {
  appliances: Appliance[];
}

const AppliancePlaceholder = ({ appliances }: Props) => {
  return (
    <>
      {appliances &&
        appliances.map((appliance) => (
          <Accordion defaultActiveKey="0">
            <br />
            <Accordion.Item eventKey="3">
              <Accordion.Header>{appliance.name}</Accordion.Header>
              <Accordion.Body>
                <ListGroup>
                  <ListGroup.Item>Data: {appliance.data}</ListGroup.Item>
                  <ListGroup.Item>
                    Date Created: {appliance.date_created}
                  </ListGroup.Item>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))}
    </>
  );
};

export default AppliancePlaceholder;
