// src/app/(auth)/dashboard/message/_components/types.ts

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role?: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string; // Có thể dùng kiểu Date, nhưng string đơn giản hơn cho ví dụ
  senderId: string; // 'me' hoặc ID của người khác
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: {
    text: string;
    timestamp: string;
  };
  unreadCount: number;
}
