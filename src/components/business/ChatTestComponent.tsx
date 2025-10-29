'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { sendMessage, subscribeToMessages } from '@/lib/firestore/chat';
import { Button } from '@/components/common/ui/Button2';
import { Send, MessageCircle, Loader2 } from 'lucide-react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

interface ChatTestComponentProps {
  businessId: string;
}

const ChatTestComponent: React.FC<ChatTestComponentProps> = ({ businessId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const { user: firebaseUser, signInAnonymouslyIfNeeded } = useFirebaseAuth();

  // Tìm business group chat
  useEffect(() => {
    const findBusinessGroupChat = async () => {
      if (!businessId) return;

      try {
        setIsLoading(true);
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebaseClient');

        const chatRoomsRef = collection(db, 'chatRooms');
        const q = query(
          chatRoomsRef,
          where('businessId', '==', businessId),
          where('isGroup', '==', true)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const chatRoom = querySnapshot.docs[0];
          setChatRoomId(chatRoom.id);
          console.log('Found business group chat:', chatRoom.id);
        } else {
          console.log('No business group chat found');
        }
      } catch (error) {
        console.error('Error finding business group chat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    findBusinessGroupChat();
  }, [businessId]);

  // Subscribe to messages
  useEffect(() => {
    if (!chatRoomId) return;

    const unsubscribe = subscribeToMessages(chatRoomId, (newMessages) => {
      setMessages(newMessages);
    });

    return unsubscribe;
  }, [chatRoomId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !chatRoomId || !user?._id) return;

    try {
      setIsSending(true);
      
      // Đảm bảo có mock user cho Firestore
      if (!firebaseUser) {
        await signInAnonymouslyIfNeeded();
      }

      await sendMessage(
        chatRoomId,
        user._id,
        'system',
        message,
        'text',
        undefined,
        {
          name: user.name || 'User',
          email: user.email || '',
          // Không include avatar nếu null
        }
      );
      setMessage('');
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading chat...</span>
        </div>
      </div>
    );
  }

  if (!chatRoomId) {
    return (
      <div className="bg-white rounded-lg border p-4">
        <div className="text-center text-gray-500">
          <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No business group chat found</p>
          <p className="text-sm">Please ensure the group chat is created first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Chat Test</h3>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Chat Room: {chatRoomId.slice(-8)}</span>
        </div>
      </div>

      {/* Messages Display */}
      <div className="h-64 overflow-y-auto border rounded-lg p-3 bg-gray-50 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No messages yet</p>
            <p className="text-sm">Send a message to get started</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={msg.id || index} className="bg-white p-2 rounded border">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-600">
                  {msg.senderInfo?.name || msg.senderId}
                </span>
                <span className="text-xs text-gray-400">
                  {msg.timestamp?.toDate?.()?.toLocaleTimeString() || 'Unknown time'}
                </span>
              </div>
              <p className="text-sm">{msg.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSending}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || isSending}
          className="flex items-center gap-2"
        >
          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send
        </Button>
      </div>

      {/* Status Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <div><strong>Messages:</strong> {messages.length}</div>
        <div><strong>User:</strong> {user?.name || 'Unknown'}</div>
        <div><strong>Firebase User:</strong> {firebaseUser?.uid ? 'Mock User Ready' : 'Not ready'}</div>
        <div><strong>Mode:</strong> Firestore Only (No Auth)</div>
      </div>
    </div>
  );
};

export default ChatTestComponent; 