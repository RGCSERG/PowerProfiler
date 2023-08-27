import { Card, Container, Row, Col } from "react-bootstrap";
import { signUpFormData } from "../interfaces";
import { Link } from "react-router-dom";
import SignUpForm from "./SignUpForm";

interface Props {
  onSubmit: (data: signUpFormData) => void;
}

const SignUpFormPlaceHolder = ({ onSubmit }: Props) => {
  return (
    <div>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <div className="border border-3 border-primary"></div>
            <Card className="shadow">
              <Card.Body>
                <div className="mb-3 mt-md-4 d-flex align-items-center justify-content-between">
                  <h2 className="fw-bold mb-2 text-uppercase">
                    Power Profiler
                  </h2>
                  <img src="/logo.svg" alt="Logo" className="logo-img" />
                </div>
                <p className="mb-4">Please enter your preferred credentials!</p>
                <SignUpForm onSubmit={onSubmit} />
                <div className="mt-3">
                  <p className="mb-0 text-center">
                    Already have an account?{" "}
                    <Link to="/" className="text-primary fw-bold">
                      Login
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUpFormPlaceHolder;
