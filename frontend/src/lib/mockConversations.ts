import { Conversation } from "@/types/chat";

/**
 * Placeholder conversation list so the friend-chat UI is demoable before
 * real friend-to-friend messaging exists on the backend. Design-only — see
 * plan.md's roadmap for direct messages between users. The Amigo Agent has
 * its own dedicated chat panel (components/chat/AgentChatWidget.tsx), not a
 * conversation in this list.
 */
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "maya",
    name: "Maya Chen",
    avatarColor: "#7c8a5c",
    lastMessage: "Sunset hike this weekend?",
    unread: true,
    messages: [
      { id: "m1", fromMe: false, text: "Hey! Are you free this weekend?" },
      { id: "m2", fromMe: false, text: "Thinking of doing the sunset hike again 🌄" },
    ],
  },
  {
    id: "alex",
    name: "Alex Rivera",
    avatarColor: "#a0785a",
    lastMessage: "Sent you the trail photos!",
    unread: true,
    messages: [{ id: "a1", fromMe: false, text: "Sent you the trail photos from Saturday!" }],
  },
  {
    id: "ethan",
    name: "Ethan Brooks",
    avatarColor: "#8a6d4f",
    lastMessage: "You: sounds good, see you then",
    unread: false,
    messages: [
      { id: "e1", fromMe: false, text: "Want to grab coffee before the community meetup?" },
      { id: "e2", fromMe: true, text: "Sounds good, see you then" },
    ],
  },
];
