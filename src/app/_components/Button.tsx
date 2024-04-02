type buttonProps = {
  text: string;
  fn: () => void;
};

export const Button = (buttonProps: buttonProps) => {
  return (
    <button
      className={`ml-auto ${buttonProps.text === "start" ? "ml-0" : ""} select-none rounded-md border-[1px] 
              border-[#eaeaea] bg-[#262628] ${buttonProps.text === "start" ? "bg-red-400" : ""}
           flex flex-row items-center gap-1 p-3 py-2 font-sans text-[14px] text-white no-underline transition hover:border-[#383838] hover:bg-[#383838]`}
      onClick={buttonProps.fn}
    >
      <span>{buttonProps.text}</span>
      <span>
        {buttonProps.text === "start" ? (
          <span className="flex flex-row items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
              />
            </svg>
            <span>1</span>
          </span>
        ) : null}
      </span>
    </button>
  );
};

export const LoadingButton = () => {
  return (
    <button
      disabled={true}
      className={`relative order-[1.5px] ml-auto  flex cursor-not-allowed select-none items-center gap-2
       rounded-md border-[1px] border-[#eaeaea] bg-[#f2f2f2] px-3 py-3 font-sans text-[14px] text-[8f8f8f] no-underline transition`}
    >
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 animate-spin stroke-[#666]"
      >
        <path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"></path>
      </svg>
      <span>Loading</span>
    </button>
  );
};
