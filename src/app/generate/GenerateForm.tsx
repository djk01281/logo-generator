import React, { useState } from "react";
import { api } from "~/trpc/react";
import { Button, LoadingButton } from "../../app/_components/Button";
import { Select } from "./components/Select";
import { ChatBubble, LoadingBubble } from "./components/Chat";

type GenerateFormProps = {
  onStart: () => void;
  onFinish: (value: string) => void;
};

const GenerateForm: React.FC<GenerateFormProps> = ({ onStart, onFinish }) => {
  const [formHistory, setFormHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [question, setQuestion] = useState("");
  const [input, setInput] = useState("");
  const [select, setSelect] = useState<string[]>([]);
  const [started, setStarted] = useState(false);

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const generateMutation = api.generate.create.useMutation();
  const createHistoryMutation = api.history.create.useMutation();
  const getPromptMutation = api.generate.getPrompt.useMutation();

  const handleSubmitAsync = async (prompt: string) => {
    onStart();
    const src = await generateMutation.mutateAsync({ prompt: prompt });
    const s3Url = await createHistoryMutation.mutateAsync({
      url: src,
      prompt: prompt,
    });
    onFinish(s3Url);
  };

  const updateFormWithResponse = (response: string) => {
    setQuestion(response);
    setFormHistory([
      ...formHistory,
      {
        role: "assistant",
        content: response,
      },
    ]);
    setInput("");
  };

  const getPromptAsync = async (
    formHistory: { role: string; content: string }[],
  ) => {
    console.log(formHistory);
    const questionResult = await getPromptMutation.mutateAsync(formHistory)!;
    if (questionResult) {
      if (questionResult.type === "answer") {
        await handleSubmitAsync(questionResult.response);
      } else if (questionResult.type === "select") {
        updateFormWithResponse(questionResult.response);
        setSelect([...questionResult.options!]);
      } else {
        updateFormWithResponse(questionResult.response);
        setSelect([]);
      }
    }
  };

  const handleBtnClick = async () => {
    setFormHistory([...formHistory, { role: "user", content: input }]);
    await getPromptAsync([...formHistory, { role: "user", content: input }]);
  };

  return !started ? (
    <Button
      text="start"
      fn={() => {
        setStarted(true);
        void getPromptAsync([]);
      }}
    ></Button>
  ) : (
    <div className="flex justify-center gap-4 font-sans font-normal">
      <div className="flex w-[492px] max-w-[80vw] flex-col gap-4 p-[40px] text-[13px] ">
        <div className="mb-[24px] text-[14px] font-normal text-[#171717]">
          {!getPromptMutation.isLoading ? (
            <div className="flex flex-col gap-8">
              <ChatBubble text={question} />
              <div className="mb-4">
                {select.length === 0 ? (
                  <textarea
                    onChange={(event) => handleInputChange(event.target.value)}
                    placeholder="Your Answer"
                    value={input}
                    className="w-full animate-fade-down resize-none rounded-[6px] border-[1px] border-[#eaeaea] p-[12px] text-[14px] font-normal outline-none ring-black animate-delay-500 animate-duration-[750ms] animate-once animate-ease-in animate-ease-out focus:border-black focus:ring-0 focus:ring-offset-0"
                  ></textarea>
                ) : (
                  <Select
                    selectArray={select}
                    selectCurrent={input}
                    selectFn={setInput}
                  />
                )}
              </div>
            </div>
          ) : (
            <LoadingBubble />
          )}
        </div>

        <div className="bg-[#fafafa]">
          <div className="absolute bottom-0 left-0 flex w-full justify-between rounded-[8px] bg-[#fafafa] p-4">
            {!getPromptMutation.isLoading ? (
              <Button
                text="next"
                fn={() => {
                  void handleBtnClick();
                }}
              />
            ) : (
              <LoadingButton />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateForm;
