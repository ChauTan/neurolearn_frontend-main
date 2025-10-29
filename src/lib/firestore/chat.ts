import { db } from '@/lib/firebaseClient';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  writeBatch,
  Timestamp 
} from 'firebase/firestore';

// Helper function để tạo senderInfo an toàn
const createSafeSenderInfo = (senderInfo?: {
  name: string;
  email: string;
  avatar?: any;
}) => {
  if (!senderInfo) return undefined;
  
  const safeSenderInfo: any = {
    name: senderInfo.name || 'Unknown',
    email: senderInfo.email || '',
  };
  
  // Chỉ thêm avatar nếu nó không null/undefined
  if (senderInfo.avatar) {
    safeSenderInfo.avatar = senderInfo.avatar;
  }
  
  return safeSenderInfo;
};

export interface MessageReaction {
  userId: string;
  emoji: string;
  timestamp: Date; // Thay đổi từ Timestamp sang Date
}

export interface ChatMessage {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Timestamp;
  type?: 'text' | 'image' | 'file';
  read?: boolean;
  replyTo?: {
    messageId: string;
    content: string;
    senderId: string;
  };
  reactions?: MessageReaction[];
  senderInfo?: {
    name: string;
    email: string;
    avatar?: any;
  };
}

export interface ChatRoom {
  id?: string;
  participants: string[];
  participantUsers?: any[]; // Thông tin user được lưu trực tiếp
  lastMessage?: ChatMessage;
  lastMessageTime?: Timestamp;
  // Optional per-viewer display names for 1-1 rooms
  displayNameFor?: Record<string, string>;
  // Optional group fields
  isGroup?: boolean;
  groupName?: string;
  businessId?: string; // ID của business cho group chat
  createdAt: Timestamp;
}

// Tạo hoặc lấy chat room giữa 2 user
export const getOrCreateChatRoom = async (
  userId1: string,
  userId2: string,
  user1Name?: string,
  user2Name?: string,
): Promise<string> => {
  const chatRoomsRef = collection(db, 'chatRooms');
  // Tìm chat room đã tồn tại giữa đúng 2 user (không phải group)
  const q = query(
    chatRoomsRef,
    where('participants', 'array-contains', userId1),
    where('isGroup', '==', false)
  );
  const querySnapshot = await getDocs(q);
  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data() as ChatRoom & { isGroup?: boolean };
    // So sánh participants đúng 2 user, không quan tâm thứ tự, loại bỏ khoảng trắng và ép kiểu string
    const participants = (data.participants || []).map((id: any) => String(id).trim());
    if (
      Array.isArray(participants) &&
      participants.length === 2 &&
      participants.includes(String(userId2).trim()) &&
      participants.includes(String(userId1).trim())
    ) {
      return docSnap.id;
    }
  }
  
  // Tạo chat room mới với thông tin user được lưu trực tiếp
  const newChatRoom: Omit<ChatRoom, 'id'> & { isGroup: boolean; participantUsers: any[] } = {
    participants: [String(userId1).trim(), String(userId2).trim()],
    participantUsers: [
      {
        _id: String(userId1).trim(),
        name: user1Name || `User ${String(userId1).slice(-4)}`,
        email: '',
        // Không include avatar nếu null
      },
      {
        _id: String(userId2).trim(),
        name: user2Name || `User ${String(userId2).slice(-4)}`,
        email: '',
        // Không include avatar nếu null
      }
    ],
    createdAt: serverTimestamp() as Timestamp,
    lastMessageTime: serverTimestamp() as Timestamp,
    isGroup: false,
    displayNameFor: {
      [String(userId1).trim()]: user2Name || `User ${String(userId2).slice(-4)}`,
      [String(userId2).trim()]: user1Name || `User ${String(userId1).slice(-4)}`,
    },
  };
  const docRef = await addDoc(chatRoomsRef, newChatRoom);
  return docRef.id;
};

// Gửi tin nhắn với reply support
export const sendMessage = async (
  chatRoomId: string,
  senderId: string,
  receiverId: string,
  content: string,
  type: 'text' | 'image' | 'file' = 'text',
  replyTo?: {
    messageId: string;
    content: string;
    senderId: string;
  },
  senderInfo?: {
    name: string;
    email: string;
    avatar?: any;
  }
): Promise<string> => {
  const messagesRef = collection(db, `chatRooms/${chatRoomId}/messages`);

  // Tạo message object, chỉ include replyTo nếu nó không undefined
  const messageData: any = {
    senderId,
    receiverId,
    content,
    timestamp: serverTimestamp() as Timestamp,
    type,
    read: false,
    reactions: [],
  };

  // Chỉ thêm replyTo nếu nó được cung cấp
  if (replyTo) {
    messageData.replyTo = replyTo;
  }

  // Chỉ thêm senderInfo nếu nó được cung cấp
  if (senderInfo) {
    messageData.senderInfo = createSafeSenderInfo(senderInfo);
  }

  const docRef = await addDoc(messagesRef, messageData);

  // Cập nhật last message trong chat room
  const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
  await updateDoc(chatRoomRef, {
    lastMessage: messageData,
    lastMessageTime: messageData.timestamp,
  });

  return docRef.id;
};

