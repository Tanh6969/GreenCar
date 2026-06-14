import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { chatService, Conversation, Message } from "../../../services/chat.service";
import { useAuth } from "../../../hooks/useAuth";

const MessageDetailPage: React.FC = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadData = () => {
    if (!bookingId) return;
    chatService.getConversationDetail(Number(bookingId))
      .then((data) => {
        if (data) {
          setConversation(data.conversation);
          setMessages(data.messages);
        } else {
          setError("Không tìm thấy cuộc trò chuyện");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Đã xảy ra lỗi");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
    // In a real app, we'd use WebSocket. Here we'll just poll every 5 seconds.
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth"
        });
      }
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !bookingId) return;
    
    setSending(true);
    try {
      const newMsg = await chatService.sendMessage(Number(bookingId), content);
      if (newMsg) {
        setMessages([...messages, newMsg]);
        setContent("");
      }
    } catch (err: any) {
      alert(err.message || "Lỗi gửi tin nhắn");
    } finally {
      setSending(false);
    }
  };

  if (loading && !conversation) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#bbf7d0] border-t-[#006C4C] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/customer/messages" className="text-[#006C4C] underline font-bold">Quay lại</Link>
      </div>
    );
  }

  const isOwner = user?.user_id === conversation?.owner_id;
  const partnerName = isOwner ? conversation?.customer_name : conversation?.owner_name;

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-8">
      <div className="max-w-[800px] mx-auto px-4 h-[calc(100vh-140px)] flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-t-xl border border-[#BDCAC1] p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <Link to="/customer/messages" className="text-[#6E7A72] hover:text-[#191C1E] font-bold">
              &lt; Trở về
            </Link>
            <div className="w-10 h-10 rounded-full bg-[#E8F5F0] flex items-center justify-center text-[#006C4C] font-bold text-lg">
              {partnerName?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="font-bold text-[#191C1E]">{partnerName}</h2>
              <p className="text-xs text-[#6E7A72]">Xe: {conversation?.vehicle_name}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white border-x border-[#BDCAC1] p-4 overflow-y-auto flex flex-col gap-3">
          {messages.map((m) => {
            const isMe = m.sender_id === user?.user_id;
            return (
              <div key={m.message_id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                    isMe
                      ? "bg-[#006C4C] text-white rounded-tr-sm"
                      : "bg-[#F0F0F0] text-[#191C1E] rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? "text-[#bbf7d0]" : "text-[#6E7A72]"}`}>
                    {new Date(m.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white rounded-b-xl border border-[#BDCAC1] p-4 shadow-sm">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-[#F8F9FB] border border-[#E5EBE8] rounded-xl px-4 py-2 outline-none focus:border-[#006C4C] transition"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !content.trim()}
              className="bg-[#006C4C] hover:bg-[#005a3f] text-white px-6 py-2 rounded-xl font-bold transition disabled:opacity-50"
            >
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailPage;
