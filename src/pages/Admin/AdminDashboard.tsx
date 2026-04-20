import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';
import { MessageSquare, Settings, Users, Shield, Send, Bell, Bot, Trash2, Plus, Image as ImageIcon, AlertCircle, Loader2, Target } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { signOut } from 'firebase/auth';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [siteConfig, setSiteConfig] = useState<any>({
    hero: { title: '', subtitle: '', ctaText: '', image: '' },
    about: { title: '', content: '', image: '' },
    services: [],
    contact: { hotline: '', email: '', address: '', whatsapp: '' },
    clientLogos: [],
    knowledgeBase: ''
  });
  const [activeTab, setActiveTab] = useState<'chats' | 'site' | 'services' | 'visual' | 'knowledge'>('chats');
  const notificationSound = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsChecking(true);
      if (user) {
        // Explicit owner bypass for the user's accounts
        const authorizedEmails = ['nilanrumal@gmail.com', 'rumalfernando@gmail.com'];
        if (user.email && authorizedEmails.includes(user.email)) {
          const adminRef = doc(db, 'admins', user.uid);
          const adminDoc = await getDoc(adminRef);
          if (!adminDoc.exists()) {
             await setDoc(adminRef, { email: user.email, role: 'owner' });
             await setDoc(doc(db, 'admins', 'bootstrap'), { done: true });
          }
          setIsAdmin(true);
          setIsChecking(false);
          return;
        }

        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        if (adminDoc.exists()) {
          setIsAdmin(true);
        } else {
          const adminsSnap = await getDoc(doc(db, 'admins', 'bootstrap'));
          if (!adminsSnap.exists()) {
             await setDoc(doc(db, 'admins', user.uid), { email: user.email, role: 'owner' });
             await setDoc(doc(db, 'admins', 'bootstrap'), { done: true });
             setIsAdmin(true);
          } else {
             setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
        navigate('/admin/login');
      }
      setIsChecking(false);
    });

    notificationSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    // Fixed fetch error by forcing websocket transport
    if (!socketRef.current) {
      socketRef.current = io({ transports: ['websocket'] });
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
      if (snapshot.exists()) {
        const data = snapshot.data();
        setSiteConfig((prev: any) => ({
          ...prev,
          ...data
        }));
      }
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

  const joinChat = async (id: string) => {
    setSelectedChatId(id);
    const chat = chats.find(c => c.id === id);
    if (chat) {
      const updates: any = {
        isReadByAdmin: true,
        updatedAt: serverTimestamp()
      };
      
      if (chat.status !== 'active_agent') {
        updates.status = 'active_agent';
        socketRef.current?.emit('agent_join', { chatId: id });
      }

      await updateDoc(doc(db, 'chats', id), updates);
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

  if (isChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-brand-primary" />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-gray-200 border border-gray-50">
          <div className="h-20 w-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-serif mb-4 tracking-tight text-gray-900 px-4">Permission <span className="italic text-gray-400">Denied</span></h1>
          <p className="text-gray-500 mb-10 leading-relaxed text-sm px-6">
            Your account is authenticated, but you do not have administrative privileges for the NextGen Executive Portal.
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => signOut(auth).then(() => navigate('/admin/login'))}
              className="w-full py-5 bg-gray-900 text-white rounded-full font-bold flex items-center justify-center space-x-3 hover:bg-brand-primary transition-all shadow-xl shadow-gray-200"
            >
              Sign Out & Retry
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 bg-gray-50 text-gray-500 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
            >
              Back to Public Site
            </button>
          </div>
        </div>
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
            {chats.filter(c => !c.isReadByAdmin || c.status === 'waiting').length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                {chats.filter(c => !c.isReadByAdmin || c.status === 'waiting').length} NEW
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('site')}
            className={cn("w-full flex items-center space-x-4 p-4 rounded-2xl transition-all font-semibold", activeTab === 'site' ? "bg-brand-primary text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:bg-gray-50")}
          >
            <Settings className="h-5 w-5" />
            <span>Site Content</span>
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={cn("w-full flex items-center space-x-4 p-4 rounded-2xl transition-all font-semibold", activeTab === 'services' ? "bg-brand-primary text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:bg-gray-50")}
          >
            <Users className="h-5 w-5" />
            <span>Services</span>
          </button>
          <button 
            onClick={() => setActiveTab('visual')}
            className={cn("w-full flex items-center space-x-4 p-4 rounded-2xl transition-all font-semibold", activeTab === 'visual' ? "bg-brand-primary text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:bg-gray-50")}
          >
            <ImageIcon className="h-5 w-5" />
            <span>Visual Assets</span>
          </button>
          <button 
            onClick={() => setActiveTab('knowledge')}
            className={cn("w-full flex items-center space-x-4 p-4 rounded-2xl transition-all font-semibold", activeTab === 'knowledge' ? "bg-brand-primary text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:bg-gray-50")}
          >
            <Bot className="h-5 w-5" />
            <span>AI Knowledge</span>
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
                {chats.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">
                    <p className="text-sm font-medium">No active chats found.</p>
                  </div>
                ) : (
                  chats.map(chat => (
                    <button 
                      key={chat.id} 
                      onClick={() => joinChat(chat.id)}
                      className={cn(
                        "w-full p-6 text-left transition-all hover:bg-gray-50 flex items-start space-x-4 relative overflow-hidden",
                        selectedChatId === chat.id ? "bg-blue-50 border-r-4 border-brand-primary" : 
                        !chat.isReadByAdmin ? "bg-white shadow-[inset_4px_0_0_0_#ef4444]" : "bg-white"
                      )}
                    >
                      {chat.status === 'waiting' && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500 animate-pulse" />
                      )}
                      <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 relative",
                        chat.status === 'waiting' ? "bg-red-100 text-red-600" : 
                        !chat.isReadByAdmin ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                      )}>
                        {chat.status === 'waiting' ? <Bell className="animate-swing h-5 w-5" /> : <Users className="h-5 w-5" />}
                        {!chat.isReadByAdmin && (
                          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="overflow-hidden flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <span className={cn("text-sm transition-colors", !chat.isReadByAdmin ? "font-black text-gray-900" : "font-bold text-gray-600")}>
                            {chat.userName || 'Anonymous Client'}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">{chat.updatedAt?.toDate ? chat.updatedAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}</span>
                        </div>
                        <p className={cn("text-xs truncate mb-2", !chat.isReadByAdmin ? "text-gray-900 font-medium" : "text-gray-500")}>
                          {chat.lastMessage || 'Starting conversation...'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                            chat.status === 'waiting' ? "bg-red-100 text-red-700" : 
                            chat.status === 'active_agent' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          )}>
                            {chat.status.replace('_', ' ')}
                          </span>
                          {!chat.isReadByAdmin && (
                            <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter animate-pulse">New Message</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
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
                    <div ref={messagesEndRef} />
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
        ) : activeTab === 'site' ? (
          <div className="flex-grow p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold">Site Content</h2>
                <button onClick={saveConfig} className="bg-brand-primary text-white px-8 py-3 rounded-full font-bold hover:bg-brand-secondary shadow-lg shadow-blue-500/20 transition-all">
                  Save Changes
                </button>
              </div>

              <div className="space-y-8">
                {/* Hero Content */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <Target className="h-5 w-5 text-brand-primary" />
                    <span>Hero Section</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Hero Title</label>
                        <input 
                          value={siteConfig.hero?.title}
                          onChange={(e) => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, title: e.target.value}})}
                          className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">CTA Button Text</label>
                        <input 
                          value={siteConfig.hero?.ctaText}
                          onChange={(e) => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, ctaText: e.target.value}})}
                          className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Hero Subtitle</label>
                      <textarea 
                        value={siteConfig.hero?.subtitle}
                        onChange={(e) => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, subtitle: e.target.value}})}
                        rows={5}
                        className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none resize-none" 
                      />
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <Users className="h-5 w-5 text-brand-primary" />
                    <span>About Us Section</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Section Title</label>
                      <input 
                        value={siteConfig.about?.title}
                        onChange={(e) => setSiteConfig({...siteConfig, about: {...siteConfig.about, title: e.target.value}})}
                        className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Detailed Narrative</label>
                      <textarea 
                        value={siteConfig.about?.content}
                        onChange={(e) => setSiteConfig({...siteConfig, about: {...siteConfig.about, content: e.target.value}})}
                        rows={6}
                        className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none resize-none" 
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-brand-primary" />
                    <span>Contact & Location</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Hotline</label>
                      <input 
                        value={siteConfig.contact?.hotline}
                        onChange={(e) => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, hotline: e.target.value}})}
                        className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                      <input 
                        value={siteConfig.contact?.email}
                        onChange={(e) => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, email: e.target.value}})}
                        className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">WhatsApp</label>
                      <input 
                        value={siteConfig.contact?.whatsapp}
                        onChange={(e) => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, whatsapp: e.target.value}})}
                        className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Physical Address</label>
                      <input 
                        value={siteConfig.contact?.address}
                        onChange={(e) => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, address: e.target.value}})}
                        className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'services' ? (
          <div className="flex-grow p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold">Service Catalog</h2>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => {
                      const newServices = [...(siteConfig.services || []), { title: 'New Service', description: '', icon: 'Briefcase' }];
                      setSiteConfig({...siteConfig, services: newServices});
                    }}
                    className="flex items-center space-x-2 px-6 py-2 bg-gray-100 text-gray-600 rounded-full font-bold hover:bg-gray-200 transition-all"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Service</span>
                  </button>
                  <button onClick={saveConfig} className="bg-brand-primary text-white px-8 py-3 rounded-full font-bold hover:bg-brand-secondary shadow-lg transition-all">
                    Save Services
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(siteConfig.services || []).map((service: any, index: number) => (
                  <div key={index} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl relative group">
                    <button 
                      onClick={() => {
                        const filtered = siteConfig.services.filter((_: any, i: number) => i !== index);
                        setSiteConfig({...siteConfig, services: filtered});
                      }}
                      className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Service Title</label>
                        <input 
                          value={service.title}
                          onChange={(e) => {
                            const updated = [...siteConfig.services];
                            updated[index].title = e.target.value;
                            setSiteConfig({...siteConfig, services: updated});
                          }}
                          className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none font-bold" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Description</label>
                        <textarea 
                          value={service.description}
                          onChange={(e) => {
                            const updated = [...siteConfig.services];
                            updated[index].description = e.target.value;
                            setSiteConfig({...siteConfig, services: updated});
                          }}
                          rows={3}
                          className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none resize-none text-sm" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'visual' ? (
          <div className="flex-grow p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold">Visual Assets</h2>
                <button onClick={saveConfig} className="bg-brand-primary text-white px-8 py-3 rounded-full font-bold hover:bg-brand-secondary shadow-lg transition-all">
                  Update Media
                </button>
              </div>

              <div className="space-y-8">
                {/* Major Images */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6">
                  <h3 className="text-xl font-bold flex items-center space-x-2 text-gray-700">
                    <ImageIcon className="h-5 w-5 text-brand-primary" />
                    <span>Primary Website Imagery</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Hero Background URL</label>
                        <input 
                          value={siteConfig.hero?.image}
                          onChange={(e) => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, image: e.target.value}})}
                          className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none" 
                        />
                      </div>
                      <div className="aspect-video rounded-3xl overflow-hidden bg-gray-100 border border-gray-200">
                        {siteConfig.hero?.image && <img src={siteConfig.hero.image} className="w-full h-full object-cover" alt="Hero Preview" />}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">About Section Image URL</label>
                        <input 
                          value={siteConfig.about?.image}
                          onChange={(e) => setSiteConfig({...siteConfig, about: {...siteConfig.about, image: e.target.value}})}
                          className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none" 
                        />
                      </div>
                      <div className="aspect-video rounded-3xl overflow-hidden bg-gray-100 border border-gray-200">
                        {siteConfig.about?.image && <img src={siteConfig.about.image} className="w-full h-full object-cover" alt="About Preview" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Logos */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center space-x-2 text-gray-700">
                      <Shield className="h-5 w-5 text-brand-primary" />
                      <span>Client & Partner Logos</span>
                    </h3>
                    <button 
                      onClick={() => setSiteConfig({...siteConfig, clientLogos: [...(siteConfig.clientLogos || []), ""]})}
                      className="p-3 bg-gray-50 text-gray-500 rounded-2xl hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(siteConfig.clientLogos || []).map((logo: string, idx: number) => (
                      <div key={idx} className="relative group p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <button 
                          onClick={() => setSiteConfig({...siteConfig, clientLogos: siteConfig.clientLogos.filter((_: any, i: number) => i !== idx)})}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <div className="h-16 flex items-center justify-center mb-3">
                          {logo ? <img src={logo} className="max-h-full object-contain" alt={`Logo ${idx}`} /> : <ImageIcon className="h-8 w-8 text-gray-200" />}
                        </div>
                        <input 
                          value={logo}
                          onChange={(e) => {
                            const updated = [...siteConfig.clientLogos];
                            updated[idx] = e.target.value;
                            setSiteConfig({...siteConfig, clientLogos: updated});
                          }}
                          placeholder="Image URL..."
                          className="w-full p-2 bg-white rounded-lg text-[10px] border-none focus:ring-1 focus:ring-brand-primary outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full p-12 bg-gray-50">
            <div className="max-w-4xl mx-auto w-full bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">AI Knowledge Base</h2>
                  <p className="text-sm text-gray-500 mt-1">Configure internal logic for NextGen Support Intelligence</p>
                </div>
                <div className="h-16 w-16 bg-brand-primary text-white rounded-[2rem] flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Bot className="h-8 w-8" />
                </div>
              </div>
              <textarea 
                value={siteConfig.knowledgeBase}
                onChange={(e) => setSiteConfig({...siteConfig, knowledgeBase: e.target.value})}
                className="flex-grow w-full p-8 bg-gray-50 rounded-[2rem] border-none focus:ring-2 focus:ring-brand-primary outline-none resize-none text-gray-700 font-medium leading-relaxed shadow-inner"
                placeholder="Insert core business intelligence, employee lists, and system protocols here. The AI will use this to accurately respond to clients."
              />
              <div className="mt-8 flex justify-end">
                <button onClick={saveConfig} className="bg-gray-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-brand-primary transition-all shadow-xl">
                  Update AI Knowledge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