// Thêm reaction vào tin nhắn
export const addReaction = async (
  chatRoomId: string,
  messageId: string,
  userId: string,
  emoji: string
): Promise<void> => {
  const messageRef = doc(db, `chatRooms/${chatRoomId}/messages`, messageId);
  
  // Lấy tin nhắn hiện tại
  const messageSnap = await getDoc(messageRef);
  const messageData = messageSnap.data() as ChatMessage;
  
  if (messageData) {
    const currentReactions = messageData.reactions || [];
    
    // Kiểm tra xem user đã reaction emoji này chưa
    const existingReactionIndex = currentReactions.findIndex(
      reaction => reaction.userId === userId && reaction.emoji === emoji
    );
    
    if (existingReactionIndex === -1) {
      // Thêm reaction mới - sử dụng new Date() thay vì serverTimestamp() để tránh lỗi
      const newReaction: MessageReaction = {
        userId,
        emoji,
        timestamp: new Date() as any, // Sử dụng client timestamp thay vì serverTimestamp
      };
      
      await updateDoc(messageRef, {
        reactions: [...currentReactions, newReaction],
      });
    }
  }
};

// Xóa reaction khỏi tin nhắn
export const removeReaction = async (
  chatRoomId: string,
  messageId: string,
  userId: string,
  emoji: string
): Promise<void> => {
  const messageRef = doc(db, `chatRooms/${chatRoomId}/messages`, messageId);
  
  // Lấy tin nhắn hiện tại để tìm reaction cần xóa
  const messageSnap = await getDoc(messageRef);
  const messageData = messageSnap.data() as ChatMessage;
  
  if (messageData?.reactions) {
    const updatedReactions = messageData.reactions.filter(
      reaction => !(reaction.userId === userId && reaction.emoji === emoji)
    );
    
    await updateDoc(messageRef, {
      reactions: updatedReactions,
    });
  }
};

// Lấy tin nhắn của một chat room
export const getMessages = async (chatRoomId: string): Promise<ChatMessage[]> => {
  const messagesRef = collection(db, `chatRooms/${chatRoomId}/messages`);
  const q = query(messagesRef, orderBy('timestamp', 'asc'));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as ChatMessage[];
};

// Real-time listener cho tin nhắn
export const subscribeToMessages = (
  chatRoomId: string,
  callback: (messages: ChatMessage[]) => void
) => {
  const messagesRef = collection(db, `chatRooms/${chatRoomId}/messages`);
  const q = query(messagesRef, orderBy('timestamp', 'asc'));

  return onSnapshot(q, querySnapshot => {
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ChatMessage[];
    callback(messages);
  }, (error) => {
    console.error('subscribeToMessages error for chatRoomId:', chatRoomId, error);
  });
};

