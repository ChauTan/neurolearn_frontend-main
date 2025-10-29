export interface ChatMessage {
  _id: string;
  sender: string;
  content: string;
  timestamp: string;
  replyTo?: ChatMessage; // Message được reply
  reactions?: MessageReaction[]; // Reactions của message
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  timestamp: Date; // Thay đổi từ string sang Date để đồng bộ với firestore
}

export interface ChatMember {
  _id: string;
  name: string;
  avatar?: {
    url: string;
  };
  role?: string;
}

export interface Chat {
  _id: string;
  members: ChatMember[];
  isGroup: boolean;
  groupName?: string;
  lastMessage?: ChatMessage;
  updatedAt: string;
}

export interface CreateChatRequest {
  members: string[];
  isGroup: boolean;
  groupName?: string;
}

export interface SendMessageRequest {
  sender: string;
  content: string;
}

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    url?: string;
  };
}

export interface ChatListResponse {
  success: boolean;
  chats: Chat[];
}

export interface ChatDetailResponse {
  success: boolean;
  chat: Chat;
}

export interface CreateChatResponse {
  success: boolean;
  chat: Chat;
}

export interface SendMessageResponse {
  success: boolean;
  message: ChatMessage;
}

export interface UsersResponse {
  success: boolean;
  users: UserInfo[];
}

export interface UserInfoResponse {
  success: boolean;
  user: UserInfo;
} 