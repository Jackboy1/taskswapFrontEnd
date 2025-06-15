import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchMessages } from '../services/api';
import io from 'socket.io-client';

export default function ChatBox({ taskId: propTaskId }) {
  const { id: paramTaskId } = useParams();
  const taskId = propTaskId || paramTaskId;
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [badges, setBadges] = useState([]);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    socketRef.current = io('https://taskswap-backend-23oy.onrender.com', {
      auth: { token: localStorage.getItem('token') },
    });

    socketRef.current.on('connect', () => console.log('Socket.IO connected:', socketRef.current.id));
    socketRef.current.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
      setError('Failed to connect to chat server.');
    });

    socketRef.current.emit('joinTaskRoom', taskId);
    console.log('Joining task room:', taskId);

    const loadData = async () => {
      try {
        setError(null);
        const messageData = await fetchMessages(taskId);
        setMessages(messageData);
        checkAchievements(messageData.length);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load chat data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();

    socketRef.current.on('receiveMessage', (message) => {
      console.log('Received new message (raw):', message);
      if (message && message.sender && message.sender._id) {
        setMessages((prev) => {
          const updatedMessages = [...prev, message];
          checkAchievements(updatedMessages.length);
          return updatedMessages;
        });
      } else {
        console.error('Invalid message received:', message);
      }
    });

    return () => socketRef.current?.disconnect();
  }, [taskId, user?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkAchievements = (messageCount) => {
    const newBadges = [];
    if (messageCount >= 10) newBadges.push('Chat Master');
    if (!badges.includes('First Chat') && messageCount > 0) newBadges.push('First Chat');
    if (newBadges.length > 0) setBadges((prev) => [...new Set([...prev, ...newBadges])]);
  };

  const handleSend = () => {
    if (!newMessage.trim() || !user) return;

    const messageData = {
      taskId,
      text: newMessage,
      sender: user._id,
      senderName: user.name,
    };

    console.log('Sending message data:', messageData);

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const optimisticMessage = { ...messageData, _id: tempId, timestamp: new Date().toISOString(), status: 'sending' };
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage('');

    socketRef.current.emit('sendMessage', messageData, ({ success, error, message }) => {
      console.log('Send callback response:', { success, error, message });
      if (success && message) {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === tempId ? { ...message, status: 'sent' } : msg))
        );
      } else {
        setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
        console.error('Failed to send:', error || 'Unknown error');
        setError('Message failed to send. Try again.');
      }
    });
  };

  if (loading) {
    return (
      <div className="border rounded-lg p-4 h-96 flex items-center justify-center bg-white">
        <div className="animate-pulse text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 h-96 flex flex-col bg-white overflow-hidden">
      {error && <div className="p-2 mb-4 text-red-700 bg-red-100 rounded-md">{error}</div>}
      <div className="flex justify-between mb-2">
        <h3 className="text-lg font-semibold">Task Chat</h3>
        <div>
          {badges.length > 0 && <div className="text-sm text-green-600">Badges: {badges.join(', ')}</div>}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2" style={{ maxHeight: '50vh' }}>
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id || Math.random().toString()} className={`flex ${msg.sender === user?._id ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === user?._id
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-gray-100 rounded-bl-none'
                }`}
              >
                <p className="font-medium">{msg.senderName || 'Unknown'}</p>
                <p>{msg.text || 'No content'}</p>
                <div className="flex items-center mt-1 gap-1">
                  <p className="text-xs opacity-70">{new Date(msg.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</p>
                  {msg.sender === user?._id && (
                    <span className="text-xs">
                      {msg.status === 'sending' && '⏳'} {/* Spinner icon */}
                      {msg.status === 'failed' && '❌'} {/* Cross icon */}
                      {msg.status === 'sent' && '✅'} {/* Checkmark icon */}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {user ? (
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`px-4 py-2 rounded-md ${
              newMessage.trim()
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </div>
      ) : (
        <div className="text-center text-gray-500">Please log in to send messages.</div>
      )}
    </div>
  );
}