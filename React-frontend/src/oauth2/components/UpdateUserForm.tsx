import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z
    .union([z.string().length(0), z.string().min(3).max(50)])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  forename: z
    .union([z.string().length(0), z.string().min(2).max(50)])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  surname: z
    .union([z.string().length(0), z.string().min(2).max(50)])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  disabled: z.boolean().default(false).optional(),
});

type userFormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: userFormData) => void;
  cancel: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateUserForm = ({ onSubmit, cancel }: Props) => {
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);

  const handleLogoutWarning = (event: any) => {
    if (event.target.value.trim() !== "") {
      setShowLogoutWarning(true);
    } else {
      setShowLogoutWarning(false);
    }
  };
  const onCancel = () => {
    reset();
    cancel(false);
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<userFormData>({ resolver: zodResolver(schema) });

  const handleFormSubmit = (data: userFormData) => {
    onSubmit(data);
    reset();
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
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
          onChange={handleLogoutWarning} // Add onChange event handler
        />
        {errors.email && <p className="text-danger">{errors.email.message}</p>}
      </div>
      {showLogoutWarning && (
        <div className="alert alert-warning">
          Warning: Changing your email will log you out.
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="forename" className="form-label">
          Forename
        </label>
        <input
          {...register("forename")}
          id="forename"
          type="text"
          placeholder="John"
          className="form-control"
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
          placeholder="Smith"
          className="form-control"
        />
        {errors.surname && (
          <p className="text-danger">{errors.surname.message}</p>
        )}
      </div>
      <div className="mb-3 form-check">
        <input
          {...register("disabled")}
          id="disabled"
          type="checkbox"
          className="form-check-input"
        />
        <label htmlFor="disabled" className="form-check-label">
          Deactivate Account?
        </label>
      </div>
      <button className="btn btn-outline-primary">Submit</button>
      <button
        className="btn btn-outline-danger mx-2"
        type="button"
        onClick={onCancel}
      >
        Cancel
      </button>
    </form>
  );
};

export default UpdateUserForm;
