import { useState } from "react";
import { Post, sendPost } from "../interfaces";
import PostForm from "./PostForm";
import UpdateForm from "./UpdateForm";

interface Props {
  posts: Post[];
  error: string;
  isLoading: boolean;
  refresh: () => void;
  onUpdate: (newPost: sendPost, post: Post) => void;
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
  const [updatePost, setUpdatePost] = useState(-1);

  return (
    <>
      <div className="card">
        <img src="..." className="card-img-top" alt="..." />

        <div className="card-body">
          <h5 className="card-title">Card title</h5>
          <p className="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
          <a href="#" className="btn btn-primary">
            Go somewhere
          </a>
        </div>
      </div>

      <div className="card" aria-hidden="true">
        <img src="..." className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title placeholder-glow">
            <span className="placeholder col-6"></span>
          </h5>
          <p className="card-text placeholder-glow">
            <span className="placeholder col-7"></span>
            <span className="placeholder col-4"></span>
            <span className="placeholder col-4"></span>
            <span className="placeholder col-6"></span>
            <span className="placeholder col-8"></span>
          </p>
          <a className="btn btn-primary disabled placeholder col-6"></a>
        </div>
      </div>
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
            {updatePost === post._id && (
              <UpdateForm
                setUpdatePost={setUpdatePost}
                onSubmit={onUpdate}
                post={post}
              />
            )}
            <div>
              <button
                className="btn btn-outline-secondary mx-1"
                onClick={() => setUpdatePost(post._id)}
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
