import { apiClient } from "./api";

export interface Conversation {
  conversation_id: number;
  booking_id: number;
  customer_id: number;
  owner_id: number;
  last_message_at: string;
  created_at: string;
  customer_name?: string;
  owner_name?: string;
  vehicle_name?: string;
  unread_count: number;
  last_message?: string;
}

export interface Message {
  message_id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
}

export const chatService = {
  async getConversations(): Promise<Conversation[]> {
    const data = await apiClient<Conversation[]>("/messages/conversations", "GET");
    return data ?? [];
  },

  async getConversationDetail(conversationId: number): Promise<{ conversation: Conversation; messages: Message[] } | null> {
    return await apiClient<{ conversation: Conversation; messages: Message[] }>(`/messages/${conversationId}`, "GET");
  },

  async sendMessage(conversationId: number, content: string): Promise<Message | null> {
    return await apiClient<Message>(`/messages/${conversationId}`, "POST", { content });
  },

  async sendMessageByBooking(bookingId: number, content: string): Promise<Message | null> {
    return await apiClient<Message>(`/messages/booking/${bookingId}`, "POST", { content });
  },
};
