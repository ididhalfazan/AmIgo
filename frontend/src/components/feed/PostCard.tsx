import { Post } from "@/types/post";
import { Avatar } from "./Avatar";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.5s-7.4-4.6-9.8-9.1C.7 8.2 2 4.9 5.2 4.1c2-.5 3.9.3 5.1 1.9l1.7 2.2 1.7-2.2c1.2-1.6 3.1-2.4 5.1-1.9 3.2.8 4.5 4.1 3 7.3-2.4 4.5-9.8 9.1-9.8 9.1Z"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5h16v10H9l-4 4v-4H4v-10Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 10.5 12 6l5 4.5M12 6.5v11" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h12v16l-6-4-6 4V4Z" />
    </svg>
  );
}

type PostCardProps = {
  post: Post;
  onToggleLike: (postId: string) => void | Promise<void>;
};

export function PostCard({ post, onToggleLike }: PostCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-muted/30 p-5">
      <div className="flex items-center gap-3">
        <Avatar name={post.author.name} color={post.author.avatarColor} />
        <div>
          <p className="font-semibold leading-tight">{post.author.name}</p>
          <p className="text-xs text-muted-foreground">{post.createdAt}</p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6">{post.caption}</p>

      <div className="mt-4 flex items-center gap-5 text-muted-foreground">
        <button
          type="button"
          onClick={() => onToggleLike(post.id)}
          className={`flex items-center gap-1.5 text-sm transition hover:text-primary ${
            post.likedByMe ? "text-primary" : ""
          }`}
        >
          <HeartIcon filled={post.likedByMe} />
          {post.likeCount}
        </button>
        <button type="button" className="flex items-center gap-1.5 text-sm transition hover:text-foreground">
          <CommentIcon />
          {post.commentCount}
        </button>
        <button type="button" className="flex items-center gap-1.5 text-sm transition hover:text-foreground">
          <ShareIcon />
        </button>
        <button type="button" className="ml-auto flex items-center gap-1.5 text-sm transition hover:text-foreground">
          <BookmarkIcon />
        </button>
      </div>
    </article>
  );
}
