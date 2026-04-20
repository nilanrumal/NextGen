import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, Headset, Bot, MoreHorizontal, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { io, Socket } from 'socket.io-client';
import { getChatBotResponse } from '../../services/geminiService';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'welcome' | 'auth' | 'chat'>(localStorage.getItem('chatId') ? 'chat' : 'welcome');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const [chatId, setChatId] = useState<string | null>(localStorage.getItem('chatId'));
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [chatStatus, setChatStatus] = useState<'active_bot' | 'waiting' | 'active_agent'>('active_bot');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If we have a chatId, we are at the chat step
    if (chatId) setStep('chat');
  }, [chatId]);

  useEffect(() => {
    // Initialize socket safely with websocket transport
    if (!socketRef.current) {
      socketRef.current = io({ transports: ['websocket'] });
    }

    if (chatId && step === 'chat') {
      const q = query(collection(db, `chats/${chatId}/messages`), orderBy('timestamp', 'asc'));
      const unsubscribeMessages = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      });

      const unsubscribeChat = onSnapshot(doc(db, 'chats', chatId), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setChatStatus(data.status);
          
          if (data.status === 'active_agent' && chatStatus !== 'active_agent') {
            setMessages(prev => [...prev, { id: 'sys-join', text: 'An Agent has joined the chat.', type: 'system' }]);
          }
        }
      });

      return () => {
        unsubscribeMessages();
        unsubscribeChat();
      };
    }
  }, [chatId, step]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartAnonymous = async (status: 'active_bot' | 'waiting' = 'active_bot') => {
    setLoading(true);
    try {
      let currentUid = auth.currentUser?.uid;
      if (!currentUid) {
        const cred = await signInAnonymously(auth);
        currentUid = cred.user.uid;
      }
      const newChatId = await createChatDoc(currentUid, '', '', status);
      setChatId(newChatId);
      setStep('chat');
    } catch (error: any) {
      console.error("Anonymous error:", error);
      toast.error("Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let user;
      if (authMode === 'login') {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        user = cred.user;
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName });
        user = cred.user;
      }
      
      const newChatId = await createChatDoc(user.uid, user.email || '', user.displayName || '');
      setChatId(newChatId);
      setStep('chat');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createChatDoc = async (uid: string, email = '', name = '', status: 'active_bot' | 'waiting' = 'active_bot') => {
    const newChat = await addDoc(collection(db, 'chats'), {
      status,
      updatedAt: serverTimestamp(),
      userId: uid,
      userEmail: email,
      userName: name,
      isReadByAdmin: false
    });
    localStorage.setItem('chatId', newChat.id);
    if (status === 'waiting') {
      socketRef.current?.emit('handover_request', { 
        chatId: newChat.id, 
        userText: 'Client requested direct agent support.',
        userName: name,
        userEmail: email
      });
    }
    return newChat.id;
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
        updatedAt: serverTimestamp(),
        isReadByAdmin: false
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
          socketRef.current?.emit('handover_request', { 
            chatId, 
            userText,
            userName: auth.currentUser?.displayName || '',
            userEmail: auth.currentUser?.email || ''
          });
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

            {/* Content Area based on Step */}
            <div className="flex-grow overflow-hidden flex flex-col bg-gray-50">
              {step === 'welcome' && (
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                  <div className="h-20 w-20 bg-green-100 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-green-500/10">
                    <MessageSquare className="text-brand-primary h-10 w-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">How can we help?</h4>
                  <p className="text-sm text-gray-500 max-w-[280px] mx-auto mb-10 leading-relaxed">
                    Start a quick chat with our AI or log in to keep track of your conversations.
                  </p>
                  
                  <div className="w-full space-y-4">
                    <button 
                      onClick={handleStartAnonymous}
                      disabled={loading}
                      className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-green-500/20 hover:bg-brand-secondary transition-all flex items-center justify-center space-x-2"
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Start Quick Chat</span>}
                    </button>
                    
                    <button 
                      onClick={() => handleStartAnonymous('waiting')}
                      disabled={loading}
                      className="w-full py-4 bg-gray-50 text-brand-primary border border-brand-primary/20 rounded-2xl font-bold hover:bg-brand-primary/5 transition-all flex items-center justify-center space-x-2"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                        <>
                          <Headset className="h-4 w-4" />
                          <span>Message an Agent Directly</span>
                        </>
                      )}
                    </button>

                    <button 
                      onClick={() => setStep('auth')}
                      className="w-full py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
                    >
                      <Lock className="h-4 w-4" />
                      <span>Log in / Sign up</span>
                    </button>
                  </div>
                </div>
              )}

              {step === 'auth' && (
                <div className="flex-grow p-8 overflow-y-auto">
                  <button 
                    onClick={() => setStep('welcome')}
                    className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 hover:text-brand-primary transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3 rotate-180" /> Back
                  </button>
                  
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h4>
                  <p className="text-sm text-gray-500 mb-8">
                    Your chat history will be synced across all devices.
                  </p>

                  <form onSubmit={handleAuth} className="space-y-4">
                    {authMode === 'signup' && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Your Name</label>
                        <input 
                          type="text"
                          required
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Password</label>
                      <input 
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                        placeholder="••••••••"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg shadow-gray-900/10 hover:bg-brand-primary transition-all flex items-center justify-center space-x-2 mt-4"
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>{authMode === 'login' ? 'Login' : 'Create Account'}</span>}
                    </button>
                  </form>

                  <button 
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    className="w-full text-center mt-6 text-sm font-medium text-gray-500 hover:text-brand-primary transition-colors"
                  >
                    {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                  </button>
                </div>
              )}

              {step === 'chat' && (
                <>
                  <div className="flex-grow p-4 overflow-y-auto space-y-4 scroll-smooth">
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-50">
                        <Bot className="h-12 w-12 mb-4" />
                        <p className="text-sm font-medium">Assistant initialized. Type your question to begin.</p>
                      </div>
                    )}
                    {messages.map((m, i) => (
                      <div key={m.id || i} className={cn(
                        "flex items-start space-x-2 max-w-[85%]",
                        m.type === 'user' ? "ml-auto flex-row-reverse space-x-reverse" : "mr-auto"
                      )}>
                        <div className={cn(
                          "p-3.5 rounded-2xl text-sm shadow-sm",
                          m.type === 'user' ? "bg-brand-primary text-white rounded-tr-none" : "bg-white text-gray-700 border border-gray-100 rounded-tl-none",
                          m.type === 'system' && "bg-blue-50/50 text-blue-600 border-none w-full text-[10px] text-center font-bold uppercase tracking-widest italic"
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

                  {/* Input Form */}
                  <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 bg-white">
                    <div className="flex items-center space-x-3 bg-gray-50 p-1.5 rounded-2xl">
                      <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type message..."
                        className="flex-grow text-sm bg-transparent border-none px-4 py-3 outline-none"
                      />
                      <button 
                        type="submit"
                        className="h-11 w-11 bg-brand-primary text-white rounded-xl flex items-center justify-center hover:bg-brand-secondary transition-all shadow-md shadow-brand-primary/20"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
            
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
