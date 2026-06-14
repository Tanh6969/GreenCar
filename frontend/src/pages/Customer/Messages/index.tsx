import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { chatService, Conversation } from "../../../services/chat.service";
import { useAuth } from "../../../hooks/useAuth";

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chatService.getConversations().then((data) => {
      setConversations(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#bbf7d0] border-t-[#006C4C] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-76px)] bg-[#F8F9FB] p-4 lg:p-6 flex justify-center">
      <div className="w-full max-w-[1300px] h-full bg-white rounded-2xl shadow-sm border border-[#BDCAC1] flex overflow-hidden">
        
        {/* LEFT SIDEBAR: List */}
        <div className="w-full md:w-[380px] border-r border-[#E5EBE8] flex flex-col bg-white flex-shrink-0">
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
                const isCnvOwner = user?.user_id === c.owner_id;
                const partnerName = isCnvOwner ? c.customer_name : c.owner_name;
                
                return (
                  <Link
                    key={c.conversation_id}
                    to={`/customer/messages/${c.booking_id}`}
                    className="flex items-center justify-between p-4 border-b border-[#F8F9FB] hover:bg-[#F8F9FB] transition border-l-4 border-l-transparent"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-12 h-12 rounded-full bg-[#E8F5F0] flex items-center justify-center text-[#006C4C] font-bold text-lg flex-shrink-0">
                        {partnerName?.charAt(0) || "U"}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-semibold text-sm text-[#191C1E] truncate">{partnerName}</h3>
                        <p className="text-xs text-[#006C4C] font-medium truncate mb-0.5">{c.vehicle_name}</p>
                        <p className={`text-xs truncate ${c.unread_count > 0 ? "font-bold text-[#191C1E]" : "text-[#6E7A72]"}`}>
                          {c.last_message || "Chưa có tin nhắn"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                      <span className="text-[10px] text-[#9CA3AF] font-medium">
                        {c.last_message_at ? new Date(c.last_message_at).toLocaleDateString("vi-VN") : ""}
                      </span>
                      {c.unread_count > 0 && (
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

        {/* RIGHT SIDE: Placeholder */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#F8F9FB] border-l border-white">
          <div className="w-24 h-24 rounded-full bg-[#E8F5F0] flex items-center justify-center mb-5 shadow-sm border border-[#A7F3D0]">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#006C4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-[#191C1E] mb-2">Tin nhắn GreenCar</h2>
          <p className="text-[#6E7A72] text-sm text-center max-w-[300px]">Chọn một cuộc trò chuyện ở danh sách bên trái để bắt đầu hoặc tiếp tục trò chuyện.</p>
        </div>

      </div>
    </div>
  );
};

export default MessagesPage;
