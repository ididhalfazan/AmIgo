export type Notification = {
  id: string;
  type: "reminder" | "community_summary" | "daily_summary";
  payload: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
};
