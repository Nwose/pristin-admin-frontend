import React, { useState } from "react";
import { MessageCircle, Send } from "lucide-react";

export default function CustomerCareChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "agent",
      text: "Hello Samuel 👋\nHow can we assist you today?",
      time: new Date(),
    },
    {
      id: 2,
      sender: "user",
      text: "Hi, I have a question about my loan application.",
      time: new Date(),
    },
    {
      id: 3,
      sender: "agent",
      text: "Sure! Could you please provide your loan ID or a bit more detail?",
      time: new Date(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "user",
        text: inputMessage,
        time: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="text-teal-600" size={28} />
            <h1 className="text-2xl font-semibold text-gray-800">
              Customer Care Live Chat
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Get instant assistance from our support team by chatting live. Our
            representatives are available 24/7 to assist you.
          </p>
        </div>

        {/* Agent Info */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-sm">SA</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Support (Agent 2025)
              </h3>
              <p className="text-xs text-gray-500">
                Typically replies within a minute
              </p>
            </div>
          </div>
          <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
        </div>

        {/* Chat Messages */}
        <div className="p-6 space-y-4 h-96 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-sm">
                  {message.sender === "user" ? "S" : "SA"}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-md px-4 py-3 rounded-lg whitespace-pre-line ${
                  message.sender === "user"
                    ? "bg-teal-600 text-white rounded-tr-none"
                    : "bg-gray-200 text-gray-800 rounded-tl-none"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
            >
              <Send size={18} />
              Send
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 text-center text-gray-500 text-sm border-t border-gray-200">
          © 2025 Fintech Dashboard
        </div>
      </div>
    </div>
  );
}
