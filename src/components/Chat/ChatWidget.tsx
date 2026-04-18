import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, Headset, Bot, MoreHorizontal } from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { io, Socket } from 'socket.io-client';
import { getChatBotResponse } from '../../services/geminiService';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const [chatId, setChatId] = useState<string | null>(localStorage.getItem('chatId'));
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [chatStatus, setChatStatus] = useState<'active_bot' | 'waiting' | 'active_agent'>('active_bot');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure user is authenticated anonymously for chat
    const ensureAuth = async () => {
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }
    };
    ensureAuth();

    // Initialize socket safely
    if (!socketRef.current) {
      socketRef.current = io();
    }

    if (chatId) {
      const q = query(collection(db, `chats/${chatId}/messages`), orderBy('timestamp', 'asc'));
      const unsubscribeMessages = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      });

      const unsubscribeChat = onSnapshot(doc(db, 'chats', chatId), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setChatStatus(data.status);
          
          if (data.status === 'active_agent' && chatStatus !== 'active_agent') {
            // Agent just joined
            setMessages(prev => [...prev, { id: 'sys-join', text: 'An Agent has joined the chat.', type: 'system' }]);
          }
        }
      });

      return () => {
        unsubscribeMessages();
        unsubscribeChat();
      };
    }
  }, [chatId, chatStatus]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startChat = async () => {
    let currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      const cred = await signInAnonymously(auth);
      currentUid = cred.user.uid;
    }

    const newChat = await addDoc(collection(db, 'chats'), {
      status: 'active_bot',
      updatedAt: serverTimestamp(),
      userId: currentUid,
    });
    setChatId(newChat.id);
    localStorage.setItem('chatId', newChat.id);
  };

  const sendMessage = async (e?: any) => {
    e?.preventDefault();
    if (!input.trim() || !chatId) return;

    const userText = input;
    setInput('');

    try {
      console.log("Sending message to Firestore...", { chatId, userText });
      // Add user message to Firestore
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: userText,
        type: 'user',
        senderId: auth.currentUser?.uid || 'anonymous',
        timestamp: serverTimestamp()
      });

      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: userText,
        updatedAt: serverTimestamp()
      });

      if (chatStatus === 'active_bot') {
        setIsTyping(true);
        // Get AI Response
        console.log("Fetching AI response...");
        const siteConfigDoc = await getDoc(doc(db, 'siteConfig', 'current'));
        const siteConfig = siteConfigDoc.exists() ? siteConfigDoc.data() : {};
        
        const history = messages.slice(-5).map(m => ({ text: m.text, type: m.type }));
        history.push({ text: userText, type: 'user' });
        
        const aiResponse = await getChatBotResponse(history, siteConfig);
        console.log("AI Response received:", aiResponse);
        setIsTyping(false);

        if (aiResponse.includes('[HANDOVER_REQUESTED]')) {
          const cleanResponse = aiResponse.replace('[HANDOVER_REQUESTED]', '').trim();
          await addDoc(collection(db, `chats/${chatId}/messages`), {
            text: cleanResponse || "Connecting you to a human agent, please wait...",
            type: 'bot',
            senderId: 'bot',
            timestamp: serverTimestamp()
          });
          
          // Update chat status to waiting
          await updateDoc(doc(db, 'chats', chatId), {
            status: 'waiting',
            updatedAt: serverTimestamp()
          });
          
          // Notify backend via socket
          socketRef.current?.emit('handover_request', { chatId, userText });
        } else {
          await addDoc(collection(db, `chats/${chatId}/messages`), {
            text: aiResponse,
            type: 'bot',
            senderId: 'bot',
            timestamp: serverTimestamp()
          });
        }
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      toast.error("Failed to send message: " + (error.message || "Unknown error"));
      // Restore input on failure
      setInput(userText);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-[90vw] sm:w-[400px] h-[600px] flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-brand-primary p-6 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                  {chatStatus === 'active_agent' ? <Headset /> : <Bot />}
                </div>
                <div>
                  <h3 className="font-bold">NextGen Support</h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-70">
                    {chatStatus === 'active_agent' ? 'Connected to Agent' : 'AI Assistant Online'}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50 flex flex-col">
              {messages.length === 0 && (
                <div className="mt-20 text-center">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="text-brand-primary h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-gray-900">How can we help?</h4>
                  <p className="text-sm text-gray-500 max-w-[200px] mx-auto mt-2 leading-relaxed">
                    Ask our AI assistant about Accounting, Tax, or speak to a consultant.
                  </p>
                  <button 
                    onClick={startChat}
                    className="mt-6 px-6 py-2 bg-brand-primary text-white rounded-full text-sm font-bold shadow-lg shadow-green-500/20"
                  >
                    Start Chat
                  </button>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={m.id || i} className={cn(
                  "flex items-start space-x-2 max-w-[85%]",
                  m.type === 'user' ? "ml-auto flex-row-reverse space-x-reverse" : "mr-auto"
                )}>
                  <div className={cn(
                    "p-3.5 rounded-2xl text-sm leading-relaxed",
                    m.type === 'user' ? "bg-brand-primary text-white rounded-tr-none" : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none",
                    m.type === 'system' && "bg-blue-50 text-blue-700 border-none w-full text-xs text-center font-medium italic"
                  )}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="mr-auto bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center">
                  <span className="flex space-x-1">
                    <span className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce" />
                    <span className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </span>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            {chatId && (
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 flex items-center space-x-3 bg-white">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-grow text-sm bg-gray-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                />
                <button 
                  type="button"
                  onClick={() => sendMessage()}
                  className="h-10 w-10 bg-brand-primary text-white rounded-xl flex items-center justify-center hover:bg-brand-secondary transition-all"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            )}
            
            {/* Status bar */}
            {chatStatus === 'waiting' && (
              <div className="px-4 py-2 bg-yellow-50 text-yellow-800 text-[10px] font-bold uppercase tracking-wider text-center flex items-center justify-center space-x-2">
                <MoreHorizontal className="h-3 w-3 animate-pulse" />
                <span>Notifying a human agent...</span>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 bg-brand-primary text-white rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-brand-secondary transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <MessageSquare className="h-8 w-8 relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
