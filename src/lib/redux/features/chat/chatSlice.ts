import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage } from '@/types/chat';

// Define TypingEvent and OnlineStatusEvent locally
interface TypingEvent {
  chatId: string;
  userId: string;
  isTyping: boolean;
}

interface OnlineStatusEvent {
  userId: string;
  isOnline: boolean;
}

interface ChatState {
  activeChatId: string | null;
  typingUsers: Record<string, string[]>; // chatId -> userIds[]
  onlineUsers: Record<string, boolean>; // userId -> isOnline
  unreadCounts: Record<string, number>; // chatId -> count
}

const initialState: ChatState = {
  activeChatId: null,
  typingUsers: {},
  onlineUsers: {},
  unreadCounts: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<string | null>) => {
      state.activeChatId = action.payload;
      // Clear unread count when opening a chat
      if (action.payload) {
        state.unreadCounts[action.payload] = 0;
      }
    },
    setTypingStatus: (state, action: PayloadAction<TypingEvent>) => {
      const { chatId, userId, isTyping } = action.payload;
      if (isTyping) {
        if (!state.typingUsers[chatId]) {
          state.typingUsers[chatId] = [];
        }
        if (!state.typingUsers[chatId].includes(userId)) {
          state.typingUsers[chatId].push(userId);
        }
      } else {
        if (state.typingUsers[chatId]) {
          state.typingUsers[chatId] = state.typingUsers[chatId].filter(id => id !== userId);
        }
      }
    },
    setOnlineStatus: (state, action: PayloadAction<OnlineStatusEvent>) => {
      const { userId, isOnline } = action.payload;
      state.onlineUsers[userId] = isOnline;
    },
    incrementUnreadCount: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      if (state.activeChatId !== chatId) {
        state.unreadCounts[chatId] = (state.unreadCounts[chatId] || 0) + 1;
      }
    },
    clearUnreadCount: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      state.unreadCounts[chatId] = 0;
    },
    addMessage: (state, action: PayloadAction<{ chatId: string; message: ChatMessage }>) => {
      const { chatId } = action.payload;
      // Increment unread count if not the active chat
      if (state.activeChatId !== chatId) {
        state.unreadCounts[chatId] = (state.unreadCounts[chatId] || 0) + 1;
      }
    },
  },
});

export const {
  setActiveChat,
  setTypingStatus,
  setOnlineStatus,
  incrementUnreadCount,
  clearUnreadCount,
  addMessage,
} = chatSlice.actions;

export default chatSlice.reducer; 