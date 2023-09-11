import { Accordion, ListGroup } from "react-bootstrap";
import { SubClass } from "../interfaces";
import AppliancePlaceholder from "./AppliancePlaceholder";

interface Props {
  subClasses: SubClass[];
}

const PlanSubClassPlaceholder = ({ subClasses }: Props) => {
  return (
    <>
      {subClasses &&
        subClasses.map((subClass) => {
          <Accordion defaultActiveKey="0">
            <br />
            <Accordion.Item eventKey="1">
              <Accordion.Header>{subClass.name}</Accordion.Header>
              <Accordion.Body>
                <ListGroup>
                  <ListGroup.Item>
                    Date Created: {subClass.date_created}
                  </ListGroup.Item>
                </ListGroup>
                <br />
                Appliances:
                {subClass.appliances && (
                  <AppliancePlaceholder appliances={subClass.appliances} />
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>;
        })}
    </>
  );
};

export default PlanSubClassPlaceholder;
