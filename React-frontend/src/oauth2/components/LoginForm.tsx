import { useForm } from "react-hook-form"; // @7.43
import { z } from "zod"; // @3.20.6
import { zodResolver } from "@hookform/resolvers/zod"; // @2.9.11
import { Link } from "react-router-dom";

const schema = z.object({
  email: z.string().min(5).max(50),
  password: z.string().min(3).max(500),
});

type LoginFormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: LoginFormData) => void;
}

const LoginForm = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
        reset();
      })}
    >
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
      <p className="small">
        <Link to="/" className="text-primary">
          Forgot password?
        </Link>
      </p>
      <div className="d-grid">
        <button className="btn btn-primary">Login</button>
      </div>
    </form>
  );
};

export default LoginForm;
