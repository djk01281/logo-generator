"use client";
import { GetSessionParams, useSession } from "next-auth/react";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import Result from "../editorNew/_components/Result";
import { redirect } from "next/navigation";
import GenerateForm from "../editorNew/_components/GenerateForm";

type GenerateProps = {
  onSVGComplete: (svg: string) => void;
};

export default function Generate({ onSVGComplete }: GenerateProps) {
  const [resultSrc, setResultSrc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  function startHandler() {
    setIsLoading(true);
  }
  function finishHandler(url: string) {
    setResultSrc(url);
    setIsLoading(false);
  }
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (resultSrc !== "") {
      document.getElementById("imageContainer")?.focus();
    }
  }, [resultSrc]);

  // if (status === "authenticated") {
  if (true) {
    return (
      <>
        <main className=" flex h-full w-80 flex-col items-center ">
          <div></div>
          <div className="  flex w-full transform flex-col items-center justify-center gap-24 rounded-[12px]  bg-white shadow-md">
            {resultSrc !== "" || isLoading ? (
              <Result
                onSVGComplete={onSVGComplete}
                isLoading={isLoading}
                imgSrc={resultSrc}
                imageRef={imgRef}
              ></Result>
            ) : (
              <GenerateForm
                onStart={startHandler}
                onFinish={finishHandler}
              ></GenerateForm>
            )}
          </div>
        </main>
      </>
    );
  }
}

// export async function getServerSideProps(context: GetSessionParams) {
//   const session = await getSession(context);
//   if (!session) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: { session },
//   };
// }
