export type ChatMessage = {
  id: string;
  fromMe: boolean;
  text: string;
};

export type Conversation = {
  id: string;
  name: string;
  avatarColor: string;
  lastMessage: string;
  unread: boolean;
  messages: ChatMessage[];
};
