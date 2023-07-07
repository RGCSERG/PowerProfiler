import { useForm } from "react-hook-form"; // @7.43
import { z } from "zod"; // @3.20.6
import { zodResolver } from "@hookform/resolvers/zod"; // @2.9.11

const schema = z.object({
  email: z.string().min(3).max(50),
  password: z.string().min(3).max(500),
});

type TokenFormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: TokenFormData) => void;
}

const TokenForm = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TokenFormData>({
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
          type="text"
          className="form-control"
        />
        {errors.password && (
          <p className="text-danger">{errors.password.message}</p>
        )}
      </div>
      <button className="btn btn-primary">Submit</button>
    </form>
  );
};

export default TokenForm;
