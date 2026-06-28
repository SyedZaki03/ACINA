// Export default ChatMessage functional component rendering an individual message bubble
export default function ChatMessage({ sender, text }) {
  // Determine if the message was sent by the user (boolean flags)
  const isUser = sender === "user";
  
  return (
    // Render outer flexbox row aligned right for user messages and left for assistant messages
    <div className={`my-2 flex ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Render bubble with custom rounded borders, max width limits, and colors corresponding to sender status */}
      <div className={`px-4 py-2 rounded-lg max-w-md ${isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"}`}>
        {/* Render message string text inside container */}
        {text}
      </div>
    </div>
  );
}
