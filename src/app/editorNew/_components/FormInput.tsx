import React, { useState, useRef, useEffect } from "react";

type GenerateFormProps = {
  label: string;
  onSelect: (value: string) => void;
  type: string;
  toggle: boolean;
  options: string[];
  formInfo: formInfosType;
  setValid: (bool: boolean) => void;
  selectedInit: string;
};

type formInfosType = {
  title: string;
  instructions: string;
  label: string;
  type: string;
  options: string[];
  placeholder: string;
};

type toolTips = {
  Minimalistic: string;
  "Pop Art": string;
  "Rococo Art": string;
};
const toolTips: toolTips = {
  Minimalistic:
    "https://th.bing.com/th/id/OIG.I6AALceofYRjoAGQ1Pfs?w=1024&h=1024&rs=1&pid=ImgDetMain",
  "Pop Art": "https://cdn.discordapp.co",
  "Rococo Art": "httpsoaidalleapiprodsc",
};

const FormInput: React.FC<GenerateFormProps> = ({
  label,
  type,
  toggle,
  options,
  selectedInit,
  formInfo,
  setValid,
  onSelect,
}) => {
  const [isOn, setIsOn] = useState(toggle);
  const value = selectedInit;
  const inputChange = (value: string) => {
    onSelect(value);

    if (!isOn || (isOn && value !== "")) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  return (
    <div className="max-w-1/3 flex flex-col gap-2 font-sans font-bold">
      <div className="flex justify-end gap-2">
        {/* <Toggle
          initial={toggle}
          onToggle={(value) => {
            setIsOn(value);

            inputChange("");
          }}
        ></Toggle> */}
      </div>
      {type === "text" ? (
        <textarea
          onChange={(event) => inputChange(event.target.value)}
          disabled={!isOn}
          placeholder={formInfo.placeholder}
          className="w-full resize-none rounded-[6px] border-[1px] border-[#eaeaea] p-[12px] text-[14px] font-normal outline-none ring-black focus:border-black focus:ring-0 focus:ring-offset-0"
        ></textarea>
      ) : (
        <Dropdown
          options={options}
          onDropdownChange={(value) => inputChange(value)}
          initial={label}
          disabled={!isOn}
        ></Dropdown>
      )}
    </div>
  );
};

// type ToggleProps = {
//   initial: boolean;
//   onToggle: (inOn: boolean) => void;
// };

// const Toggle: React.FC<ToggleProps> = ({ initial, onToggle }) => {
//   const [isOn, setIsOn] = useState(initial);
//   const handleToggle = (event: React.MouseEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     if (isOn === true) {
//       setIsOn(false);
//     } else {
//       setIsOn(true);
//     }
//     onToggle(!isOn);
//   };

//   return (
//     <div
//       onClick={handleToggle}
//       className={`flex w-16 items-center justify-between rounded-full px-1.5 text-sm duration-75 ${
//         isOn ? "bg-red-400" : "bg-slate-400"
//       }`}
//     >
//       {isOn ? (
//         <>
//           <span>ON</span>
//           <div className="h-4 w-4 rounded-full bg-white" />
//         </>
//       ) : (
//         <>
//           <div className="h-4 w-4 rounded-full bg-white" />
//           <span>OFF</span>
//         </>
//       )}
//     </div>
//   );
// };

type ToggleProps = {
  initial: boolean;
  onToggle: (isOn: boolean) => void;
};

const Toggle: React.FC<ToggleProps> = ({ initial, onToggle }) => {
  const handleToggle = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setCurrent(!current);
    onToggle(current);
  };
  const [current, setCurrent] = useState(initial);

  return (
    <div
      onClick={handleToggle}
      className={`flex w-[3.2rem] items-center justify-between rounded-full border-[1px] border-black px-[4px] py-[2px] font-sans text-sm duration-300 ${
        current ? "bg-red-400" : "bg-slate-400"
      }`}
      style={{
        transition: "background-color 0.3s",
        flexDirection: current ? "row" : "row-reverse", // Change flex direction based on the toggle state
      }}
    >
      <span
        className={`text-xs font-semibold ${
          current ? "text-white" : "text-black"
        }`}
      >
        {current ? "ON" : "OFF"}
      </span>
      <div
        className="h-4 w-4 rounded-full border-[1px] border-black bg-white"
        style={{
          transition: "transform 0.3s",
          transform: current ? "translateX(3px)" : "translateX(-3px)",
        }}
      />
    </div>
  );
};

