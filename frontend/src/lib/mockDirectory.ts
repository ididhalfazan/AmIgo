/**
 * Placeholder directory data for Friends and Events — there's no follow/
 * friend-request backend or events model yet (see plan.md's roadmap).
 * Communities are real (fetched from /api/communities); these two are mock
 * so the Search overlay and Friends page are demoable in the meantime.
 */

export type MockFriend = {
  id: string;
  name: string;
  avatarColor: string;
  mutual: string;
};

export const MOCK_FRIENDS: MockFriend[] = [
  { id: "maya", name: "Maya Chen", avatarColor: "#7c8a5c", mutual: "3 mutual communities" },
  { id: "alex", name: "Alex Rivera", avatarColor: "#a0785a", mutual: "1 mutual community" },
  { id: "ethan", name: "Ethan Brooks", avatarColor: "#8a6d4f", mutual: "5 mutual communities" },
  { id: "sara", name: "Sara Malik", avatarColor: "#6b7a8f", mutual: "2 mutual communities" },
];

export type MockEvent = {
  id: string;
  name: string;
  date: string;
  location: string;
};

export const MOCK_EVENTS: MockEvent[] = [
  { id: "trail-cleanup", name: "Trail Cleanup Day", date: "Sat, Aug 15", location: "Ridgeline Park" },
  { id: "potluck", name: "Community Potluck", date: "Sun, Aug 23", location: "Maya's place" },
  { id: "photo-walk", name: "Photography Workshop", date: "Fri, Aug 28", location: "Downtown" },
];
