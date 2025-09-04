import { getBackEndUrl } from '@/configs/config';
import {
  Agent,
  CreateConversationProps,
  Message,
  Section,
  SendMessageProps,
} from '@/types';
import axios from 'axios';

const url = getBackEndUrl();
export const apiToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjVmMmU1ZTUtOGUxMi00MzU1LWE1MjYtYmM1MzQ2NGFlYTQwIiwiZXhwIjoxNzU2OTY0OTQ0LCJpYXQiOjE3NTY4Nzg1NDR9.2GwTHIg3q0Xkb5QUL_pHtRpmZOxsYt9zaoQ5M9v211I';

export const getConversations = async (
  offset: number = 0,
  limit: number = 20,
) => {
  const response = await axios({
    method: 'GET',
    url: `${url}/api/v1/sections`,
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    params: {
      offset,
      limit,
    },
  });
  return response.data as Section[];
};

export const getAgents = async (
  limit: number = 10,
  language: 'vi' | 'en' = 'vi',
) => {
  const response = await axios({
    method: 'GET',
    url: `${url}/api/v1/agents`,
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    params: {
      language,
      limit,
    },
  });
  return response.data as Agent[];
};

export const getMessages = async (chatId: string) => {
  const response = await axios({
    method: 'GET',
    url: `${url}/api/v1/sections/${chatId}/messages`,
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  return response.data as Message[];
};

export const sendMessage = async (data: SendMessageProps) => {
  const response = await fetch(`${url}/api/v1/chat/${data.session_id}/ask`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.body) {
    throw new Error('No response body');
  }

  // Example: Collect streamed text chunks
  const reader = response.body.getReader();
  let result = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += new TextDecoder().decode(value);
  }

  console.log('response:', result);

  return result;
};

export const createConversation = async (data: CreateConversationProps) => {
  const response = await axios({
    method: 'POST',
    url: `${url}/api/v1/sections`,
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    data,
  });
  return response.data as Section;
};
