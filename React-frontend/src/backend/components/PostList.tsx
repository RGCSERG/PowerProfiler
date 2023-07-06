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
