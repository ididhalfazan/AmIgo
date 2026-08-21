export type ApiAuthor = {
  id: string;
  name: string;
};

export type ApiPost = {
  id: string;
  author: ApiAuthor;
  caption: string | null;
  type: string;
  created_at: string;
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
};

export type ApiFeedPage = {
  posts: ApiPost[];
  has_more: boolean;
};

export type PostAuthor = {
  id: string;
  name: string;
  avatarColor: string;
};

export type Post = {
  id: string;
  author: PostAuthor;
  caption: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
};
