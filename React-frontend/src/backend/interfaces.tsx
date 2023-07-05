export interface Post {
  _id: number;
  title: string;
  content: string;
  created_at: string;
}

export interface sendPost {
  title: string;
  content: string;
}
