import { useForm } from "react-hook-form"; // @7.43
import { z } from "zod"; // @3.20.6
import { zodResolver } from "@hookform/resolvers/zod"; // @2.9.11
import { Post } from "../interfaces";

const schema = z.object({
  title: z.string().min(3).max(50),
  content: z.string().min(3).max(500),
});

type UpdateFormData = z.infer<typeof schema>;

interface Props {
  post: Post;
  setUpdatePost: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: (data: UpdateFormData, post: Post) => void;
}

const UpdateForm = ({ onSubmit, post, setUpdatePost }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateFormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        setUpdatePost(-1);
        onSubmit(data, post);
        reset();
      })}
    >
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          {...register("title")}
          id="title"
          type="text"
          className="form-control"
        />
        {errors.title && <p className="text-danger">{errors.title.message}</p>}
      </div>
      <div className="mb-3">
        <label htmlFor="content" className="form-label">
          Content
        </label>
        <input
          {...register("content")}
          id="content"
          type="text"
          className="form-control"
        />
        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}
      </div>
      <button className="btn btn-primary">Update</button>
    </form>
  );
};

export default UpdateForm;
