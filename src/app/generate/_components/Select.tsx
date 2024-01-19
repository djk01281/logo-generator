type selectProps = {
  selectArray: string[];
  selectFn: (option: string) => void;
  selectCurrent: string;
};

export const Select = (selectProps: selectProps) => {
  const { selectArray, selectFn, selectCurrent } = selectProps;
  return (
    <div className="ml-auto flex flex-col gap-4 ">
      {selectArray.map((option, index) => (
        <div
          key={index}
          onClick={() => {
            selectFn(option);
          }}
          className={`animate-fade-down animate-duration-[750ms] animate-once animate-delay-${(
            500 +
            index * 25
          ).toString()} z-40 flex gap-[12px] rounded p-[12px] animate-ease-in animate-ease-out hover:cursor-pointer ${
            selectCurrent === option ? "bg-[#eaeaea]" : "hover:bg-[#fafafa]"
          } `}
        >
          <span className="h-[24px] w-[24px] rounded border-[1px] border-[#eaeaea] bg-white text-center text-[14px] font-normal">
            {index + 1}
          </span>
          <button className="" key={option}>
            {option}
          </button>
          {selectCurrent === option ? (
            <span className="flex flex-grow justify-end">
              <svg
                className="with-icon_icon__MHUeb text-success"
                data-testid="geist-icon"
                height="24"
                shapeRendering="geometricPrecision"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                width="24"
              >
                <path
                  d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                  fill="white"
                  stroke="currentColor"
                />
                <path
                  d="M8 11.8571L10.5 14.3572L15.8572 9"
                  fill="none"
                  stroke="var(--geist-stroke)"
                />
              </svg>
            </span>
          ) : (
            ""
          )}
        </div>
      ))}
    </div>
  );
};
