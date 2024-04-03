"use client";
import { use, useEffect, useState } from "react";
import { api } from "../../../trpc/react";

type convertedResultType = {
  svg: string;
};

type ResultProps = {
  isLoading: boolean;
  imgSrc: string;
  imageRef: React.RefObject<HTMLImageElement>;
  onSVGComplete: (svg: string) => void;
};

//import isLoading
export default function Result({
  isLoading,
  imgSrc,
  imageRef,
  onSVGComplete,
}: ResultProps) {
  const [svg, setSVG] = useState("");

  const [isConverted, SetIsConverted] = useState(false);
  const [isConverting, SetIsConverting] = useState(false);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  const convert = api.convert.create.useMutation();

  const handleConvert = (event: React.MouseEvent) => {
    console.log("convert pressed");
    setClicked(true);
    SetIsConverting(true);

    void handleConvertAsync();
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    document.body.appendChild(link);
    const blob = new Blob([svg ?? ""], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "download.svg";

    link.click();
  };

  const handleConvertAsync = async () => {
    console.log(`image src is: ${imgSrc}`);
    const svgResponse = await convert.mutateAsync({ url: imgSrc });
    setSVG(svgResponse ?? "");
    onSVGComplete(svgResponse ?? "");

    SetIsConverted(true);
    SetIsConverting(false);
  };
  const [clicked, setClicked] = useState(false);

  const buttonClasses = `rounded-md border-black px-10 py-3 font-sans text-[14px] no-underline transition ${
    clicked ? "bg-white" : "bg-[#171717]"
  }`;

  const buttonStyle = {
    backgroundSize: "200% 100%",
    backgroundPosition: clicked ? "100% 0%" : "0% 0%",
    color: clicked ? "#171717" : "white",
    transition: "background-position 15s ease, color 15s ease",
  };

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fillProgressBar = () => {
      // Set the duration in milliseconds
      const duration = 15000; // 15 seconds
      const interval = 100; // Update interval

      const steps = duration / interval;
      const increment = 100 / steps;

      let currentProgress = 0;

      const timer = setInterval(() => {
        currentProgress += increment;
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          clearInterval(timer);
        }
      }, interval);

      return () => clearInterval(timer);
    };

    fillProgressBar();
  }, []);

  const [convertingProgress, setConvertingProgress] = useState(0);

  useEffect(() => {
    if (!isConverting) {
      return;
    }

    const fillProgressBar = () => {
      const interval = 100;
      const increment = 1;
      let currentProgress = 0;

      const timer = setInterval(() => {
        console.log(`convertingProgress: ${convertingProgress}`);
        currentProgress += increment;
        setConvertingProgress((prevProgress) => prevProgress + increment); // Use functional update
        if (currentProgress >= 100) {
          clearInterval(timer);
        }
      }, interval);

      return () => clearInterval(timer);
    };

    fillProgressBar();
  }, [isConverting]);

  return (
    <div id="imageContainer" className=" w-full p-4 ">
      {/* <div>{svg && <div dangerouslySetInnerHTML={{ __html: svg }}></div>}</div> */}
      <div
        className={` mb-12 flex flex-col items-center justify-center gap-10 rounded-md p-3`}
      >
        {!isLoading ? (
          <>
            <img
              ref={imageRef}
              className="object-contain"
              src={imgSrc}
              alt="result"
            />
            <div className="mb-8 text-[14px] font-normal text-[#666666]">
              You can either convert the result to{" "}
              <span className="font-semibold text-[#171717]">SVG format</span>,
              or <span className="font-semibold text-[#171717]">download</span>{" "}
              the image.
            </div>
          </>
        ) : (
          <div className="flex w-full flex-col">
            <div className="mb-[12px] text-center text-sm font-semibold text-[#171717]">
              Building the logo ...
            </div>
            <div className="relative mb-8 pt-1">
              <div className="flex h-3 overflow-hidden rounded-full">
                <div
                  style={{ width: `${progress}%` }}
                  className="flex flex-col justify-center whitespace-nowrap bg-teal-500 text-center text-white"
                ></div>
              </div>
            </div>

            <div className="rouned-md w-full ">
              <div className="flex flex-col border-[#eaeaea] bg-[#fafafa] p-4 pb-1 drop-shadow-xl  ">
                <div className=" text-[14px] font-semibold text-[#666666]  ">
                  💡 Tip
                </div>
                <div className="p-1.5 text-[14px]">
                  Being specific will result in a better output.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {!isLoading && (
        <>
          {/* {isConverting ? (
            <>
              <div className="relative mb-8 pt-1">
                <div className="flex h-3 overflow-hidden rounded-full">
                  <div
                    style={{ width: `${convertingProgress}%` }}
                    className="flex flex-col justify-center whitespace-nowrap bg-teal-500 text-center text-black"
                  >{`isConverting : ${isConverting}, convertingProgress : ${convertingProgress}`}</div>
                </div>
              </div>
            </>
          ) : null} */}
          <div className="absolute bottom-0 left-0 flex w-full justify-between gap-4 rounded-md bg-[#fafafa] p-4">
            {/* <button className="flex w-1/2 place-content-between gap-2 rounded-md border-2 border-black bg-[#89de8d] px-4 py-3 font-bold no-underline shadow-xl transition hover:bg-emerald-200">
        <select></select>
          
        </button> */}
            {isConverted ? (
              <button
                className="rounded-md border-[#383838] border-black bg-[#171717] px-10 py-3 font-sans text-[14px]  text-white no-underline transition  hover:border-[1px] hover:bg-[#383838]"
                onClick={handleDownload}
              >
                Download
              </button>
            ) : (
              <>
                <button
                  className={`${
                    isConverting ? "animate-bounce" : ""
                  } rounded-md border-black bg-[#171717] px-10 py-3 font-sans text-[14px] text-white  no-underline transition hover:border-[1px]  hover:border-[#383838] hover:bg-[#383838]`}
                  onClick={handleConvert}
                >
                  Convert
                </button>
              </>
            )}

            <button className="flex w-[131.53px] flex-col items-center justify-center rounded-md border-[1px] border-[#eaeaea] bg-white px-10 py-3 text-center font-sans text-[14px] text-black no-underline transition hover:cursor-not-allowed  hover:border-[1px] hover:border-[#383838]">
              Download
            </button>
          </div>
        </>
      )}
    </div>
  );
}
