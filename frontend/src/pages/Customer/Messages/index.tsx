import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { chatService, Conversation } from "../../../services/chat.service";

const MessagesPage: React.FC = () => {
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
    <div className="min-h-screen bg-[#F8F9FB] py-8">
      <div className="max-w-[1000px] mx-auto px-4">
        <h1 className="text-2xl font-bold text-[#191C1E] mb-6">Tin nhắn của tôi</h1>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#BDCAC1] p-10 text-center text-[#6E7A72]">
            <p>Bạn chưa có cuộc trò chuyện nào.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#BDCAC1] overflow-hidden shadow-sm">
            {conversations.map((c) => (
              <Link
                key={c.conversation_id}
                to={`/customer/messages/${c.booking_id}`}
                className="flex items-center justify-between p-4 border-b border-[#F0F0F0] hover:bg-[#F8F9FB] transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#E8F5F0] flex items-center justify-center text-[#006C4C] font-bold text-xl flex-shrink-0">
                    {c.owner_name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#191C1E]">{c.owner_name} - {c.vehicle_name}</h3>
                    <p className={`text-sm mt-0.5 truncate max-w-[400px] ${c.unread_count > 0 ? "font-semibold text-[#191C1E]" : "text-[#6E7A72]"}`}>
                      {c.last_message || "Chưa có tin nhắn"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-[#6E7A72]">
                    {c.last_message_at ? new Date(c.last_message_at).toLocaleDateString("vi-VN") : ""}
                  </span>
                  {c.unread_count > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {c.unread_count}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
