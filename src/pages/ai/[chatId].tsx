'use client';

import type React from 'react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import {
  Plus,
  MessageSquare,
  Send,
  Menu,
  X,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Copy,
  Share,
  Mic,
  Paperclip,
} from 'lucide-react';
import Image from 'next/image';
import {
  apiToken,
  createConversation,
  getAgents,
  getConversations,
  getMessages,
} from '@/services/aiService';
import {
  Agent,
  Section,
  Conversation,
  Message,
  SendMessageProps,
} from '@/types';
import { uuid } from 'uuidv4';
import MarkdownRenderer from '@/components/makedown-text';
import { useRouter } from 'next/router';
import { useCompletion } from '@ai-sdk/react';
import { getBackEndUrl } from '@/configs/config';
import { set } from 'zod/v4';

const translations = {
  vi: {
    newConversation: 'Cuộc trò chuyện mới',
    welcomeTitle: 'Chào mừng đến với con đường vô đạo',
    welcomeSubtitle: 'Điều gì đưa bạn đến đây hôm nay?',
    placeholder: 'Hỏi về bản chất của tâm...',
    signIn: 'Đăng nhập',
    signOut: 'Đăng xuất',
    adminPanel: 'Bảng quản trị',
    saveHistory: 'để lưu lịch sử',
    clearSession: 'xóa phiên',
    manageAndTrain: 'quản lý & đào tạo',
    signInTitle: 'Đăng nhập',
    signInSubtitle: 'Lưu cuộc trò chuyện và tiếp tục hành trình của bạn',
    continueWithFacebook: 'Tiếp tục với Facebook',
    continueWithGoogle: 'Tiếp tục với Google',
    continueWithTikTok: 'Tiếp tục với TikTok',
    continueWithEmail: 'Tiếp tục mà không đăng nhập',
    continueWithoutSignIn: 'Tiếp tục mà không đăng nhập',
  },
  en: {
    newConversation: 'New Conversation',
    welcomeTitle: 'Welcome to the pathless path',
    welcomeSubtitle: 'What brings you here today?',
    placeholder: 'Ask about the nature of mind...',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    adminPanel: 'Admin Panel',
    saveHistory: 'to save history',
    clearSession: 'clear session',
    manageAndTrain: 'manage & train',
    signInTitle: 'Sign In',
    signInSubtitle: 'Save your conversations and continue your journey',
    continueWithFacebook: 'Continue with Facebook',
    continueWithGoogle: 'Continue with Google',
    continueWithTikTok: 'Continue with TikTok',
    continueWithEmail: 'Continue without signing in',
    continueWithoutSignIn: 'Continue without signing in',
  },
};

