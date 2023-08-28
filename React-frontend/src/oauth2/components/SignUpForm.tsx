import { useForm } from "react-hook-form"; // @7.43
import { z } from "zod"; // @3.20.6
import { zodResolver } from "@hookform/resolvers/zod"; // @2.9.11
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";

const schema = z.object({
  forename: z.string().min(2).max(50),
  surname: z.string().min(2).max(50),
  email: z.string().min(5).max(50),
  password: z.string().min(3).max(500),
  reEnterPassword: z.string(),
});

type SignUpFormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: SignUpFormData) => void;
  error: string;
}

const SignUpForm = ({ onSubmit, error }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch, // Add the watch function to track the value of fields
  } = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
  });

  // Get the value of the "password" and "reEnterPassword" fields
  const passwordValue = watch("password");
  const reEnterPasswordValue = watch("reEnterPassword");

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
        reset();
      })}
    >
      <div className="mb-3">
        <label htmlFor="forename" className="form-label">
          Forename
        </label>
        <input
          {...register("forename")}
          id="forename"
          type="text"
          className="form-control"
          placeholder="John"
        />
        {errors.forename && (
          <p className="text-danger">{errors.forename.message}</p>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="surname" className="form-label">
          Surname
        </label>
        <input
          {...register("surname")}
          id="surname"
          type="text"
          className="form-control"
          placeholder="Smith"
        />
        {errors.surname && (
          <p className="text-danger">{errors.surname.message}</p>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          {...register("email")}
          id="email"
          type="text"
          className="form-control"
          placeholder="example@example.com"
        />
        {errors.email && <p className="text-danger">{errors.email.message}</p>}
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          {...register("password")}
          id="password"
          type="password"
          className="form-control"
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-danger">{errors.password.message}</p>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="reEnterPassword" className="form-label">
          Re-enter Password
        </label>
        <input
          {...register("reEnterPassword")}
          id="reEnterPassword"
          type="password"
          className="form-control"
          placeholder="Re-enter your password"
        />
        {errors.reEnterPassword && (
          <p className="text-danger">{errors.reEnterPassword.message}</p>
        )}
        {/* Show error if passwords do not match */}
        {passwordValue !== reEnterPasswordValue && (
          <p className="text-danger">Passwords do not match</p>
        )}
      </div>
      {error && (
        <Alert key="danger" variant="danger">
          {error}
        </Alert>
      )}
      <div className="d-grid">
        <button className="btn btn-primary">Sign Up</button>
      </div>
    </form>
  );
};

export default SignUpForm;
