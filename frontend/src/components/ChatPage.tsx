import { useState, useEffect } from "react";
import socket from "../socket";

interface Message {
    text: string;
}

function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("")

    useEffect(() => {
        socket.on("message", (data: string) => {
            setMessages((prev) => [...prev, { text: data }]);
        })

        return () => {
            socket.off("message");
        }

    }, [])

    const sendMessage = () => {
        if (input === "") return;
        socket.emit("message", input);
        setInput("");
    }


  return (
    <div className="flex h-screen bg-[#36393f] text-white">
      {/* サイドバー */}
      <div className="w-16 bg-[#202225] p-2 flex flex-col gap-2">
        <div className="w-12 h-12 bg-[#5865f2] rounded-full flex items-center justify-center text-sm">
          S
        </div>
      </div>

      {/* チャンネル */}
      <div className="w-48 bg-[#2f3136] p-3 flex flex-col gap-2">
        <p className="text-[#8e9297] text-xs font-bold uppercase mb-2">チャンネル</p>
        <p className="hover:bg-[#393c43] px-2 py-1 rounded cursor-pointer"># general</p>
        <p className="hover:bg-[#393c43] px-2 py-1 rounded cursor-pointer"># random</p>
      </div>

      {/* チャットエリア */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {messages.map((msg, i) => (
            <p key={i} className="text-white">
              <span className="font-bold text-[#5865f2] mr-2">ユーザー</span>
              {msg.text}
            </p>
          ))}
        </div>

        {/* 入力エリア */}
        <div className="p-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="メッセージを入力..."
            className="flex-1 px-4 py-2 rounded bg-[#40444b] text-white placeholder-[#72767d] outline-none"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] rounded text-white transition"
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;