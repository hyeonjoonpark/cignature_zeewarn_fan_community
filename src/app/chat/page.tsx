"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { useAuth } from "@/app/context/AuthContext";
import { Paperclip, Smile } from 'lucide-react';

const WS_URL = "wss://ws.postman-echo.com/raw";
const IDOL_NAME = "시그니쳐 지원";

const ChatPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{
    user: string;
    text: string;
    time: string;
    profileImageUrl?: string;
    attachment?: { fileName: string; fileUrl: string };
  }[]>([{
    user: IDOL_NAME,
    text: "안녕! 오랜만이야! 다들 잘 지냈어?",
    time: "오전 10:00",
  }, {
    user: user?.name || "익명",
    text: "와 지원님 오셨다!",
    time: "오전 10:01",
  }, {
    user: user?.name || "익명",
    text: "안녕하세요 지원님! 네 잘 지냈어요.",
    time: "오전 10:02",
  }, {
    user: IDOL_NAME,
    text: "다들 덕분에 잘 지내고 있어! 요즘 날씨가 갑자기 추워졌는데, 다들 감기 조심하고 따뜻하게 입고 다녀!",
    time: "오전 10:05",
  }, {
    user: "팬2",
    text: "지원님도 감기 조심하세요 ㅠㅠㅠㅠ",
    time: "오전 10:06",
  }, {
    user: user?.name || "익명",
    text: "맞아요! 따뜻한 차 많이 마시구요!",
    time: "오전 10:07",
  }, {
    user: IDOL_NAME,
    text: "응응 다들 너무 고마워 😊 아, 그리고 다음 주에 있을 팬미팅 이벤트 아이디어 혹시 있니? 뭐 하고 싶은 거 있으면 편하게 말해줘!",
    time: "오전 10:10",
  }, {
    user: "다른팬1",
    text: "헉 팬미팅! 사인회 하면 좋겠어요!",
    time: "오전 10:11",
  }, {
    user: "팬3",
    text: "아니면 같이 게임하는 건 어때요? 다같이 웃고 떠들 수 있는 걸로!",
    time: "오전 10:12",
  }, {
    user: user?.name || "익명",
    text: "저는 지원님 노래 부르는 거 라이브로 듣고 싶어요 ㅠㅠㅠ",
    time: "오전 10:13",
  }, {
    user: IDOL_NAME,
    text: "오~ 다들 좋은 아이디어 고마워! 다 참고할게! 역시 우리 팬들이 최고야 👍",
    time: "오전 10:15",
  }, {
    user: "팬2",
    text: "헤헤 지원님이 더 최고세요!",
    time: "오전 10:16",
  }, {
    user: "다른팬1",
    text: "오늘 점심 뭐 드셨어요?? 갑자기 궁금해졌어요!",
    time: "오전 11:30",
  }, {
    user: IDOL_NAME,
    text: "음... 오늘은 간단하게 샐러드 먹었지롱~🥗 다들 맛있는 점심 먹었니?",
    time: "오전 11:35",
  }, {
    user: "지원팬123",
    text: "와 건강 챙기시는군요! 저는 김치찌개 먹었어요!",
    time: "오전 11:36",
  }, {
    user: "팬3",
    text: "저는 빵으로 때웠어요 ㅠㅠㅠ",
    time: "오전 11:37",
  }, {
    user: IDOL_NAME,
    text: "빵도 맛있지만 끼니는 잘 챙겨 먹어야 해! 저녁은 꼭 든든하게 먹기 약속!",
    time: "오전 11:40",
  }, {
    user: "다른팬1",
    text: "네 약속! 지원님도요!",
    time: "오전 11:41",
  }, {
    user: user?.name || "익명",
    text: "지원님 혹시 최근에 재밌게 본 드라마나 영화 있어요?",
    time: "오후 1:00",
  }, {
    user: IDOL_NAME,
    text: "음... 요즘엔 바빠서 많이 못 보긴 했는데, 최근에 본 것 중에는 [첨부파일: 추천 드라마 목록.txt] 이거 정말 재밌었어!",
    time: "오후 1:05",
    profileImageUrl: '/images/idol-profile.jpg',
    attachment: { fileName: '추천 드라마 목록.txt', fileUrl: '/files/recommendations.txt' },
  }, {
    user: "팬2",
    text: "헉 바로 찾아볼게요!",
    time: "오후 1:06",
  }, {
    user: "다른팬1",
    text: "파일 첨부도 되는구나 신기하다!",
    time: "오후 1:07",
  }]);

  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toastShown = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && user === null && !toastShown.current) {
       toastShown.current = true;
       toast.error('로그인을 해주세요');
       setTimeout(() => {
         router.replace("/login");
       }, 1200);
     }
  }, [user, loading, router]);

  useEffect(() => {
     if (!loading && user && !nickname) {
        setNickname(user.name || '익명');
        setMessages(prevMessages => prevMessages.map(msg => 
           msg.user === "지원팬123" ? { ...msg, user: user.name || '익명' } : msg
        ));
     }
  }, [user, loading, nickname]);

  useEffect(() => {
    if (!loading && user && nickname && !ws) {
      console.log("Attempting WebSocket connection...");
      const socket = new WebSocket(WS_URL);
      setWs(socket);

      socket.onopen = () => {
        console.log("WebSocket connected.");
      };

      socket.onmessage = (e) => {
        console.log("Message from WS:", e.data);
        try {
           const msgObj = JSON.parse(e.data);
           setMessages((prev) => [...prev, msgObj]);
        } catch (error) {
           console.error("Failed to parse WebSocket message:", error);
        }
      };
      socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
        toast.error("WebSocket 연결 오류 발생!");
      };
      socket.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setWs(null);
        if (event.code !== 1000) {
           toast.error("WebSocket 연결이 종료되었습니다.");
        }
      }
      return () => {
        console.log("Cleaning up WebSocket connection.");
        if (socket.readyState === WebSocket.OPEN) {
           socket.close();
        }
      };
    } else if (loading === false && (!user || !nickname) && ws) {
       console.log("Closing WebSocket due to user state change.");
       ws.close();
       setWs(null);
    }
  }, [user, loading, nickname, ws]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (loading || !user || !nickname || !message.trim() || !ws) return;
    const msgObj = { user: user.name, text: message, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) };
    console.log("Sending message:", msgObj);
    ws.send(JSON.stringify(msgObj));
    setMessage("");
  };

  const handleAttachFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected for attachment:", file.name);
      const fileMessage = { user: nickname, text: `[파일 첨부: ${file.name}]`, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) };
      toast.success(`파일 '${file.name}' 첨부 준비 완료! (전송 로직 미구현)`);
      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
    }
  };

  const handleEmojiClick = () => {
    toast("이모티콘 선택 기능은 아직 준비 중입니다!");
  };

  if (loading) {
     return (
        <div className="flex justify-center items-center min-h-screen bg-[#F7F7FA]">
           <Toaster position="top-right" />
           <div className="text-xl font-bold text-[#2563eb]">로그인 상태 확인 중...</div>
        </div>
     );
  }

  if (!user) {
    return (
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'animate-slidein-right',
          style: {
            animation: 'slidein-right 0.5s cubic-bezier(0.4,0,0.2,1)'
          },
        }}
      />
    );
  }

  if (!nickname) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F7FA]">
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'animate-slidein-right',
            style: {
              animation: 'slidein-right 0.5s cubic-bezier(0.4,0,0.2,1)'
            },
          }}
        />
        <div className="text-xl font-bold text-[#2563eb]">입장 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'animate-slidein-right',
          style: {
            animation: 'slidein-right 0.5s cubic-bezier(0.4,0,0.2,1)'
          },
        }}
      />
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl flex flex-col h-[85vh] border border-gray-200">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shadow-sm bg-white rounded-t-xl">
          <button 
            onClick={() => router.push('/')}
            className="text-sm text-gray-600 hover:text-[#2563eb] transition-colors duration-200 focus:outline-none"
            aria-label="홈으로 가기"
          >
            &larr; 홈으로
          </button>
          <div className="text-xl font-bold text-[#2563eb] flex-1 text-center pr-16">
            지원과 팬들의 단체 채팅방
          </div>
          <div className="text-sm text-gray-600 pr-2">
            ({nickname})
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-7 space-y-4 bg-[#F7F7FA]">
          {messages.length === 0 && (
            <div className="text-gray-400 text-center mt-10">아직 메시지가 없습니다. 첫 메시지를 남겨보세요!</div>
          )}
          {messages.map((msg, idx) => {
            const isCurrentUser = msg.user === nickname;
            const isIdol = msg.user === IDOL_NAME;

            let bubbleClass = '';
            let textClass = '';
            let justifyClass = isCurrentUser ? 'justify-end' : 'justify-start';
            let roundedClass = '';
            let avatarContent = '';
            let avatarBgClass = '';

            if (isCurrentUser) { 
              bubbleClass = 'bg-[#2563eb]';
              textClass = 'text-white';
              roundedClass = 'rounded-tl-xl rounded-tr-2xl rounded-bl-xl rounded-br-2xl';
              avatarContent = nickname.charAt(0).toUpperCase();
              avatarBgClass = 'bg-[#2563eb]';
            } else if (isIdol) { 
              bubbleClass = 'bg-rose-200';
              textClass = 'text-gray-800';
              roundedClass = 'rounded-tl-2xl rounded-tr-xl rounded-bl-2xl rounded-br-xl';
              avatarContent = IDOL_NAME.charAt(0).toUpperCase();
               avatarBgClass = 'bg-pink-400';
            } else { 
              bubbleClass = 'bg-emerald-200';
              textClass = 'text-gray-800';
              roundedClass = 'rounded-tl-2xl rounded-tr-xl rounded-bl-2xl rounded-br-xl';
              avatarContent = msg.user.charAt(0).toUpperCase();
              avatarBgClass = 'bg-gray-400';
            }

            const avatarToShow = msg.profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={msg.profileImageUrl} alt={`${msg.user} profile`} className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className={`w-full h-full rounded-full flex items-center justify-center text-white text-sm font-medium ${avatarBgClass}`}>
                {avatarContent}
              </div>
            );

            return (
              <div key={idx} className={`flex ${justifyClass} items-start gap-2 mb-4`}>
                 {!isCurrentUser && (
                   <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 shadow-sm">
                     {avatarToShow}
                   </div>
                 )}
                <div className={`max-w-[75%] px-4 py-2 shadow-sm ring-1 ring-gray-100 ${bubbleClass} ${textClass} ${roundedClass} hover:shadow-md transition-shadow duration-200 ease-in-out flex flex-col`}>
                   <div className="text-xs mb-1 flex items-center">
                       <span className={`font-semibold mr-2 ${isCurrentUser ? 'text-gray-100' : 'text-gray-700'}`}>{msg.user}</span>
                       <span className={`text-[10px] ${isCurrentUser ? 'text-gray-300' : 'text-gray-500'}`}>{msg.time}</span>
                   </div>
                  {msg.attachment ? (
                    <div className="mt-1 flex items-center text-sm font-medium text-gray-800 bg-white rounded-lg p-2 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                       <Paperclip size={16} className="mr-1 text-gray-500" />
                       <a
                          href={msg.attachment.fileUrl}
                          download={msg.attachment.fileName}
                          className="underline text-blue-600 hover:text-blue-800"
                          onClick={(e) => e.stopPropagation()}
                       >
                          {msg.attachment.fileName}
                       </a>
                    </div>
                  ) : (
                    <div className="break-words whitespace-pre-wrap">{msg.text}</div>
                  )}
                </div>
                 {isCurrentUser && (
                   <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 shadow-sm">
                     {avatarToShow}
                   </div>
                 )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-200 flex items-center gap-3 bg-white rounded-b-xl">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleAttachFile}
          />
          <button
            className="p-2.5 text-gray-500 hover:text-[#2563eb] transition-colors duration-200 hover:scale-110 transform"
            onClick={() => fileInputRef.current?.click()}
            title="파일 첨부"
          >
            <Paperclip size={20} />
          </button>
          <button
            className="p-2.5 text-gray-500 hover:text-[#2563eb] transition-colors duration-200 hover:scale-110 transform"
            onClick={handleEmojiClick}
            title="이모티콘"
          >
            <Smile size={20} />
          </button>
          <input
            className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-black"
            placeholder="메시지를 입력하세요"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            maxLength={200}
            disabled={!ws || loading}
          />
          <button
            className="bg-[#2563eb] text-white rounded-full px-7 py-2.5 font-semibold hover:bg-[#1d4ed8] transition-colors duration-200 hover:scale-105"
            onClick={handleSend}
            disabled={!message.trim() || !ws || loading}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;

if (typeof window !== "undefined") {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes slidein-right {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slidein-right { animation: slidein-right 0.5s cubic-bezier(0.4,0,0.2,1); }
  `;
  if (!document.getElementById('slidein-right-keyframes-chat')) {
    style.id = 'slidein-right-keyframes-chat';
    document.head.appendChild(style);
  }
} 