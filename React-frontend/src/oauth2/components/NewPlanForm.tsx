import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import planTypes from "../plantypes";

const schema = z.object({
  type: z.enum(planTypes, {
    errorMap: () => ({ message: "Category is required" }),
  }),
});

type newPlanFormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: newPlanFormData) => void;
  cancel: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewPlanForm = ({ onSubmit, cancel }: Props) => {
  const handleTypeChange = () => {};
  const onCancel = () => {
    reset();
    cancel(false);
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<newPlanFormData>({ resolver: zodResolver(schema) });

  const handleFormSubmit = (data: newPlanFormData) => {
    onSubmit(data);
    reset();
  };
  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">
            Type of Plan
          </label>
          <select
            {...register("type")}
            id="type"
            className="form-select"
            onChange={handleTypeChange}
          >
            <option value="" disabled selected>
              Select a Plan Type
            </option>
            {planTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.type && <p className="text-danger">{errors.type.message}</p>}
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
      <br />
    </>
  );
};

export default NewPlanForm;
