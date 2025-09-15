import axiosInstance from '@/lib/axios';
import { Message, ChatMode, ApprovalStatus } from '@/interfaces/chat';
import { QAndAPair } from '@/interfaces/question-answer';

export interface GetMessagesParams {
  limit?: number;
  agent_id?: string;
  include_related?: boolean;
  offset?: number;
  approval_status?: ApprovalStatus;
}

export interface MessagesResponse {
  data: Message[];
  totalCount?: number;
}

class MessagesService {
  private readonly BASE_URL = '/api/v1/messages';

  // Get messages with optional filters
  async getMessages(params: GetMessagesParams = {}): Promise<MessagesResponse> {
    const { limit = 10, agent_id, include_related = false, offset = 0, approval_status } = params;
    
    try {
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append('limit', limit.toString());
      if (agent_id) queryParams.append('agent_id', agent_id);
      if (include_related) queryParams.append('include_related', 'true');
      if (offset) queryParams.append('offset', offset.toString());
      if (approval_status) queryParams.append('approval_status', approval_status);

      const { data } = await axiosInstance.get<{messages: Message[], count: number}>(
        `${this.BASE_URL}?${queryParams.toString()}`
      );
      return { data: data.messages, totalCount: data.count }
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Get messages by mode
  async getMessagesByAgentId(agent_id: string, limit: number = 10): Promise<MessagesResponse> {
    return this.getMessages({ agent_id, limit, include_related: true });
  }

  // Get a single message by ID
  async getMessageById(id: string): Promise<Message> {
    try {
      const { data } = await axiosInstance.get<Message>(`${this.BASE_URL}/${id}`);
      return data;
    } catch (error) {
      console.error(`Error fetching message ${id}:`, error);
      throw error;
    }
  }

  // Create a new message
  async createMessage(messageData: Partial<Message>): Promise<Message> {
    try {
      const { data } = await axiosInstance.post<Message>(this.BASE_URL, messageData);
      return data;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  // Update a message
  async updateMessage(id: string, messageData: Partial<Message>): Promise<Message> {
    try {
      const { data } = await axiosInstance.put<Message>(`${this.BASE_URL}/${id}`, messageData);
      return data;
    } catch (error) {
      console.error(`Error updating message ${id}:`, error);
      throw error;
    }
  }

  // Delete a message
  async deleteMessage(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting message ${id}:`, error);
      throw error;
    }
  }

  // Get messages with pagination
  async getMessagesWithPagination(page: number = 1, limit: number = 10, agent_id?: string): Promise<MessagesResponse> {
    const offset = (page - 1) * limit;
    return this.getMessages({ limit, agent_id, offset });
  }

  async saveQAndAPairsToSystem(qAndAPairs: QAndAPair[]): Promise<void> {
    try {
      await axiosInstance.post(`${this.BASE_URL}/save-q-and-a-pairs-to-system`, {
        qAndAPairs,
      });
    } catch (error) {
      console.error('Error saving Q&A pairs to system:', error);
      throw error;
    }
  }

  // Like a message
  async likeMessage(messageId: string): Promise<Message> {
    try {
      const { data } = await axiosInstance.post<{data: Message}>(`${this.BASE_URL}/${messageId}/like`);
      return data.data;
    } catch (error) {
      console.error(`Error liking message ${messageId}:`, error);
      throw error;
    }
  }

  // Dislike a message
  async dislikeMessage(messageId: string): Promise<Message> {
    try {
      const { data } = await axiosInstance.post<{data: Message}>(`${this.BASE_URL}/${messageId}/dislike`);
      return data.data;
    } catch (error) {
      console.error(`Error disliking message ${messageId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const messagesService = new MessagesService(); 