// Lấy danh sách chat rooms của user
export const getUserChatRooms = async (userId: string): Promise<ChatRoom[]> => {
  const chatRoomsRef = collection(db, 'chatRooms');
  const q = query(
    chatRoomsRef,
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTime', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as ChatRoom[];
};

// Real-time listener cho chat rooms
export const subscribeToChatRooms = (userId: string, callback: (chatRooms: ChatRoom[]) => void) => {
  const chatRoomsRef = collection(db, 'chatRooms');
  const q = query(
    chatRoomsRef,
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTime', 'desc')
  );

  return onSnapshot(q, querySnapshot => {
    const chatRooms = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ChatRoom[];
    callback(chatRooms);
  });
};

// Đánh dấu tin nhắn đã đọc
export const markMessageAsRead = async (chatRoomId: string, messageId: string) => {
  const messageRef = doc(db, `chatRooms/${chatRoomId}/messages`, messageId);
  await updateDoc(messageRef, { read: true });
};

// Xóa tin nhắn
export const deleteMessage = async (chatRoomId: string, messageId: string) => {
  const messageRef = doc(db, `chatRooms/${chatRoomId}/messages`, messageId);
  await deleteDoc(messageRef);
};

// Group management functions

// Cập nhật tên group chat
export const updateGroupName = async (chatRoomId: string, newName: string): Promise<void> => {
  const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
  await updateDoc(chatRoomRef, { 
    groupName: newName, // Sử dụng groupName thay vì name
    updatedAt: serverTimestamp() as Timestamp
  });
};

// Thêm thành viên vào group chat
export const addMembersToGroup = async (
  chatRoomId: string,
  memberIds: string[],
  memberInfos?: Array<{ _id: string; name?: string; email?: string; avatar?: any }>
): Promise<void> => {
  const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
  
  // Lấy thông tin chat room hiện tại
  const chatRoomSnap = await getDoc(chatRoomRef);
  const chatRoomData = chatRoomSnap.data();
  
  if (!chatRoomData) {
    throw new Error('Chat room not found');
  }
  
  // Thêm members mới vào participants
  const currentParticipants = chatRoomData.participants || [];
  const newParticipants = [...new Set([...currentParticipants, ...memberIds])];
  
  // Cập nhật participantUsers với tên/email để hiển thị đầy đủ
  const currentParticipantUsers = chatRoomData.participantUsers || [];
  const existingIds = new Set<string>((currentParticipantUsers || []).map((u: any) => String(u._id)));
  const infoById: Record<string, { _id: string; name?: string; email?: string; avatar?: any }> = {};
  (memberInfos || []).forEach(info => { infoById[String(info._id)] = info; });
  const usersToAppend = memberIds
    .filter(id => !existingIds.has(String(id)))
    .map(id => {
      const info = infoById[String(id)] || { _id: String(id) } as any;
      return {
        _id: String(id),
        name: info.name || `User ${String(id).slice(-4)}`,
        email: info.email || '',
        avatar: info.avatar || null,
      };
    });
  
  await updateDoc(chatRoomRef, {
    participants: newParticipants,
    participantUsers: [...currentParticipantUsers, ...usersToAppend],
    updatedAt: serverTimestamp() as Timestamp
  });
};

// Xóa thành viên khỏi group chat
export const removeMemberFromGroup = async (chatRoomId: string, memberId: string): Promise<void> => {
  const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
  
  // Lấy thông tin chat room hiện tại
  const chatRoomSnap = await getDoc(chatRoomRef);
  const chatRoomData = chatRoomSnap.data();
  
  if (!chatRoomData) {
    throw new Error('Chat room not found');
  }
  
  // Xóa member khỏi participants
  const currentParticipants = chatRoomData.participants || [];
  const updatedParticipants = currentParticipants.filter((id: string) => id !== memberId);
  
  // Kiểm tra xem có còn đủ 2 người không (minimum cho group)
  if (updatedParticipants.length < 2) {
    throw new Error('Group must have at least 2 members');
  }
  
  await updateDoc(chatRoomRef, {
    participants: updatedParticipants,
    updatedAt: serverTimestamp() as Timestamp
  });
};

// Backfill displayNameFor for existing rooms
export const backfillDisplayNames = async (userId: string, userNames: Record<string, string>) => {
  const chatRoomsRef = collection(db, 'chatRooms');
  const q = query(
    chatRoomsRef,
    where('participants', 'array-contains', userId)
  );
  
  const querySnapshot = await getDocs(q);
  const batch = writeBatch(db);
  
  querySnapshot.docs.forEach(doc => {
    const roomData = doc.data();
    if (!roomData.displayNameFor) {
      const displayNameFor: Record<string, string> = {};
      
      roomData.participants.forEach((participantId: string) => {
        if (participantId !== userId) {
          displayNameFor[participantId] = userNames[participantId] || `User ${participantId.slice(-4)}`;
        }
      });
      
      batch.update(doc.ref, { displayNameFor });
    }
  });
  
  await batch.commit();
};

// Business group chat management functions

// Tạo hoặc lấy business group chat
export const getOrCreateBusinessGroupChat = async (
  businessId: string,
  businessName: string,
  adminId: string,
  employeeIds: string[],
  employeeNames: Record<string, string> = {}
): Promise<string> => {
  const chatRoomsRef = collection(db, 'chatRooms');
  
  // Tìm business group chat đã tồn tại
  const q = query(
    chatRoomsRef,
    where('businessId', '==', businessId),
    where('isGroup', '==', true)
  );
  
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    // Nếu đã có business group chat, cập nhật participants nếu cần
    const existingChat = querySnapshot.docs[0];
    const existingData = existingChat.data() as ChatRoom;
    const currentParticipants = existingData.participants || [];
    
    // Thêm employee mới nếu chưa có
    const newParticipants = [...new Set([...currentParticipants, ...employeeIds])];
    
    if (newParticipants.length !== currentParticipants.length) {
      await updateDoc(existingChat.ref, {
        participants: newParticipants,
        updatedAt: serverTimestamp() as Timestamp
      });
    }
    
    return existingChat.id;
  }
  
  // Tạo business group chat mới
  const allParticipants = [adminId, ...employeeIds];
  const participantUsers = allParticipants.map(id => ({
    _id: id,
    name: employeeNames[id] || `User ${id.slice(-4)}`,
    email: '',
    // Không include avatar nếu null
  }));
  
  const newBusinessGroupChat: Omit<ChatRoom, 'id'> & { 
    isGroup: boolean; 
    participantUsers: any[];
    businessId: string;
  } = {
    participants: allParticipants,
    participantUsers,
    createdAt: serverTimestamp() as Timestamp,
    lastMessageTime: serverTimestamp() as Timestamp,
    isGroup: true,
    groupName: `${businessName} Team`,
    businessId: businessId,
    displayNameFor: {}
  };
  
  const docRef = await addDoc(chatRoomsRef, newBusinessGroupChat);
  
  // Tạo tin nhắn chào mừng cho business group chat
  try {
    const welcomeMessage: Omit<ChatMessage, 'id'> = {
      senderId: adminId,
      receiverId: 'system',
      content: `Chào mừng đến với ${businessName} Team! Đây là nơi để team trao đổi và cộng tác.`,
      timestamp: serverTimestamp() as Timestamp,
      type: 'text',
      read: false,
      reactions: [],
      senderInfo: {
        name: 'System',
        email: '',
        // Không include avatar nếu null
      }
    };
    
    const messagesRef = collection(db, `chatRooms/${docRef.id}/messages`);
    await addDoc(messagesRef, welcomeMessage);
    
    // Cập nhật last message
    await updateDoc(docRef, {
      lastMessage: welcomeMessage,
      lastMessageTime: welcomeMessage.timestamp,
    });
  } catch (error) {
    console.error('Error creating welcome message:', error);
  }
  
  return docRef.id;
};

