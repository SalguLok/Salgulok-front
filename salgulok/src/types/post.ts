export type Post = {
  id: number;
  user: string;
  date: string;
  location: string;
  avatar: string;
  content: string;
  comments: number;
  isHot?: boolean;
  topic?: string;
};

export type Comment = {
  id: number;
  postId: number;
  user: string;
  date: string;
  avatar: string;
  content: string;
};