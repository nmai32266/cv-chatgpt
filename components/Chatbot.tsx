
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Xin chào! Tôi là trợ lý Voltria. Tôi có thể giúp gì cho bạn trong việc định hướng sự nghiệp và sử dụng nền tảng hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getApiKey = (): string => {
    const key = (import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY) as string | undefined;
    if (!key) {
      throw new Error("OpenAI API Key chưa được cấu hình!");
    }
    return key;
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg = text.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = getApiKey();
      
      // Build conversation history for OpenAI
      const conversationHistory = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const requestBody = {
        model: "gpt-5-nano",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: `Bạn là trợ lý ảo của Voltria - nền tảng phân tích CV và định hướng sự nghiệp AI. 
Hãy trả lời ngắn gọn, thân thiện. 
Hướng dẫn sử dụng chính:
1. Nhấp "Phân Tích CV Ngay" để bắt đầu.
2. Tải lên file PDF hoặc Ảnh CV.
3. Nhập vị trí mong muốn.
4. Nhận kết quả phân tích: Điểm mạnh, điểm yếu, lộ trình khóa học (Core Courses) và dự án.
5. Bạn có thể lưu các hoạt động này vào mục "Hoạt động".
Nếu người dùng hỏi về khóa học, hãy nói về 25 khóa học Core Value của Voltria giúp nâng cấp kỹ năng.
Tất cả câu trả lời phải bằng tiếng Việt.`
              }
            ]
          },
          ...conversationHistory.map(msg => ({
            role: msg.role,
            content: [
              {
                type: "input_text",
                text: msg.content
              }
            ]
          })),
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: userMsg
              }
            ]
          }
        ],
        store: true
      };

      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || response.statusText);
      }

      const data = await response.json();

      if (data.status !== "completed") {
        throw new Error(`API chưa hoàn thành: ${data.status}`);
      }

      const messageOutput = data.output?.find(
        (item: any) => item.type === "message" && item.status === "completed"
      );

      if (!messageOutput) {
        throw new Error("Không tìm thấy message output trong response");
      }

      const textContent = messageOutput.content?.find(
        (item: any) => item.type === "output_text"
      );

      const botResponse = textContent?.text || 'Xin lỗi, tôi gặp chút trục trặc. Bạn thử lại nhé!';
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Có lỗi kết nối. Hãy đảm bảo bạn đã cấu hình OpenAI API Key đúng cách.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Cách quét CV?",
    "Lộ trình là gì?",
    "Khóa học Voltria",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-[2rem] shadow-2xl border border-purple-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Voltria Assistant</h3>
                <p className="text-[10px] text-purple-100 uppercase tracking-widest font-bold">Online Support</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-gray-50 bg-white">
            {quickPrompts.map((p, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-100 hover:bg-purple-100 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-4 bg-white border-t border-gray-100 flex gap-2"
          >
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập thắc mắc của bạn..."
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-purple-600 text-white p-2.5 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative h-14 w-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 ${
          isOpen ? 'bg-gray-900 rotate-90' : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20 group-hover:opacity-40"></div>
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageSquare className="w-6 h-6 text-white" />}
        
        {!isOpen && (
          <div className="absolute right-full mr-4 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Cần hỗ trợ? Chat ngay
          </div>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
