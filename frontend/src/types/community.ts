export type Community = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  member_count: number;
  is_member: boolean;
};
