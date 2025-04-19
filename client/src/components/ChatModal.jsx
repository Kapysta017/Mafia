import { useEffect, useState, useRef } from "react";
import { socket } from "../utils/socket";
import { Button } from "./Button";

export function ChatModal({ lobbyId, username }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    socket.emit("joinChat", lobbyId);

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("chatMessage", handleNewMessage);

    return () => {
      socket.off("chatMessage", handleNewMessage);
    };
  }, [lobbyId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      lobbyId,
      username,
      text: newMessage,
    };

    socket.emit("chatMessage", messageData);
    setNewMessage("");
  };

  return (
    <div className="chat_container">
      <div className="chat_button">
        <Button
          size="medium"
          variant="secondary"
          onClick={() => setChatOpen(!chatOpen)}
        >
          {chatOpen ? "Закрити чат" : "Відкрити чат"}
        </Button>
      </div>

      {chatOpen && (
        <div className="chat_window">
          <div className="chat_message" ref={chatRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className="message_item">
                <strong className="bc">{msg.username}:</strong>{" "}
                <div className="bc2">{msg.text}</div>
              </div>
            ))}
          </div>
          <div className="message_input">
            <input
              type="message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Повідомлення..."
            />
            <Button size="medium" variant="secondary" disabled>
              Місто спить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
