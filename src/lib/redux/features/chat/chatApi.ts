import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  Chat,
  ChatMessage,
  CreateChatRequest,
  SendMessageRequest,
  SendMessageResponse,
  UsersResponse,
  UserInfo,
  UserInfoResponse,
} from '@/types/chat';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
    credentials: 'include',
  }),
  tagTypes: ['Chat', 'ChatList', 'Users'],
  endpoints: (builder) => ({
    // Get user's chat list
    getUserChats: builder.query<Chat[], string>({
      query: (userId) => {
        console.log('Calling getUserChats with userId:', userId);
        return `chats/user/${userId}`;
      },
      transformResponse: (response: { success?: boolean; chats?: Chat[] } | Chat[]) => {
        console.log('getUserChats response:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', Object.keys(response || {}));
        // Handle both formats: {success: true, chats: [...]} and direct array
        if (!Array.isArray(response) && response.success && response.chats) {
          return response.chats || [];
        } else if (Array.isArray(response)) {
          // Direct array format
          return response;
        }
        return [];
      },
      providesTags: ['ChatList'],
    }),

    // Get chat detail
    getChatDetail: builder.query<Chat, string>({
      query: (chatId) => `chats/${chatId}`,
      transformResponse: (response: { success?: boolean; chat?: Chat } | Chat) => {
        console.log('getChatDetail response:', response);
        // Handle both formats: {success: true, chat: {...}} and direct chat object
        if (!('isGroup' in response) && response.success && response.chat) {
          return response.chat;
        } else if ('_id' in response) {
          // Direct chat object format
          return response;
        }
        // Nếu không đúng định dạng, trả về một object mặc định hoặc throw error
        throw new Error('Invalid chat detail response');
      },
      providesTags: (result, error, chatId) => [{ type: 'Chat', id: chatId }],
    }),

    // Create new chat
    createChat: builder.mutation<Chat, CreateChatRequest>({
      query: (chatData) => ({
        url: 'chats',
        method: 'POST',
        body: chatData,
      }),
      transformResponse: (response: { success?: boolean; chat?: Chat } | Chat) => {
        console.log('createChat response:', response);
        // Handle both formats: {success: true, chat: {...}} and direct chat object
        if (!('isGroup' in response) && response.success && response.chat) {
          return response.chat;
        } else if ('_id' in response) {
          // Direct chat object format
          return response;
        }
        throw new Error('Invalid create chat response');
      },
      invalidatesTags: ['ChatList'],
    }),

    // Send message
    sendMessage: builder.mutation<ChatMessage, { chatId: string; messageData: SendMessageRequest }>({
      query: ({ chatId, messageData }) => ({
        url: `chats/${chatId}/message`,
        method: 'POST',
        body: messageData,
      }),
      transformResponse: (response: SendMessageResponse) => {
        console.log('sendMessage response:', response);
        return response.message;
      },
      invalidatesTags: (result, error, { chatId }) => [
        { type: 'Chat', id: chatId },
        'ChatList',
      ],
    }),

    // Get all users for creating chat
    getAllUsers: builder.query<UserInfo[], void>({
      query: () => 'chats/users',
      transformResponse: (response: UsersResponse) => {
        console.log('getAllUsers response:', response);
        return response.users || [];
      },
      providesTags: ['Users'],
    }),

    // Get user info for chat
    getUserInfo: builder.query<UserInfo, string>({
      query: (userId) => `chats/user-info/${userId}`,
      transformResponse: (response: UserInfoResponse) => {
        console.log('getUserInfo response:', response);
        return response.user;
      },
    }),
  }),
});

export const {
  useGetUserChatsQuery,
  useGetChatDetailQuery,
  useCreateChatMutation,
  useSendMessageMutation,
  useGetAllUsersQuery,
  useGetUserInfoQuery,
} = chatApi; 