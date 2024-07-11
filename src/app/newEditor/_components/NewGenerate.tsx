import { useEffect, useState, useRef } from "react";
import { Zap } from "lucide-react";
import { Textarea } from "../../../components/ui/textarea";
import { api } from "../../../trpc/react";
import { useUser, useClerk } from "@clerk/nextjs";
import { AddFreeCredits, deductCredits } from "../../../lib/actions";
import Result from "./Result";

type GenerateProps = {
  onSVGComplete: (svg: string) => void;
};

export default function Generate({ onSVGComplete }: GenerateProps) {
  const [text, setText] = useState("");
  const { user } = useUser();
  const credits = user?.publicMetadata?.credits;
  const { session } = useClerk();

  const generateMutation = api.generate.create.useMutation();
  const convertMutation = api.convert.create.useMutation();
  const createHistoryMutation = api.history.create.useMutation();
  const cannotExecute = credits === 0 || credits === undefined;

  const handleFreeCredits = async () => {
    await AddFreeCredits();
    await session?.reload();
  };

  const [resultSrc, setResultSrc] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  function startHandler() {
    setIsLoading(true);
  }
  function finishHandler(url: string) {
    setResultSrc(url);
    setIsLoading(false);
  }

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (cannotExecute) return;
    startHandler();
    await deductCredits();
    const src = await generateMutation.mutateAsync({ prompt: text });

    const s3Url = await createHistoryMutation.mutateAsync({
      url: src,
      prompt: text,
    });

    finishHandler(s3Url);
    await session?.reload();
  };

  useEffect(() => {
    if (!user) return;
    const isNewUser = credits === undefined;
    if (isNewUser) {
      void handleFreeCredits();
    }
  }, [user]);
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <>
      {resultSrc !== "" || isLoading ? (
        <div className="flex h-full w-80 flex-col items-center">
          <div className="flex w-full transform flex-col items-center justify-center gap-24 rounded-[12px]  bg-white shadow-md">
            <Result
              onSVGComplete={onSVGComplete}
              isLoading={isLoading}
              imgSrc={resultSrc}
              imageRef={imgRef}
            ></Result>
          </div>
        </div>
      ) : (
        <div className=" flex h-full w-80 flex-col items-center gap-2 p-3">
          <Textarea
            onChange={(e) => {
              setText(e.target.value);
            }}
            className="h-20 bg-[#f6f6f6]"
          ></Textarea>
          <div className="flex w-full  flex-row justify-between">
            <button
              className={` flex items-center justify-center gap-1.5 rounded-md border-[1px] border-[#ebebeb] px-2 py-1.5 text-sm font-normal text-slate-500`}
            >
              <div>Credits</div>
              <div className="font-medium">
                {typeof credits === "number" ? credits : 0}
              </div>
            </button>
            <button
              onClick={handleClick}
              className={`${cannotExecute ? "cursor-not-allowed" : ""} flex flex-row items-center justify-center gap-1 rounded-md bg-[#f87171] px-2 py-1.5 text-sm font-normal text-white`}
            >
              Make it <Zap className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