export default function AIPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [isRecording, setIsRecording] = useState(false);
  // const [input, setInput] = useState('');
  // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const router = useRouter();
  const chatId = router.query.chatId as string;
  const url = getBackEndUrl();

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string>('');
  const [newConversation, setNewConversation] = useState<Conversation>();

  // Agents
  const [agent, setAgent] = useState<string>();
  const [listAgents, setListAgents] = useState<Agent[]>([]);

  // Messages
  const [listMessages, setListMessages] = useState<Message[]>([]);
  const [displayedAIText, setDisplayedAIText] = useState<string>('');
  // const [isTyping, setIsTyping] = useState(false);

  const t = translations[language];

  const {
    completion,
    complete,
    isLoading: isTyping,
    input,
    handleInputChange,
    setInput,
  } = useCompletion({
    api: `${url}/api/v1/chat/${chatId}/ask`,
    streamProtocol: 'text',
    onFinish: async () => {
      setDisplayedAIText('');
      const newMessages = await fetchMessages(chatId);
      const isConversation = conversations.some(item => item.id === chatId);

      console.log('params', {
        newMessages,
        agent,
        isConversation,
        condition: newMessages && agent && !isConversation,
      });

      if (newMessages && agent && !isConversation) {
        console.log('Creating new conversation...');
        await createConversation({
          uuid: chatId,
          language,
          messages: newMessages.map(msg => ({
            role: msg.role,
            content: msg.content,
            created_at: msg.created_at,
          })),
          agent_id: agent,
        });

        await fetchConversations();
        setNewConversation(undefined);
      }
    },
  });

  useEffect(() => {
    if (!completion) return;

    // Detect JSON objects
    const matches = completion.match(/data:\s*(\{.*?\})(?=data:|\s*$)/gs);

    if (matches) {
      let newText = '';
      matches.forEach(match => {
        try {
          const jsonStr = match.replace('data:', '').trim();
          const parsed = JSON.parse(jsonStr);
          if (parsed.type === 'text') {
            newText += parsed.data;
          }
        } catch (e) {
          console.error('Parse error', e);
        }
      });

      setDisplayedAIText(newText);
    }
  }, [completion]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setInput(event.target.value);
  //   setAIInput(event.target.value);
  // };

  const fetchConversations = async () => {
    const data = await getConversations();
    const formattedData = data.map((section: Section) => ({
      id: section.uuid,
      title: section.title,
      messages: [],
      lastMessage: new Date(section.updated_at),
    }));

    setConversations(formattedData);
  };

  const fetchAgents = async (language: 'vi' | 'en') => {
    const data = await getAgents(undefined, language);
    setAgent(data[0].uuid);
    setListAgents(data);
  };

  const fetchMessages = async (chatId: string) => {
    if (!chatId) return;

    const data = await getMessages(chatId);
    setListMessages(data);
    return data;
  };

  useEffect(() => {
    if (chatId) {
      setActiveConversation(chatId);
      fetchMessages(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    if (
      chatId &&
      conversations.length > 0 &&
      !conversations.find(item => item.id === chatId)
    ) {
      setNewConversation({
        id: chatId,
        title: t.newConversation,
        messages: [],
        lastMessage: new Date(),
      });
    }
  }, [chatId, conversations]);

  const allConversations = useMemo(() => {
    if (!newConversation) return conversations;
    return [newConversation, ...conversations];
  }, [newConversation, conversations]);

  useEffect(() => {
    fetchConversations();
    fetchAgents(language);
    scrollToBottom();
  }, [language]);

  useEffect(() => {
    scrollToBottom();
  }, [conversations.length]);

  const handleSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (!input.trim() || !chatId || !agent) return;

    setListMessages(prev => [
      ...prev,
      {
        agent_id: agent,
        content: input,
        created_at: new Date().toISOString(),
        dislike_user_ids: null,
        feedback: null,
        like_user_ids: null,
        role: 'user',
        thought: null,
        uuid: uuid(),
      },
    ]);

    const newMessage: SendMessageProps = {
      agent_id: agent,
      context: '',
      language,
      messages: [
        ...listMessages.map(msg => ({
          role: msg.role,
          content: msg.content,
          created_at: msg.created_at,
        })),
        {
          role: 'user',
          content: input,
          created_at: new Date().toISOString(),
        },
      ],
      options: { stream: true },
      session_id: chatId,
    };

    setInput('');

    await complete(input, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      body: newMessage,
    });
  };

  const handleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement actual recording functionality
  };

  // const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = Array.from(event.target.files || []);
  //   setSelectedFiles(prev => [...prev, ...files]);
  // };

  const createNewConversation = () => {
    const newId = uuid();
    // const newConv: Conversation = {
    //   id: newId,
    //   title: t.newConversation,
    //   messages: [],
    //   lastMessage: new Date(),
    // };

    router.push(`/ai/${newId}`);
    // setConversations(prev => [newConv, ...prev]);
    // setActiveConversation(newConv.id);
    // setSidebarOpen(false)
  };

  const onChangeAgent = (value: string) => {
    setAgent(value);
  };

  const onChangeConversation = (id: string) => {
    router.push(`/ai/${id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  } as Variants;

  return (
    <main className="min-h-screen text-[#f5f5f5] relative flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-3 py-2 bg-background/40 backdrop-blur-md border-b border-[#991b1b]/30">
        <div className="flex items-center space-x-3">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/images/logo.png"
              alt="Giac Ngo logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              priority
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden flex items-center justify-center px-2 py-1 bg-[#f3ead7] text-[#1f1f1f] font-serif text-xs rounded-xl
       border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
       hover:bg-[#efe2c9] transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-3 h-3" />
            ) : (
              <Menu className="w-3 h-3" />
            )}
          </button>
        </div>

        <div className="flex items-center space-x-2 md:space-x-3">
          <span className="font-[serif-sc] text-lg md:text-xl font-medium tracking-wide whitespace-nowrap text-red-900">
            Vô Tự AI
          </span>
          <select
            value={agent}
            onChange={e => onChangeAgent(e.target.value)}
            className="min-w-[120px] md:min-w-[170px] bg-[#f3ead7] text-[#1f1f1f] font-serif text-xs md:text-sm rounded-xl md:rounded-2xl px-2 md:px-4 py-1 md:py-2
              border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
              hover:bg-[#efe2c9] focus:outline-none focus:ring-0 transition-colors"
            aria-label="Choose AI Agent"
          >
            {listAgents.map(agent => (
              <option key={agent.uuid} value={agent.uuid}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Sidebar for Desktop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed md:relative top-16 md:top-0 left-0 w-80 h-[calc(100vh-4rem)] 
             md:h-[calc(100vh-4rem)] bg-[#EFE0BD] border border-[#2c2c2c]/30 
             rounded-xl shadow-lg z-40 overflow-hidden flex flex-col"
            >
              <div className="p-3">
                <button
                  onClick={createNewConversation}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-2 
                 bg-[#EFE0BD] text-[#1f1f1f] font-serif text-sm rounded-2xl
                 border border-[#2c2c2c] shadow-[0_2px_6px_rgba(0,0,0,0.3),0_0_0_3px_#00000010_inset]
                 hover:bg-[#e5d3a4] hover:shadow-[0_4px_10px_rgba(0,0,0,0.4),0_0_0_3px_#00000020_inset]
                 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.newConversation}</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 space-y-2">
                {allConversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      onChangeConversation(conv.id);
                    }}
                    className={`w-full text-left p-3 rounded-2xl font-serif text-sm border transition-all duration-200
          ${
            activeConversation === conv.id
              ? 'bg-[#e5d3a4] text-[#1f1f1f] border-[#2c2c2c] shadow-[0_3px_8px_rgba(0,0,0,0.35),0_0_0_3px_#00000010_inset]'
              : 'bg-[#EFE0BD] text-[#1f1f1f]/80 border-[#2c2c2c]/50 shadow-[0_1px_4px_rgba(0,0,0,0.2),0_0_0_2px_#00000005_inset] hover:bg-[#e5d3a4] hover:text-[#1f1f1f] hover:border-[#2c2c2c] hover:shadow-[0_3px_8px_rgba(0,0,0,0.35),0_0_0_3px_#00000010_inset]'
          }`}
                  >
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate font-medium">
                          {conv.title}
                        </p>
                        <p className="text-xs mt-1 opacity-70">
                          {conv.lastMessage.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="md:hidden border-t border-[#991b1b]/20 p-3 space-y-2 bg-[#EFE0BD]">
                <button
                  onClick={() =>
                    setLanguage(prev => (prev === 'vi' ? 'en' : 'vi'))
                  }
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 
                 bg-[#EFE0BD] text-[#1f1f1f] font-serif text-sm rounded-2xl
                 border border-[#2c2c2c] shadow-[0_2px_6px_rgba(0,0,0,0.3),0_0_0_3px_#00000010_inset]
                 hover:bg-[#e5d3a4] hover:shadow-[0_4px_10px_rgba(0,0,0,0.4),0_0_0_3px_#00000020_inset]
                 transition-all duration-200"
                >
                  <span>{language === 'vi' ? 'ENG' : 'VIE'}</span>
                </button>

                {!isSignedIn ? (
                  <button
                    onClick={() => setShowSignIn(true)}
                    className="w-full flex flex-col items-center justify-center space-y-1 px-4 py-2 
                   bg-[#EFE0BD] text-[#1f1f1f] font-serif text-sm rounded-2xl
                   border border-[#2c2c2c] shadow-[0_2px_6px_rgba(0,0,0,0.3),0_0_0_3px_#00000010_inset]
                   hover:bg-[#e5d3a4] hover:shadow-[0_4px_10px_rgba(0,0,0,0.4),0_0_0_3px_#00000020_inset]
                   transition-all duration-200"
                  >
                    <span>{t.signIn}</span>
                    <span className="text-xs opacity-70">{t.saveHistory}</span>
                  </button>
                ) : isAdmin ? (
                  <Link
                    href="/admin"
                    className="w-full flex flex-col items-center justify-center space-y-1 px-4 py-2 
                   bg-[#EFE0BD] text-[#1f1f1f] font-serif text-sm rounded-2xl
                   border border-[#2c2c2c] shadow-[0_2px_6px_rgba(0,0,0,0.3),0_0_0_3px_#00000010_inset]
                   hover:bg-[#e5d3a4] hover:shadow-[0_4px_10px_rgba(0,0,0,0.4),0_0_0_3px_#00000020_inset]
                   transition-all duration-200"
                  >
                    <span>{t.adminPanel}</span>
                    <span className="text-xs opacity-70">
                      {t.manageAndTrain}
                    </span>
                  </Link>
                ) : (
                  <button
                    onClick={() => setIsSignedIn(false)}
                    className="w-full flex flex-col items-center justify-center space-y-1 px-4 py-2 
                   bg-[#EFE0BD] text-[#1f1f1f] font-serif text-sm rounded-2xl
                   border border-[#2c2c2c] shadow-[0_2px_6px_rgba(0,0,0,0.3),0_0_0_3px_#00000010_inset]
                   hover:bg-[#e5d3a4] hover:shadow-[0_4px_10px_rgba(0,0,0,0.4),0_0_0_3px_#00000020_inset]
                   transition-all duration-200"
                  >
                    <span>{t.signOut}</span>
                    <span className="text-xs opacity-70">{t.clearSession}</span>
                  </button>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overlay for mobile sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0 w-full max-h-[calc(100vh-40px)]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-2 md:px-4 py-3 bg-gradient-to-b from-background/20 to-background/40">
            <motion.div
              className="max-w-full md:max-w-3xl mx-auto space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {!listMessages.length ? (
                <motion.div
                  className="text-center py-16"
                  variants={itemVariants}
                >
                  <div className="text-4xl md:text-8xl font-serif text-[#991b1b]/60 mb-8">
                    無
                  </div>
                  <h2 className="text-xl md:text-3xl font-serif text-[#991b1b] mb-4">
                    {t.welcomeTitle}
                  </h2>
                  <p className="text-base md:text-lg font-serif text-[#991b1b]/70 italic px-4">
                    {t.welcomeSubtitle}
                  </p>
                </motion.div>
              ) : (
                <>
                  {listMessages.map(message => (
                    <motion.div
                      key={message.uuid}
                      variants={itemVariants}
                      className={`flex ${
                        message.role === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="flex items-start space-x-2 w-full max-w-[90%] md:max-w-[80%]">
                          <div className="flex-shrink-0 mt-1">
                            <Image
                              src="/images/wordless-sutra-icon.png"
                              alt="Wordless Sutra"
                              width={40}
                              height={40}
                              className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-3 md:p-4 rounded-2xl shadow-lg backdrop-blur-sm bg-[#f3ead7] text-[#1f1f1f] border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]">
                            <MarkdownRenderer content={message.content} />
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#2c2c2c]/20">
                              <div className="flex items-center space-x-1 md:space-x-2">
                                <button
                                  className="p-1.5 hover:bg-[#2c2c2c]/10 rounded-full transition-colors"
                                  title="Read aloud"
                                >
                                  <Volume2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#2c2c2c]/60" />
                                </button>
                                <button
                                  className="p-1.5 hover:bg-[#2c2c2c]/10 rounded-full transition-colors"
                                  title="Like"
                                >
                                  <ThumbsUp className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#2c2c2c]/60" />
                                </button>
                                <button
                                  className="p-1.5 hover:bg-[#2c2c2c]/10 rounded-full transition-colors"
                                  title="Dislike"
                                >
                                  <ThumbsDown className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#2c2c2c]/60" />
                                </button>
                                <button
                                  className="p-1.5 hover:bg-[#2c2c2c]/10 rounded-full transition-colors"
                                  title="Comment"
                                >
                                  <MessageCircle className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#2c2c2c]/60" />
                                </button>
                                <button
                                  className="p-1.5 hover:bg-[#2c2c2c]/10 rounded-full transition-colors"
                                  title="Copy"
                                >
                                  <Copy className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#2c2c2c]/60" />
                                </button>
                                <button
                                  className="p-1.5 hover:bg-[#2c2c2c]/10 rounded-full transition-colors"
                                  title="Share"
                                >
                                  <Share className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#2c2c2c]/60" />
                                </button>
                              </div>
                              {/* <p className="text-xs opacity-70 font-medium">
                              {new Date(message.created_at).toLocaleTimeString(
                                [],
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                },
                              )}
                            </p> */}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-[85%] md:max-w-[75%] p-3 md:p-4 rounded-2xl shadow-lg backdrop-blur-sm bg-[#f3ead7] text-[#1f1f1f] border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]">
                          <MarkdownRenderer content={message.content} />
                          <p className="text-xs opacity-70 mt-2 font-medium">
                            {/* {new Date(message.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })} */}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {displayedAIText && (
                    <motion.div
                      variants={itemVariants}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-2 w-full max-w-[90%] md:max-w-[80%]">
                        <div className="flex-shrink-0 mt-1">
                          <Image
                            src="/images/wordless-sutra-icon.png"
                            alt="Wordless Sutra"
                            width={40}
                            height={40}
                            className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-3 md:p-4 rounded-2xl shadow-lg backdrop-blur-sm bg-[#f3ead7] text-[#1f1f1f] border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]">
                          <MarkdownRenderer content={displayedAIText} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {isTyping && !displayedAIText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2 w-full max-w-[90%] md:max-w-[80%]">
                    <div className="flex-shrink-0 mt-1">
                      <Image
                        src="/images/wordless-sutra-icon.png"
                        alt="Wordless Sutra"
                        width={40}
                        height={40}
                        className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover"
                      />
                    </div>
                    <div className="bg-[#f3ead7] text-[#1f1f1f] border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset] p-3 md:p-4 rounded-2xl">
                      <div className="flex space-x-2">
                        <div
                          className="w-2 h-2 md:w-3 md:h-3 bg-[#2c2c2c] rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        ></div>
                        <div
                          className="w-2 h-2 md:w-3 md:h-3 bg-[#2c2c2c] rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        ></div>
                        <div
                          className="w-2 h-2 md:w-3 md:h-3 bg-[#2c2c2c] rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        ></div>
                      </div>
                      <p className="text-xs opacity-70 mt-2 font-medium">
                        {new Date().toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </motion.div>
          </div>

          {/* Input Area */}
          <div className="border-t border-[#991b1b]/20 backdrop-blur-sm p-2 md:p-4">
            <div className="max-w-full mx-auto">
              <div className="flex space-x-2 md:space-x-4">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*,text/*,.pdf,.doc,.docx"
                  // onChange={handleFileSelect}
                  className="hidden"
                />
                {/* Attach button */}
                <button
                  onClick={() =>
                    document.getElementById('file-upload')?.click()
                  }
                  disabled={isTyping}
                  className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#f3ead7] text-[#1f1f1f] rounded-2xl
                     border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                     hover:bg-[#efe2c9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Add files"
                >
                  <Paperclip className="w-3 h-3 md:w-4 md:h-4" />
                </button>

                {/* Text input */}
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={handleSubmit}
                  placeholder={t.placeholder}
                  className={`flex-1 bg-[#f3ead7] text-[#1f1f1f] placeholder-[#1f1f1f]/60 rounded-2xl px-3 py-2 md:px-6 md:py-3 text-sm md:text-base
                   border-2 border-[#2c2c2c]
                    `}
                  disabled={isTyping}
                />

                {/* Recording button */}
                <button
                  onClick={handleRecording}
                  disabled={isTyping}
                  className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl
           border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
           transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
             isRecording
               ? 'bg-red-500 text-white hover:bg-red-600'
               : 'bg-[#f3ead7] text-[#1f1f1f] hover:bg-[#efe2c9]'
           }`}
                  title={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  <Mic
                    className={`w-3 h-3 md:w-4 md:h-4 ${
                      isRecording ? 'animate-pulse' : ''
                    }`}
                  />
                </button>

                {/* Send Message Button */}
                <button
                  // onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#f3ead7] text-[#1f1f1f] rounded-2xl
             border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
             hover:bg-[#efe2c9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Buttons - Bottom Left - Only show on desktop */}
      <div className="hidden md:flex fixed bottom-6 left-6 z-40 items-center space-x-3">
        {/* Language Toggle Button */}
        <button
          onClick={() => setLanguage(prev => (prev === 'vi' ? 'en' : 'vi'))}
          className="flex items-center space-x-2 px-3 py-2 bg-[#f3ead7] text-[#1f1f1f] font-serif text-sm rounded-2xl
             border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
             hover:bg-[#efe2c9] transition-colors"
        >
          <span>{language === 'vi' ? 'ENG' : 'VIE'}</span>
        </button>

        {/* Sign In / Admin Panel Button */}
        {!isSignedIn ? (
          <button
            onClick={() => setShowSignIn(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#f3ead7] text-[#1f1f1f] font-serif text-sm rounded-2xl
               border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
               hover:bg-[#efe2c9] transition-colors"
          >
            <span>{t.signIn}</span>
            <span className="text-xs opacity-70">{t.saveHistory}</span>
          </button>
        ) : isAdmin ? (
          <Link
            href="/admin"
            className="flex items-center space-x-2 px-4 py-2 bg-[#f3ead7] text-[#1f1f1f] font-serif text-sm rounded-2xl
               border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
               hover:bg-[#efe2c9] transition-colors"
          >
            <span>{t.adminPanel}</span>
            <span className="text-xs opacity-70">{t.manageAndTrain}</span>
          </Link>
        ) : (
          <button
            onClick={() => setIsSignedIn(false)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#f3ead7] text-[#1f1f1f] font-serif text-sm rounded-2xl
               border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
               hover:bg-[#efe2c9] transition-colors"
          >
            <span>{t.signOut}</span>
            <span className="text-xs opacity-70">{t.clearSession}</span>
          </button>
        )}
      </div>

      {/* Sign-in Modal */}
      <AnimatePresence>
        {showSignIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSignIn(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#f3ead7] border-2 border-[#2c2c2c] rounded-xl md:rounded-2xl p-6 max-w-sm w-full shadow-[0_6px_0_#00000030]"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-serif text-[#2c2c2c] mb-3">
                  法
                </div>
                <h2 className="text-xl font-serif text-[#2c2c2c] mb-2 font-semibold">
                  {t.signInTitle}
                </h2>
                <p className="text-sm font-serif text-[#2c2c2c]/70">
                  {t.signInSubtitle}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIsSignedIn(true);
                    setIsAdmin(true);
                    setShowSignIn(false);
                  }}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-[#1877f2]/10 hover:bg-[#1877f2]/20 border-2 border-[#1877f2]/30 hover:border-[#1877f2]/50 rounded-xl transition-all duration-300 font-serif text-sm text-[#2c2c2c] shadow-[0_2px_0_#1877f230,0_0_0_2px_#1877f210_inset]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877f2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328L23.5 21.83h-2.796v8.385C19.612 23.027 24 18 24 12.073z" />
                  </svg>
                  <span>{t.continueWithFacebook}</span>
                </button>

                <button
                  onClick={() => {
                    setIsSignedIn(true);
                    setIsAdmin(true);
                    setShowSignIn(false);
                  }}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-[#db4437]/10 hover:bg-[#db4437]/20 border-2 border-[#db4437]/30 hover:border-[#db4437]/50 rounded-xl transition-all duration-300 font-serif text-sm text-[#2c2c2c] shadow-[0_2px_0_#db443730,0_0_0_2px_#db443710_inset]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#db4437">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>{t.continueWithGoogle}</span>
                </button>

                <button
                  onClick={() => {
                    setIsSignedIn(true);
                    setIsAdmin(true);
                    setShowSignIn(false);
                  }}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-[#000]/10 hover:bg-[#000]/20 border-2 border-[#000]/30 hover:border-[#000]/50 rounded-xl transition-all duration-300 font-serif text-sm text-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_2px_#00000010_inset]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#000">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001.017 0z" />
                  </svg>
                  <span>{t.continueWithTikTok}</span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#2c2c2c]/20"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[#f3ead7] px-2 text-[#2c2c2c]/60 font-serif">
                      or
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsSignedIn(true);
                    setIsAdmin(true);
                    setShowSignIn(false);
                  }}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-[#2c2c2c]/10 hover:bg-[#2c2c2c]/20 border-2 border-[#2c2c2c]/30 hover:border-[#2c2c2c]/50 rounded-xl transition-all duration-300 font-serif text-sm text-[#2c2c2c] shadow-[0_2px_0_#2c2c2c30,0_0_0_2px_#2c2c2c10_inset]"
                >
                  <span>{t.continueWithEmail}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
