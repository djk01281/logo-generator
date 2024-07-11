import React, { use, useState } from "react";
import { api } from "~/trpc/react";
import { Button, LoadingButton } from "../../_components/Button";
import { Select } from "./Select";
import { ChatBubble, LoadingBubble } from "./Chat";
import { Zap } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { AddFreeCredits } from "~/lib/actions";
import { set } from "zod";

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

  const [noCredits, setNoCredits] = useState(false);

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
    const questionResult = await getPromptMutation.mutateAsync(formHistory);
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
    await session?.reload();
  };

  const handleBtnClick = async () => {
    setFormHistory([...formHistory, { role: "user", content: input }]);
    await getPromptAsync([...formHistory, { role: "user", content: input }]);
    await session?.reload();
  };

  const { user } = useUser();
  const { session } = useClerk();
  const credits = user?.publicMetadata?.credits;
  const isNewUser = credits === undefined;
  const handleFreeCredits = async () => {
    setNoCredits(false);
    await AddFreeCredits();
    await session?.reload();
  };

  return (
    <div className="w-full p-4">
      <div className="mx-1.5 mb-2 flex flex-row justify-between text-sm">
        {user && (
          <div className="flex flex-row items-center gap-0.5">
            <Zap size={"20"} stroke="#a855f7" />
            <div className="flex items-center justify-center text-slate-500">
              {`Credits : ${typeof credits === "number" ? credits : 0}`}
            </div>
          </div>
        )}
        {user && isNewUser && (
          <div>
            <button
              onClick={handleFreeCredits}
              className="rounded-sm bg-[#18181b] p-2 text-white hover:bg-slate-800"
            >
              Free Credits
            </button>
          </div>
        )}
      </div>
      {!started ? (
        <div className="flex w-full flex-col items-center justify-center  gap-1 rounded-md border-[1px] border-[#f87171] bg-red-100 p-3">
          <div className="font-[geist] font-bold text-rose-950">
            <span>&#x1F389;</span> Create Your Logos
          </div>
          <div className="mb-2 font-[geist] text-sm font-normal text-[2d2e32]">
            Out of Ideas? Create logos in minutes.
          </div>
          <Button
            text="start"
            fn={() => {
              if (typeof credits !== "number" || credits === 0) {
                setNoCredits(true);
                return;
              }

              setStarted(true);
              void getPromptAsync([]);
            }}
          ></Button>
        </div>
      ) : (
        <div className="flex justify-center gap-4 font-sans font-normal">
          <div className="flex w-80 flex-col gap-4 p-[40px] text-[13px] ">
            <div className="mb-[24px] text-[14px] font-normal text-[#171717]">
              {!getPromptMutation.isLoading ? (
                <div className="flex flex-col gap-8">
                  <ChatBubble text={question} />
                  <div className="flex flex-col gap-1">
                    {select.length === 0 ? (
                      <>
                        {" "}
                        <div className="flex h-3 overflow-hidden rounded-full">
                          <div
                            style={{
                              width: `${((input.length / 30) * 100).toFixed()}%`,
                            }}
                            className="flex flex-col justify-center whitespace-nowrap bg-teal-500 text-center text-white"
                          ></div>
                        </div>
                        <div className="relative">
                          <textarea
                            onChange={(event) =>
                              handleInputChange(event.target.value)
                            }
                            placeholder="Your Answer"
                            maxLength={30}
                            value={input}
                            className="animate-fade-down animate-delay-500 animate-duration-[750ms] animate-once animate-ease-in animate-ease-out relative w-full resize-none rounded-[6px] border-[1px] border-[#eaeaea] p-[12px] text-[14px] font-normal outline-none ring-black focus:border-black focus:ring-0 focus:ring-offset-0"
                          ></textarea>
                          <div className="absolute bottom-1.5 right-1.5 text-slate-500">{`${input.length}/30`}</div>
                        </div>
                      </>
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
      )}
      <div className="mt-2 flex items-center justify-end text-sm text-red-500">
        <div>{noCredits && "Please buy more credits."}</div>
      </div>
    </div>
  );
};

export default GenerateForm;
