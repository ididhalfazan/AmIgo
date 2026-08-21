export type User = {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  bio_is_public: boolean;
};
