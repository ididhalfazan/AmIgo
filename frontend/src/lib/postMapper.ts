import { ApiPost, Post } from "@/types/post";

const AVATAR_COLORS = ["#c1703f", "#7c8a5c", "#a0785a", "#8a6d4f", "#6b7a8f"];

export function colorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function mapApiPost(apiPost: ApiPost): Post {
  return {
    id: apiPost.id,
    author: {
      id: apiPost.author.id,
      name: apiPost.author.name,
      avatarColor: colorForId(apiPost.author.id),
    },
    caption: apiPost.caption ?? "",
    createdAt: timeAgo(apiPost.created_at),
    likeCount: apiPost.like_count,
    commentCount: apiPost.comment_count,
    likedByMe: apiPost.liked_by_me,
  };
}
