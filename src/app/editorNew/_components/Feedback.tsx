"use client";
import { Textarea } from "../../../components/ui/textarea";
import { useState } from "react";
import { Meh, Smile, Frown } from "lucide-react";

type feedback = {
  feedbackString: string;
  emoji: "smile" | "meh" | "frown";
};

type FeedbackProps = {
  onFeedback: (feedback: feedback) => Promise<void>;
};
export const Feedback = ({ onFeedback }: FeedbackProps) => {
  const [feedbackString, setFeedbackString] = useState("");
  const [emoji, setEmoji] = useState<"smile" | "meh" | "frown">("smile");

  const submitFeedback = async () => {
    await onFeedback({ feedbackString, emoji });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="p-2">
        <Textarea
          placeholder="Your feedback..."
          value={feedbackString}
          onChange={(e) => {
            setFeedbackString(e.target.value);
          }}
        />
      </div>
      <div className="flex w-full flex-row justify-between bg-[#fafafa] p-3">
        <div className="flex  flex-row items-center gap-0.5">
          <div
            className={`flex items-center justify-center rounded-full p-1.5 hover:bg-[#dff0ff] ${emoji === "smile" ? "bg-[#dff0ff] stroke-[#0060f2]" : ""}`}
          >
            <button onClick={() => setEmoji("smile")}>
              <Smile
                className={` ${emoji === "smile" ? "stroke-[#0060f2]" : "stroke-[#8b8b8b]"}  hover:stroke-[#0060f2]`}
                width={"18"}
                height={"18"}
              />
            </button>
          </div>
          <div
            className={`flex items-center justify-center rounded-full p-1.5 hover:bg-[#dff0ff] ${emoji === "meh" ? "bg-[#dff0ff]" : ""}`}
          >
            <button onClick={() => setEmoji("meh")}>
              <Meh
                className={` ${emoji === "meh" ? "stroke-[#0060f2]" : "stroke-[#8b8b8b]"}  hover:stroke-[#0060f2]`}
                width={"18"}
                height={"18"}
              />
            </button>
          </div>
          <div
            className={`flex items-center justify-center rounded-full p-1.5 hover:bg-[#dff0ff] ${emoji === "frown" ? "bg-[#dff0ff]" : ""}`}
          >
            <button onClick={() => setEmoji("frown")}>
              <Frown
                className={` ${emoji === "frown" ? "stroke-[#0060f2]" : "stroke-[#8b8b8b]"}  hover:stroke-[#0060f2]`}
                stroke={`${emoji === "frown" ? "#0060f2" : "#8b8b8b"}`}
                width={"18"}
                height={"18"}
              />
            </button>
          </div>
        </div>
        <button
          className="rounded-sm bg-[#0f172a] px-3 py-1.5 text-sm text-white  hover:bg-[#262d3e]"
          onClick={() => {
            console.log("Run ");
            const result = submitFeedback();
            console.log(result);
            setFeedbackString("");
            setEmoji("smile");
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
  return <div></div>;
};
