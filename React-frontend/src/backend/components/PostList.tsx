import { Post } from "../interfaces";
import PostForm from "./PostForm";

interface Props {
  posts: Post[];
  error: string;
  isLoading: boolean;
  refresh: () => void;
  onUpdate: (post: Post) => void;
  onDelete: (post: Post) => void;
}

const PostList = ({
  posts,
  error,
  isLoading,
  refresh,
  onUpdate,
  onDelete,
}: Props) => {
  return (
    <>
      <ul className="list-group">
        <button
          className="btn btn-outline-secondary mx-1 my-1"
          onClick={refresh}
        >
          Refresh
        </button>
        {error && <p className="text-danger">{error}</p>}
        {isLoading && <div className="spinner-border"></div>}
        {posts.map((post) => (
          <li
            key={post._id}
            className="list-group-item d-flex justify-content-between"
          >
            <div>{post.title}</div>
            <div>
              <button
                className="btn btn-outline-secondary mx-1"
                onClick={() => onUpdate(post)}
                disabled={post._id === 0.1}
              >
                Update
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => onDelete(post)}
                disabled={post._id === 0.1}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default PostList;