// Thêm employee vào business group chat
export const addEmployeeToBusinessGroupChat = async (
  businessId: string,
  employeeId: string,
  employeeName: string
): Promise<void> => {
  const chatRoomsRef = collection(db, 'chatRooms');
  
  // Tìm business group chat
  const q = query(
    chatRoomsRef,
    where('businessId', '==', businessId),
    where('isGroup', '==', true)
  );
  
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const chatRoom = querySnapshot.docs[0];
    const chatData = chatRoom.data() as ChatRoom;
    
    console.log('Found existing business group chat:', chatRoom.id);
    console.log('Current participants:', chatData.participants);
    console.log('Adding employee:', employeeId);
    
    // Kiểm tra xem employee đã có trong chat chưa
    if (!chatData.participants?.includes(employeeId)) {
      const currentParticipants = chatData.participants || [];
      const currentParticipantUsers = chatData.participantUsers || [];
      
      // Thêm employee mới
      const newParticipants = [...currentParticipants, employeeId];
      const newParticipantUsers = [
        ...currentParticipantUsers,
        {
          _id: employeeId,
          name: employeeName,
          email: '',
          // Không include avatar nếu null
        }
      ];
      
      console.log('Updating participants:', newParticipants);
      
      await updateDoc(chatRoom.ref, {
        participants: newParticipants,
        participantUsers: newParticipantUsers,
        updatedAt: serverTimestamp() as Timestamp
      });
      
      // Tạo tin nhắn thông báo employee mới được thêm vào
      try {
        const notificationMessage: Omit<ChatMessage, 'id'> = {
          senderId: 'system',
          receiverId: 'system',
          content: `${employeeName} đã được thêm vào team.`,
          timestamp: serverTimestamp() as Timestamp,
          type: 'text',
          read: false,
          reactions: [],
          senderInfo: {
            name: 'System',
            email: '',
            // Không include avatar nếu null
          }
        };
        
        const messagesRef = collection(db, `chatRooms/${chatRoom.id}/messages`);
        await addDoc(messagesRef, notificationMessage);
        
        // Cập nhật last message
        await updateDoc(chatRoom.ref, {
          lastMessage: notificationMessage,
          lastMessageTime: notificationMessage.timestamp,
        });
        
        console.log('Successfully added employee to group chat and created notification message');
      } catch (error) {
        console.error('Error creating notification message:', error);
      }
    } else {
      console.log('Employee already exists in group chat');
    }
  } else {
    console.log('Business group chat not found for businessId:', businessId);
    throw new Error('Business group chat not found. Please ensure the group chat is created first.');
  }
};
