import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import planTypes from "../plantypes";
import { newPlan } from "../interfaces";

const schema = z.object({
  type: z.enum(planTypes, {
    errorMap: () => ({ message: "Category is required" }),
  }),
});

type newPlanFormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: newPlan) => void;
  cancel: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewPlanForm = ({ onSubmit, cancel }: Props) => {
  const [selectedType, setSelectedType] = useState("");
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
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
  } = useForm<newPlanFormData>({ resolver: zodResolver(schema) });

  const handleFormSubmit = (data: newPlanFormData) => {
    const newData: newPlan = {
      type: parseInt(data.type, 10), // Use parseInt to convert to a number
    };
    onSubmit(newData);
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
            defaultValue=""
          >
            <option value="" disabled>
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
        <button
          className="btn btn-outline-primary"
          disabled={selectedType === ""}
        >
          Submit
        </button>
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
