import axiosInstance from '@/lib/axios';
import { Chat, CreateChatDto, UpdateChatDto, Message, CreateMessageDto } from '@/interfaces/chat';
import { DEFAULT_CHAT_LIMIT, DEFAULT_CHAT_PAGE } from '@/constants/chat';


class ChatService {
  private readonly BASE_URL = '/api/v1/sections';

  // Get all chats
  async getAll(page: number = DEFAULT_CHAT_PAGE): Promise<{ data: Chat[], totalCount: number }> {
    const limit = DEFAULT_CHAT_LIMIT;
    const offset = (page - 1) * limit;
    try {
      const { data, headers } = await axiosInstance.get<Chat[]>(`${this.BASE_URL}?offset=${offset}&limit=${limit}`);
      const totalCount = headers['x-total-count'];
      return { data, totalCount };
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  }

  // Get a single chat by ID
  async getById(id: string): Promise<Chat> {
    try {
      const { data } = await axiosInstance.get(`${this.BASE_URL}/${id}`);
      return data;
    } catch (error) {
      console.error(`Error fetching chat ${id}:`, error);
      throw error;
    }
  }

  // Create a new chat
  async create(chatData: CreateChatDto): Promise<Chat> {
    try {
      const { data } = await axiosInstance.post(this.BASE_URL, chatData);
      return data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  // Update a chat
  async update(id: string, chatData: UpdateChatDto): Promise<Chat> {
    try {
      const { data } = await axiosInstance.put(`${this.BASE_URL}/${id}`, chatData);
      return data;
    } catch (error) {
      console.error(`Error updating chat ${id}:`, error);
      throw error;
    }
  }

  // Delete a chat
  async delete(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting chat ${id}:`, error);
      throw error;
    }
  }

  // Get messages for a chat
  async getMessages(chatId: string): Promise<Message[]> {
    try {
      const { data } = await axiosInstance.get(`${this.BASE_URL}/${chatId}/messages`);
      return data;
    } catch (error) {
      console.error(`Error fetching messages for chat ${chatId}:`, error);
      throw error;
    }
  }

  // Send a message in a chat
  async sendMessage(chatId: string, messageData: CreateMessageDto): Promise<Message> {
    try {
      const { data } = await axiosInstance.post(`${this.BASE_URL}/${chatId}/messages`, messageData);
      return data;
    } catch (error) {
      console.error(`Error sending message in chat ${chatId}:`, error);
      throw error;
    }
  }

  // Reorder chats
  async reorder(chatIds: string[]): Promise<void> {
    try {
      await axiosInstance.post(`${this.BASE_URL}/reorder`, { chatIds });
    } catch (error) {
      console.error('Error reordering chats:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const chatService = new ChatService();


