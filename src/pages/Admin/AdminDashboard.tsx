import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';
import { LogIn, MessageSquare, Settings, Users, ArrowRight, Shield, Send, Bell, Bot } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [siteConfig, setSiteConfig] = useState<any>({
    bannerTitle: "Empowering Businesses",
    bannerSubtitle: "Next Generation Consultancy",
    hotline: "+94 77 338 6064",
    address: "No. 185, Ebert Lane, Kaldemulla, Moratuwa.",
    email: "ceo@consultantsdoctors.com",
    knowledgeBase: ""
  });
  const [activeTab, setActiveTab] = useState<'chats' | 'site'>('chats');
  const notificationSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check if user is admin
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // In a real app, you'd check a record in Firestore 'admins'
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        if (adminDoc.exists()) {
          setIsAdmin(true);
        } else {
          // Auto-bootstrap first user as admin for demo purposes
          const adminsSnap = await getDoc(doc(db, 'admins', 'bootstrap'));
          if (!adminsSnap.exists()) {
             await setDoc(doc(db, 'admins', user.uid), { email: user.email, role: 'owner' });
             await setDoc(doc(db, 'admins', 'bootstrap'), { done: true });
             setIsAdmin(true);
          } else {
             toast.error("Access denied. Not an admin.");
             signOut(auth);
          }
        }
      } else {
        setIsAdmin(false);
      }
    });

    // Notification sound initialization
    notificationSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    if (!socketRef.current) {
      socketRef.current = io();
    }

    socketRef.current.emit('join_admin');
    socketRef.current.on('notify_handover', (data) => {
      toast("Human assistance requested!", { icon: '🔔', duration: 6000 });
      notificationSound.current?.play().catch(e => console.log("Sound blocked", e));
    });

    const q = query(collection(db, 'chats'), orderBy('updatedAt', 'desc'));
    const unsubscribeChats = onSnapshot(q, (snapshot) => {
      setChats(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const configDoc = doc(db, 'siteConfig', 'current');
    const unsubscribeConfig = onSnapshot(configDoc, (snapshot) => {
      if (snapshot.exists()) setSiteConfig(snapshot.data());
    });

    return () => {
      unsubscribeChats();
      unsubscribeConfig();
      socketRef.current?.off('notify_handover');
    };
  }, [isAdmin]);

  useEffect(() => {
    if (selectedChatId) {
      const q = query(collection(db, `chats/${selectedChatId}/messages`), orderBy('timestamp', 'asc'));
      const unsubscribeMessages = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      });
      return () => unsubscribeMessages();
    }
  }, [selectedChatId]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      toast.error("Login failed");
    }
  };

  const joinChat = async (id: string) => {
    setSelectedChatId(id);
    const chat = chats.find(c => c.id === id);
    if (chat && chat.status !== 'active_agent') {
      await updateDoc(doc(db, 'chats', id), {
        status: 'active_agent',
        updatedAt: serverTimestamp()
      });
      socketRef.current?.emit('agent_join', { chatId: id });
    }
  };

  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!input.trim() || !selectedChatId) return;

    await addDoc(collection(db, `chats/${selectedChatId}/messages`), {
      text: input,
      type: 'agent',
      senderId: auth.currentUser?.uid,
      timestamp: serverTimestamp()
    });

    await updateDoc(doc(db, 'chats', selectedChatId), {
      lastMessage: input,
      updatedAt: serverTimestamp()
    });

    setInput('');
  };

  const saveConfig = async () => {
    await setDoc(doc(db, 'siteConfig', 'current'), siteConfig);
    toast.success("Site configuration updated!");
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-md w-full text-center professional-shadow">
          <div className="h-20 w-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Shield className="h-10 w-10 text-brand-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Admin Hub</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">Secure access for NextGen administrators. Please sign in with your authorized Google account.</p>
          <button 
            onClick={handleLogin}
            className="w-full py-5 bg-black text-white rounded-full font-bold flex items-center justify-center space-x-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
          >
            <LogIn className="h-5 w-5" />
            <span>Secure Admin Login</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-100 flex flex-col pt-20">
        <div className="p-8 space-y-2">
          <button 
            onClick={() => setActiveTab('chats')}
            className={cn("w-full flex items-center space-x-4 p-4 rounded-2xl transition-all font-semibold", activeTab === 'chats' ? "bg-brand-primary text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:bg-gray-50")}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Chat Monitoring</span>
            {chats.filter(c => c.status === 'waiting').length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                {chats.filter(c => c.status === 'waiting').length} NEW
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('site')}
            className={cn("w-full flex items-center space-x-4 p-4 rounded-2xl transition-all font-semibold", activeTab === 'site' ? "bg-brand-primary text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:bg-gray-50")}
          >
            <Settings className="h-5 w-5" />
            <span>Site Management</span>
          </button>
        </div>

        <div className="mt-auto p-8 border-t border-gray-100">
          <div className="flex items-center space-x-3 text-xs text-gray-400 mb-4 px-4 font-medium uppercase tracking-[0.2em] font-medium opacity-60">Connected As</div>
          <div className="flex items-center space-x-3 px-4 mb-8">
            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
              {auth.currentUser?.email?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-gray-900 truncate">{auth.currentUser?.displayName}</p>
              <button onClick={() => signOut(auth)} className="text-brand-primary font-bold hover:underline">Logout</button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow pt-20 flex flex-col h-screen overflow-hidden">
        {activeTab === 'chats' ? (
          <div className="flex h-full">
            {/* Chat List */}
            <div className="w-96 border-r border-gray-100 bg-white overflow-y-auto">
              <div className="p-8 border-b border-gray-50">
                <h2 className="text-xl font-bold">Active Sessions</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {chats.map(chat => (
                  <button 
                    key={chat.id} 
                    onClick={() => joinChat(chat.id)}
                    className={cn(
                      "w-full p-6 text-left transition-all hover:bg-gray-50 flex items-start space-x-4",
                      selectedChatId === chat.id && "bg-blue-50 border-r-4 border-brand-primary"
                    )}
                  >
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
                      chat.status === 'waiting' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                    )}>
                      {chat.status === 'waiting' ? <Bell className="animate-swing" /> : <Users />}
                    </div>
                    <div className="overflow-hidden flex-grow">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm">{chat.userName || 'Anonymous Client'}</span>
                        <span className="text-[10px] text-gray-400">{chat.updatedAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mb-2">{chat.lastMessage || 'Starting conversation...'}</p>
                      <span className={cn(
                        "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                        chat.status === 'waiting' ? "bg-red-100 text-red-700" : 
                        chat.status === 'active_agent' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      )}>
                        {chat.status.replace('_', ' ')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className="flex-grow flex flex-col bg-white">
              {selectedChatId ? (
                <>
                  <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gray-100 rounded-2xl flex items-center justify-center font-bold text-gray-400">?</div>
                      <div>
                        <h3 className="font-bold">Client Support Session</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium opacity-60">ID: {selectedChatId}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow p-8 overflow-y-auto bg-gray-50 space-y-4">
                    {messages.map((m, i) => (
                      <div key={m.id || i} className={cn(
                        "flex items-start max-w-[70%]",
                        m.type === 'agent' ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}>
                        <div className={cn(
                          "p-4 rounded-2xl text-sm",
                          m.type === 'agent' ? "bg-brand-primary text-white rounded-tr-none ml-2" : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none mr-2"
                        )}>
                          <p className="text-[10px] opacity-70 mb-1 font-bold uppercase tracking-widest">
                            {m.type === 'agent' ? 'You' : m.type === 'bot' ? 'AI Bot' : 'Client'}
                          </p>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={sendMessage} className="p-6 border-t border-gray-100 flex space-x-4">
                    <input 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a response to the client..." 
                      className="flex-grow p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    />
                    <button className="px-8 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-secondary transition-all flex items-center space-x-2">
                       <Send className="h-5 w-5" />
                       <span>Send</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-grow flex items-center justify-center text-center p-12">
                  <div className="max-w-sm">
                    <div className="h-24 w-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                       <MessageSquare className="h-12 w-12 text-brand-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Select a Chat Session</h3>
                    <p className="text-gray-500 leading-relaxed">Choose an active session from the left to monitor the AI or join the conversation with the client.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Site Management Tab */
          <div className="flex-grow p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold">Site Configuration</h2>
                <button onClick={saveConfig} className="bg-brand-primary text-white px-8 py-3 rounded-full font-bold hover:bg-brand-secondary shadow-lg shadow-blue-500/20 transition-all">
                  Save Changes
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-gray-400" />
                    <span>General Content</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Banner Title</label>
                      <input 
                        value={siteConfig.bannerTitle}
                        onChange={(e) => setSiteConfig({...siteConfig, bannerTitle: e.target.value})}
                        className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Contact Email</label>
                      <input 
                        value={siteConfig.email}
                        onChange={(e) => setSiteConfig({...siteConfig, email: e.target.value})}
                        className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none" 
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl flex flex-col">
                  <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-gray-400" />
                    <span>AI Training & Knowledge</span>
                  </h3>
                  <p className="text-xs text-gray-500 mb-6 leading-relaxed">Provide specific context for the AI chatbot. This will be used as the internal knowledge base for answering client queries.</p>
                  <textarea 
                    value={siteConfig.knowledgeBase}
                    onChange={(e) => setSiteConfig({...siteConfig, knowledgeBase: e.target.value})}
                    rows={8}
                    placeholder="E.g. We specialize in SME auditing. Our team is led by CEO Dr. Silva..."
                    className="flex-grow w-full p-5 bg-gray-50 rounded-3xl border-none focus:ring-2 focus:ring-brand-primary outline-none resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
