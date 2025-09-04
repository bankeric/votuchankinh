export interface Section {
  agent_id: string;
  context: string | null;
  created_at: string;
  language: string;
  order: number;
  title: string;
  updated_at: string;
  uuid: string;
}

export interface Agent {
  agent_type: null;
  author: string;
  buddhist_focus: null;
  conversation_starters: [];
  corpus_id: null;
  created_at: string;
  description: string;
  language: 'vi' | 'en';
  model: string;
  name: string;
  status: string;
  system_prompt: string;
  tags: string[];
  temperature: number;
  tools: string;
  updated_at: string;
  uuid: string;
}

export interface Message {
  agent_id: string;
  content: string;
  created_at: string;
  dislike_user_ids: null | string[] | string;
  feedback: null | string;
  like_user_ids: null | string[];
  role: string;
  thought: null | string;
  uuid: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastMessage: Date;
}

export interface SimpleMessage {
  role: string;
  content: string;
  created_at: string;
}

export interface SendMessageProps {
  agent_id: string;
  context: string;
  language: 'vi' | 'en';
  messages: SimpleMessage[];
  options: { stream: boolean };
  session_id: string;
}

export interface CreateConversationProps {
  agent_id: string;
  language: 'vi' | 'en';
  messages: SimpleMessage[];
  uuid: string;
}
