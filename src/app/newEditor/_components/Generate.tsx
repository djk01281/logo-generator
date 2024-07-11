// import { useEffect, useState, useRef } from "react";
// import Result from "./Result";
// import GenerateForm from "./GenerateForm";

// type GenerateProps = {
//   onSVGComplete: (svg: string) => void;
// };

// export default function Generate({ onSVGComplete }: GenerateProps) {
//   const [resultSrc, setResultSrc] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   function startHandler() {
//     setIsLoading(true);
//   }
//   function finishHandler(url: string) {
//     setResultSrc(url);
//     setIsLoading(false);
//   }
//   const imgRef = useRef<HTMLImageElement>(null);

//   useEffect(() => {
//     if (resultSrc !== "") {
//       document.getElementById("imageContainer")?.focus();
//     }
//   }, [resultSrc]);

//   // if (status === "authenticated") {
//   if (true) {
//     return (
//       <>
//         <main className=" flex min-h-[80vh] w-full flex-col items-center ">
//           <div></div>
//           <div className="  mb-8 flex w-full transform flex-col items-center justify-center gap-24 rounded-[12px] border-[1px]  border-[#eaeaea] bg-white drop-shadow-2xl">
//             {resultSrc !== "" || isLoading ? (
//               <Result
//                 isLoading={isLoading}
//                 imgSrc={resultSrc}
//                 imageRef={imgRef}
//                 onSVGComplete={onSVGComplete}
//               ></Result>
//             ) : (
//               // (
//               //   <GenerateForm
//               //     onStart={startHandler}
//               //     onFinish={finishHandler}
//               //   ></GenerateForm>
//               // )
//               <Result
//                 isLoading={isLoading}
//                 imgSrc={resultSrc}
//                 imageRef={imgRef}
//                 onSVGComplete={onSVGComplete}
//               ></Result>
//             )}
//           </div>
//         </main>
//       </>
//     );
//   }
// }

import { useEffect, useState, useRef } from "react";
import Result from "./Result";
import GenerateForm from "./GenerateForm";

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
