type chatBubbleProps = {
  text: string;
};
export const ChatBubble = (chatBubbleProps: chatBubbleProps) => {
  return (
    <div>
      <span className="inline-block animate-fade-up rounded-xl bg-[#262628] p-4 font-mono text-white animate-once">
        {chatBubbleProps.text}
      </span>
    </div>
  );
};

export const LoadingBubble = () => {
  return (
    <div className="typing mb-8 animate-fade animate-delay-0 animate-duration-1000 animate-once animate-ease-in">
      <div className="typing__dot"></div>
      <div className="typing__dot"></div>
      <div className="typing__dot"></div>
    </div>
  );
};
