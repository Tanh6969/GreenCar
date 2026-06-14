import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { chatService, Conversation, Message } from "../../../services/chat.service";
import { useAuth } from "../../../hooks/useAuth";

const MessageDetailPage: React.FC = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadData = () => {
    // Load conversations list for sidebar
    chatService.getConversations().then((data) => {
      setConversations(data);
    });

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

  const isOwner = user?.user_id === conversation?.owner_id;
  const partnerName = isOwner ? conversation?.customer_name : conversation?.owner_name;

  return (
    <div className="h-[calc(100vh-76px)] bg-[#F8F9FB] p-4 lg:p-6 flex justify-center">
      <div className="w-full max-w-[1300px] h-full bg-white rounded-2xl shadow-sm border border-[#BDCAC1] flex overflow-hidden">
        
        {/* LEFT SIDEBAR: List */}
        <div className="hidden md:flex w-[380px] border-r border-[#E5EBE8] flex-col bg-white flex-shrink-0">
          <div className="p-5 border-b border-[#E5EBE8] flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#191C1E]">Tin nhắn</h1>
            <span className="text-xs font-semibold bg-[#ECFDF5] text-[#006C4C] px-3 py-1 rounded-full">{conversations.length} cuộc trò chuyện</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-[#6E7A72] text-sm">
                Bạn chưa có cuộc trò chuyện nào.
              </div>
            ) : (
              conversations.map((c) => {
                const isActive = Number(bookingId) === c.booking_id;
                const isCnvOwner = user?.user_id === c.owner_id;
                const cPartnerName = isCnvOwner ? c.customer_name : c.owner_name;
                
                return (
                  <Link
                    key={c.conversation_id}
                    to={`/customer/messages/${c.booking_id}`}
                    className={`flex items-center justify-between p-4 border-b border-[#F8F9FB] transition ${isActive ? "bg-[#F0FDF4] border-l-4 border-l-[#006C4C]" : "hover:bg-[#F8F9FB] border-l-4 border-l-transparent"}`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-12 h-12 rounded-full bg-[#E8F5F0] flex items-center justify-center text-[#006C4C] font-bold text-lg flex-shrink-0">
                        {cPartnerName?.charAt(0) || "U"}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className={`font-semibold text-sm truncate ${isActive ? "text-[#006C4C]" : "text-[#191C1E]"}`}>{cPartnerName}</h3>
                        <p className={`text-xs font-medium truncate mb-0.5 ${isActive ? "text-[#006C4C]" : "text-[#006C4C]"}`}>{c.vehicle_name}</p>
                        <p className={`text-xs truncate ${c.unread_count > 0 && !isActive ? "font-bold text-[#191C1E]" : "text-[#6E7A72]"}`}>
                          {c.last_message || "Chưa có tin nhắn"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                      <span className="text-[10px] text-[#9CA3AF] font-medium">
                        {c.last_message_at ? new Date(c.last_message_at).toLocaleDateString("vi-VN") : ""}
                      </span>
                      {c.unread_count > 0 && !isActive && (
                        <span className="bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {c.unread_count}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Chat Area */}
        <div className="flex-1 flex flex-col bg-white w-full">
          {error ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#F8F9FB]">
              <p className="text-red-500 mb-4 font-semibold">{error}</p>
              <Link to="/customer/messages" className="text-[#006C4C] underline font-bold">Quay lại danh sách</Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="h-[76px] border-b border-[#E5EBE8] p-4 flex items-center justify-between bg-white z-10 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Link to="/customer/messages" className="md:hidden text-[#6E7A72] mr-2 hover:bg-[#F3F4F6] p-2 rounded-full transition">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </Link>
                  <div className="w-11 h-11 rounded-full bg-[#E8F5F0] flex items-center justify-center text-[#006C4C] font-bold text-xl flex-shrink-0">
                    {partnerName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h2 className="font-bold text-[#191C1E] text-base">{partnerName}</h2>
                    <p className="text-xs text-[#006C4C] font-medium mt-0.5">{conversation?.vehicle_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-full hover:bg-[#F3F4F6] flex items-center justify-center text-[#6E7A72] transition" title="Gọi điện">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </button>
                  <button className="w-10 h-10 rounded-full hover:bg-[#F3F4F6] flex items-center justify-center text-[#6E7A72] transition" title="Tùy chọn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                  </button>
                </div>
              </div>

              {/* Messages Content */}
              <div className="flex-1 bg-gradient-to-b from-[#F8F9FB] to-[#F3F4F6] p-5 overflow-y-auto flex flex-col gap-3">
                {messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-[#6E7A72]">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm text-[#BDCAC1]">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <p className="text-sm font-medium">Bắt đầu cuộc trò chuyện!</p>
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isMe = m.sender_id === user?.user_id;
                    const prevMsg = idx > 0 ? messages[idx - 1] : null;
                    const isSameSender = prevMsg && prevMsg.sender_id === m.sender_id;
                    
                    return (
                      <div key={m.message_id} className={`flex ${isMe ? "justify-end" : "justify-start"} ${isSameSender ? "mt-[-6px]" : "mt-2"}`}>
                        {!isMe && !isSameSender && (
                          <div className="w-8 h-8 rounded-full bg-[#E8F5F0] flex items-center justify-center text-[#006C4C] font-bold text-xs mr-2 self-end mb-1 shadow-sm flex-shrink-0">
                            {partnerName?.charAt(0) || "U"}
                          </div>
                        )}
                        {!isMe && isSameSender && <div className="w-8 mr-2 flex-shrink-0"></div>}
                        
                        <div
                          className={`max-w-[75%] px-4 py-2.5 shadow-sm group ${
                            isMe
                              ? "bg-gradient-to-br from-[#008A61] to-[#006C4C] text-white rounded-2xl rounded-br-sm"
                              : "bg-white border border-[#E5EBE8] text-[#191C1E] rounded-2xl rounded-bl-sm"
                          }`}
                        >
                          <p className="text-[14px] whitespace-pre-wrap leading-relaxed">{m.content}</p>
                          <p className={`text-[10px] mt-1 text-right transition-opacity ${isMe ? "text-[#bbf7d0]" : "text-[#9CA3AF]"}`}>
                            {new Date(m.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="h-[80px] bg-white border-t border-[#E5EBE8] px-4 py-3 flex-shrink-0">
                <form onSubmit={handleSend} className="flex gap-3 h-full items-center bg-[#F8F9FB] border border-[#E5EBE8] rounded-full px-2 py-1 focus-within:border-[#006C4C] focus-within:ring-2 focus-within:ring-[#006C4C]/20 transition-all">
                  <button type="button" className="text-[#9CA3AF] hover:text-[#006C4C] transition p-2 flex-shrink-0 ml-1 bg-white rounded-full shadow-sm" title="Đính kèm ảnh">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  </button>
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 bg-transparent border-none px-2 py-2 outline-none text-[#191C1E] text-[15px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={sending}
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={sending || !content.trim()}
                    className="bg-[#006C4C] hover:bg-[#005a3f] text-white w-10 h-10 rounded-full flex items-center justify-center transition disabled:opacity-50 disabled:bg-[#BDCAC1] flex-shrink-0 shadow-sm mr-1"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: -2, marginTop: 1 }}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageDetailPage;
