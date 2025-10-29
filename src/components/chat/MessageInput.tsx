import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, X } from 'lucide-react';
import { ChatMessage } from '@/types/chat';

interface MessageInputProps {
    onSendMessage: (content: string) => void;
    disabled?: boolean;
    replyTo?: ChatMessage | null;
    onCancelReply?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
    onSendMessage,
    disabled = false,
    replyTo,
    onCancelReply,
}) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const commonEmojis = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '😍', '😎', '🤔', '😢', '😡', '👏'];

    // Handle typing indicator
    useEffect(() => {
        if (message.length > 0 && !isTyping) {
            setIsTyping(true);
        } else if (message.length === 0 && isTyping) {
            setIsTyping(false);
        }
    }, [message, isTyping]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [message]);

    const handleSend = () => {
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage('');
            setIsTyping(false);

            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleEmojiClick = (emoji: string) => {
        setMessage(prev => prev + emoji);
        setShowEmojiPicker(false);
        textareaRef.current?.focus();
    };

    return (
        <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
            {/* Reply preview */}
            {replyTo && (
                <div className="mb-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="text-xs text-blue-600 mb-1">Replying to message</div>
                            <div className="text-sm text-gray-700 truncate">
                                {replyTo.content}
                            </div>
                        </div>
                        <button
                            onClick={onCancelReply}
                            className="p-1 hover:bg-blue-100 rounded transition-colors"
                        >
                            <X size={16} className="text-blue-600" />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-end gap-3">
                {/* Emoji button */}
                <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <Smile size={20} />
                </button>

                {/* Message input */}
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        disabled={disabled}
                        className="w-full resize-none rounded-2xl bg-gray-100 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 max-h-32"
                        rows={1}
                    />
                </div>

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={!message.trim() || disabled}
                    className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={18} />
                </button>
            </div>

            {/* Emoji picker */}
            {showEmojiPicker && (
                <div className="mt-3 p-3 bg-white rounded-lg shadow-lg border">
                    <div className="grid grid-cols-6 gap-2">
                        {commonEmojis.map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => handleEmojiClick(emoji)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors text-lg"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageInput; 