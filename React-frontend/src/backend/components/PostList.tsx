import { Post } from "../interfaces";

interface Props {
  posts: Post[];
  error: string;
  isLoading: boolean;
  onDelete: (post: Post) => void;
}

const PostList = ({ posts, error, isLoading, onDelete }: Props) => {
  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      {isLoading && <div className="spinner-border"></div>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>content</th>
            <th>created at</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id}>
              <td>{post.title}</td>
              <td>{post.content}</td>
              <td>{post.created_at}</td>
              <td>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => onDelete(post)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>{posts.length}</td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </>
  );
};

export default PostList;