type DropdownProps = {
  options: string[];
  onDropdownChange: (value: string) => void;
  initial: string;
  disabled: boolean;
};

const Dropdown: React.FC<DropdownProps> = ({
  options,
  onDropdownChange,
  initial,
  disabled,
}) => {
  const [selected, setSelected] = useState(initial);
  const [opened, setOpened] = useState(false);

  const handleSelectedChange = (value: string) => {
    onDropdownChange(value);
    setSelected(value);
    setOpened(false);
  };

  const ref = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (
    event: MouseEvent,
    ref: React.RefObject<HTMLDivElement | null>,
  ) => {
    // Check if the clicked element is outside the ref
    if (ref.current && !ref.current.contains(event.target as Node)) {
      // Do something when a click happens outside the ref
      setOpened(false);
    }
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (opened) {
      setOpened(false);
    } else {
      setOpened(true);
    }

    event.preventDefault();
  };
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      handleClickOutside(event, ref);
    };

    // Add event listener when component mounts
    document.addEventListener("mousedown", handleDocumentClick);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [ref]);

  const [showTooltip, setShowTooltip] = useState("");

  const handleMouseEnter = (option: string) => {
    if (Object.keys(toolTips).includes(option)) setShowTooltip(option);
  };

  const handleMouseLeave = () => {
    setShowTooltip("");
  };

  return (
    <div ref={ref} className=" flex w-full flex-col gap-2">
      <div
        onClick={(event) => {
          handleOpen(event);
        }}
        className={`flex justify-between border-[1px] border-black bg-white p-1.5 font-normal hover:shadow-xl ${
          opened ? "shadow-xl" : ""
        }`}
      >
        <div>{selected}</div>
        <div className="flex items-center">
          {opened ? (
            <svg
              className="ms-3 h-2.5 w-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="m1 5 4-4 4 4"
              />
            </svg>
          ) : (
            <svg
              className="ms-3 h-2.5 w-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="m1 1 4 4 4-4"
              />
            </svg>
          )}
        </div>
      </div>
      {opened ? (
        <div className="border-[1px] border-black bg-white font-normal shadow-xl">
          {options.map((option) => {
            return (
              <div
                className="relative flex p-1.5 hover:bg-black hover:text-white"
                key={option}
                onClick={(event) => {
                  event.preventDefault();
                  handleSelectedChange(option);
                }}
                onMouseEnter={(event) => {
                  event.preventDefault();
                  handleMouseEnter(option);
                }}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex w-full justify-between">
                  <div>{option}</div>
                  {selected === option && (
                    <div className="font-semibold">V</div>
                  )}
                </div>
                {showTooltip === option &&
                  Object.keys(toolTips).includes(option) && (
                    <div className="absolute left-full w-full translate-x-4 translate-y-[-0.5rem] transform rounded border-2 border-black bg-white bg-white p-2 text-black">
                      <div className="relative flex flex-col gap-2">
                        <div className="w-full text-xs font-semibold">
                          {option}
                        </div>
                        {/* <img src={toolTips.option}></img> */}
                        <div className="absolute bottom-1/2 right-full top-1 h-0 w-0 translate-x-[-0.5rem] transform border-b-[5px] border-r-[7.5px] border-t-[5px] border-b-transparent border-r-black border-t-transparent"></div>
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default FormInput;
