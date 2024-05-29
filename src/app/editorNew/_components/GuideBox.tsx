import React from "react";
import { motion, AnimatePresence } from "framer-motion";
interface GuideboxProps {
  isOpened: boolean;
  guideIndex: number;
  guideLength: number;
  onNext: () => void;
  onSkip: () => void;
  guideTitle: string;
  guideDescription: string;
}

const Guidebox: React.FC<GuideboxProps> = ({
  isOpened,
  guideIndex,
  guideLength,
  onNext,
  onSkip,
  guideTitle,
  guideDescription,
}) => {
  if (!isOpened) {
    return null;
  }

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      whileInView={{ scale: 1 }}
      className="flex w-72 flex-col gap-2 rounded-lg bg-purple-500 p-4 text-sm text-white shadow-lg"
    >
      <div className="">
        {guideIndex} / {guideLength}
      </div>
      <div className="text-base font-semibold">{guideTitle}</div>
      <div>{guideDescription}</div>
      <div
        className={`mt-2 flex flex-row  ${guideIndex === guideLength ? "justify-end" : "justify-between"}`}
      >
        {guideIndex !== guideLength && (
          <button
            className="text-[#d9dafb] hover:text-purple-100"
            onClick={onSkip}
          >
            Skip
          </button>
        )}
        <button
          className="rounded-sm  bg-white p-1.5 px-2 text-indigo-500 hover:bg-indigo-100 hover:text-indigo-500"
          onClick={(e) => {
            onNext();
            e.stopPropagation();
          }}
        >
          {guideIndex === guideLength ? "Finish" : "Next"}
        </button>
      </div>
    </motion.div>
  );
};

export default Guidebox;
