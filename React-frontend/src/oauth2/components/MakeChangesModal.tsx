import { Button, Modal } from "react-bootstrap";

interface Props {
  handleClose: () => void;
  handleChanges: () => void;
  title: string;
  body: string;
  successMessage: string;
  dangerMessage: string;
}

const MakeChangesModal = ({
  handleClose,
  handleChanges,
  title,
  body,
  successMessage,
  dangerMessage,
}: Props) => {
  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-success" onClick={handleClose}>
          {successMessage}
        </Button>
        <Button variant="outline-danger" onClick={handleChanges}>
          {dangerMessage}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MakeChangesModal;
